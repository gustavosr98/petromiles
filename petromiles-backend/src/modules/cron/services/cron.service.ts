import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { SchedulerRegistry, Timeout, Interval } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';

import { getConnection, In, UpdateResult } from 'typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// CONSTANTS
import { MailsSubjets } from '@/constants/mailsSubjectConst';

// SERVICES
import { StripeService } from '@/modules/payment-provider/stripe/stripe.service';
import { ClientBankAccountService } from '@/modules/bank-account/services/client-bank-account.service';
import { TransactionService } from '@/modules/transaction/services/transaction.service';
import { StateTransactionService } from '@/modules/transaction/services/state-transaction.service';
import { SuscriptionService } from '@/modules/suscription/service/suscription.service';
import { MailsService } from '@/modules/mails/mails.service';

// ENTITIES
import { Task } from '@/entities/task.entity';
import { Transaction } from '@/entities/transaction.entity';

// INTERFACES
import { ApiModules } from '@/logger/api-modules.enum';
import { StateName, StateDescription } from '@/enums/state.enum';
import { StripeBankAccountStatus } from '@/modules/payment-provider/stripe/bank-account-status.enum';
import { StripeChargeStatus } from '@/modules/payment-provider/stripe/stripe-charge-status.enum';
import { CronJobs } from '@/enums/cron-jobs.enum';
import { TransactionType } from '@/enums/transaction.enum';
import { PaymentProvider } from '@/enums/payment-provider.enum';

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
    private suscriptionService: SuscriptionService,
    private mailsService: MailsService,
    private configService: ConfigService,
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
  async getTasks(): Promise<Task[]> {
    return await this.taskRepository.find({
      where: {
        name: In([
          CronJobs.TRANSACTION_CHARGE_STATUS_STRIPE,
          CronJobs.TRANSACTION_TRANSFER_STATUS_STRIPE,
        ]),
      },
    });
  }

  async getTask(jobName: CronJobs) {
    return await this.taskRepository.findOne({ name: jobName });
  }

  async updateTask(
    jobName: CronJobs,
    jobFrequency: number,
  ): Promise<UpdateResult> {
    const result = await this.taskRepository.update(
      { name: jobName },
      { frequency: jobFrequency },
    );
    return result;
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
      [TransactionType.DEPOSIT, TransactionType.SUSCRIPTION_PAYMENT],
      [PaymentProvider.STRIPE],
    );
    this.logger.info(
      `[${ApiModules.CRON}] transactionChargeStatusStripe( ${unverifiedTransactions.length} )`,
    );

    unverifiedTransactions.map(async unverifiedTransaction => {
      const charge = await this.stripeService.getCharge(
        unverifiedTransaction.paymentProviderTransactionId,
      );

      const transaction = await getConnection()
        .getRepository(Transaction)
        .findOne({ idTransaction: unverifiedTransaction.idTransaction });

      const languageMails =
        transaction.clientBankAccount.userClient.userDetails.language.name;
      const points =
        transaction.rawAmount /
        transaction.pointsConversion.onePointEqualsDollars /
        100;

      if (charge.status === StripeChargeStatus.SUCCEEDED) {
        await this.stateTransactionService.update(
          StateName.VALID,
          unverifiedTransaction,
          StateDescription.CHANGE_VERIFICATION_TO_VALID,
        );

        const template = `successfulPointsPayment[${languageMails}]`;
        const subject = MailsSubjets.successful_points_payment[languageMails];

        const msg = {
          to: transaction.clientBankAccount.userClient.email,
          subject: subject,
          templateId: this.configService.get<string>(
            `mails.sendgrid.templates.${template}`,
          ),
          dynamic_template_data: {
            user:
              transaction.clientBankAccount.userClient.userDetails.firstName,
            numberPoints: points,
          },
        };
        this.mailsService.sendEmail(msg);

        this.suscriptionService.upgradeSubscriptionIfIsPossible(
          unverifiedTransaction.idUserClient,
          unverifiedTransaction,
        );
      } else if (charge.status === StripeChargeStatus.FAILED) {
        if (charge.failure_code === StateDescription.NO_ACCOUNT.toLowerCase()) {
          await this.stateTransactionService.update(
            StateName.INVALID,
            unverifiedTransaction,
            StateDescription.NO_ACCOUNT,
          );

          this.logger.error(
            `[${ApiModules.CRON}] transactionChargeStatusStripe( ${charge.failure_message} )`,
          );
        } else if (
          charge.failure_code === StateDescription.ACCOUNT_CLOSED.toLowerCase()
        ) {
          await this.stateTransactionService.update(
            StateName.INVALID,
            unverifiedTransaction,
            StateDescription.ACCOUNT_CLOSED,
          );

          this.logger.error(
            `[${ApiModules.CRON}] transactionChargeStatusStripe( ${charge.failure_message} )`,
          );
        } else if (
          charge.failure_code ===
          StateDescription.INSUFFICIENT_FUNDS.toLowerCase()
        ) {
          await this.stateTransactionService.update(
            StateName.INVALID,
            unverifiedTransaction,
            StateDescription.INSUFFICIENT_FUNDS,
          );

          this.logger.error(
            `[${ApiModules.CRON}] transactionChargeStatusStripe( ${charge.failure_message} )`,
          );
        } else if (
          charge.failure_code ===
          StateDescription.DEBIT_NOT_AUTHORIZED.toLowerCase()
        ) {
          await this.stateTransactionService.update(
            StateName.INVALID,
            unverifiedTransaction,
            StateDescription.DEBIT_NOT_AUTHORIZED,
          );

          this.logger.error(
            `[${ApiModules.CRON}] transactionChargeStatusStripe( ${charge.failure_message} )`,
          );
        } else if (
          charge.failure_code ===
          StateDescription.INVALID_CURRENCY.toLowerCase()
        ) {
          await this.stateTransactionService.update(
            StateName.INVALID,
            unverifiedTransaction,
            StateDescription.INVALID_CURRENCY,
          );

          this.logger.error(
            `[${ApiModules.CRON}] transactionChargeStatusStripe( ${charge.failure_message} )`,
          );
        }

        const template = `failedPointsPayment[${languageMails}]`;
        const subject = MailsSubjets.failed_points_payment[languageMails];

        const msg = {
          to: transaction.clientBankAccount.userClient.email,
          subject: subject,
          templateId: this.configService.get<string>(
            `mails.sendgrid.templates.${template}`,
          ),
          dynamic_template_data: {
            user:
              transaction.clientBankAccount.userClient.userDetails.firstName,
            numberPoints: points,
          },
        };
        this.mailsService.sendEmail(msg);
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

  async updateJob(jobName: CronJobs, jobFrequency: number) {
    if (jobName === CronJobs.TRANSACTION_CHARGE_STATUS_STRIPE) {
      return await this.adjustJob(jobName, jobFrequency, async () => {
        this.transactionChargeStatusStripe();
      });
    } else if (jobName === CronJobs.TRANSACTION_TRANSFER_STATUS_STRIPE) {
      return await this.adjustJob(jobName, jobFrequency, async () => {
        this.transactionTransferStatusStripe();
      });
    } else {
      throw new BadRequestException('error-messages.unknowCronJob');
    }
  }
}
