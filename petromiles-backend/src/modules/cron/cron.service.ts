import { TransactionType } from '../../enums/transaction.enum';
import { PaymentProvider } from '../../enums/payment-provider.enum';
import { Injectable, Inject } from '@nestjs/common';
import { SchedulerRegistry, Timeout, Interval } from '@nestjs/schedule';

import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// SERVICES
import { StripeService } from '@/modules/payment-provider/stripe/stripe.service';
import { ClientBankAccountService } from '@/modules/bank-account/services/client-bank-account.service';
import { TransactionService } from '@/modules/transaction/services/transaction.service';
import { StateTransactionService } from '@/modules/transaction/services/state-transaction.service';

// ENTITIES
import { Task } from '@/entities/task.entity';

// INTERFACES
import { ApiModules } from '@/logger/api-modules.enum';
import { CronJobs } from './cron-jobs.enum';
import { StateName } from '@/enums/state.enum';
import { StripeBankAccountStatus } from '@/modules/payment-provider/stripe/bank-account-status.enum';
import { StripeChargeStatus } from '@/modules/payment-provider/stripe/stripe-charge-status.enum';

@Injectable()
export class CronService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private schedulerRegistry: SchedulerRegistry,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    private stripeService: StripeService,
    private clientBankAccountService: ClientBankAccountService,
    private transactionService: TransactionService,
    private stateTransactionService: StateTransactionService,
  ) {}

  @Timeout(1000)
  private async bootstrapJobs() {
    if (!!process.env.CRON_INCLUDE) {
      this.logger.warn(`[${ApiModules.CRON}] Bootstraping cron jobs`);
      await this.bankAccountStatusStripe();
      await this.transactionChargeStatusStripe();
      await this.transactionTransferStatusStripe();

      this.adjustJob(CronJobs.BANK_ACCOUNT_STATUS_STRIPE, null, async () => {
        await this.bankAccountStatusStripe();
      });
      this.adjustJob(
        CronJobs.TRANSACTION_CHARGE_STATUS_STRIPE,
        null,
        async () => {
          await this.transactionChargeStatusStripe();
        },
      );
    }
  }

  // DATABASE
  async getTasks() {
    return await this.taskRepository.find();
  }

  async getTask(jobName: CronJobs) {
    return await this.taskRepository.findOne({ name: jobName });
  }

  async updateTask(jobName: CronJobs, jobFrequency: number) {
    return await this.taskRepository.update(
      { name: jobName },
      { frequency: jobFrequency },
    );
  }

  // BUSINESS JOBS
  @Interval(CronJobs.BANK_ACCOUNT_STATUS_STRIPE, 99999999)
  async bankAccountStatusStripe() {
    const bankAccounts = await this.clientBankAccountService.getByState(
      Array(StateName.ACTIVE),
    );
    this.logger.info(
      `[${ApiModules.CRON}] bankAccountStatusStripe( ${bankAccounts.length} )`,
    );

    bankAccounts.map(async bankAccount => {
      const bankAccountResponse = await this.stripeService.getBankAccount({
        customerId: bankAccount.customerId,
        bankAccountId: bankAccount.chargeId,
      });
      if (bankAccountResponse.status === StripeBankAccountStatus.ERRORED) {
        await this.clientBankAccountService.updateState(
          bankAccount.idClientBankAccount,
          StateName.CANCELLED,
        );
      }
    });
  }

  @Interval(CronJobs.TRANSACTION_CHARGE_STATUS_STRIPE, 99999999)
  async transactionChargeStatusStripe() {
    const unverifiedTransactions = await this.transactionService.getAllFiltered(
      [StateName.VERIFYING],
      [TransactionType.DEPOSIT],
      [PaymentProvider.STRIPE],
    );
    this.logger.info(
      `[${ApiModules.CRON}] transactionChargeStatusStripe( ${unverifiedTransactions.length} )`,
    );

    unverifiedTransactions.map(async unverifiedTransaction => {
      const charge = await this.stripeService.getCharge(
        unverifiedTransaction.paymentProviderTransactionId,
      );
      if (charge.status === StripeChargeStatus.SUCCEEDED) {
        await this.stateTransactionService.update(
          StateName.VALID,
          unverifiedTransaction,
        );
      } else if (charge.status === StripeChargeStatus.FAILED) {
        await this.stateTransactionService.update(
          StateName.INVALID,
          unverifiedTransaction,
        );
      }
    });
  }

  @Interval(CronJobs.TRANSACTION_TRANSFER_STATUS_STRIPE, 99999999)
  async transactionTransferStatusStripe() {
    this.logger.info(`[${ApiModules.CRON}] transactionTransferStatusStripe()`);
  }

  // CRON ADJUSTMENTS
  async adjustJob(jobName: CronJobs, jobFrequency: number, callback) {
    let frequency = null;
    if (jobFrequency === null) {
      const task = await this.getTask(jobName);
      frequency = task.frequency;
    } else {
      frequency = jobFrequency;
      await this.updateTask(jobName, jobFrequency);
    }

    this.schedulerRegistry.deleteInterval(jobName);

    const interval = setInterval(callback, frequency);
    this.schedulerRegistry.addInterval(jobName, interval);

    this.logger.warn(
      `[${ApiModules.CRON}] ${jobName} to be excecuted every ${frequency /
        1000} seconds`,
    );
  }
}
