import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

// SERVICES
import { BankAccountService } from '@/modules/bank-account/bank-account.service';
import { StateBankAccountService } from '@/modules/bank-account/state-bank-account/state-bank-account.service';
import { UserClientService } from '@/modules/user/user-client/user-client.service';
import { TransactionService } from '@/modules/transaction/transaction.service';
import { PaymentProviderService } from '@/modules/payment-provider/payment-provider.service';

// ENTITIES
import { UserClient } from '@/modules/user/user-client/user-client.entity';
import { ClientBankAccount } from './client-bank-account.entity';

// ENUMS
import { PaymentProvider } from '@/modules/payment-provider/payment-provider.enum';
import { ApiModules } from '@/logger/api-modules.enum';
import {
  StateName,
  StateDescription,
} from '@/modules/management/state/state.enum';

@Injectable()
export class ClientBankAccountService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private bankAccountService: BankAccountService,
    @InjectRepository(ClientBankAccount)
    private clientBankAccountRepository: Repository<ClientBankAccount>,
    private stateBankAccountService: StateBankAccountService,
    private userClientService: UserClientService,
    private transactionService: TransactionService,
    private paymentProviderService: PaymentProviderService,
  ) {}

  async createClientBankAccount(
    bankAccountCreateParams,
  ): Promise<ClientBankAccount> {
    let userClient = await this.userClientService.getActiveClient(
      bankAccountCreateParams.email,
    );
    userClient = await this.userClientService.getClient(userClient.email);

    const bankAccount = await this.bankAccountService.createBankAccount(
      bankAccountCreateParams,
    );

    const paymentProviderBankAccount = await this.paymentProviderService.createBankAccount(
      userClient,
      bankAccountCreateParams,
    );

    const clientBankAccount = await this.clientBankAccountRepository
      .create({
        bankAccount,
        userClient,
        transferId: paymentProviderBankAccount.transferId,
        chargeId: paymentProviderBankAccount.chargeId,
        paymentProvider: PaymentProvider.STRIPE,
      })
      .save();

    await this.stateBankAccountService.createStateBankAccount(
      StateName.VERIFYING,
      clientBankAccount,
      StateDescription.NEWLY_CREATED_ACCOUNT,
    );

    await this.transactionService.createVerificationTransaction(
      clientBankAccount,
    );

    this.logger.verbose(
      `[${ApiModules.BANK_ACCOUNT}] {${bankAccountCreateParams.email}} Bank account successfully created`,
    );

    return clientBankAccount;
  }

  async verifyBankAccount(verificationRequest: {
    clientBankAccountId: number;
    amounts: number[];
  }) {
    const clientBankAccount = await this.clientBankAccountRepository.findOne({
      idClientBankAccount: verificationRequest.clientBankAccountId,
    });

    if (
      !(await this.checkCorrectVerificationAmounts(
        clientBankAccount,
        verificationRequest.amounts,
      ))
    ) {
      const message = `[${ApiModules.BANK_ACCOUNT}] Invalid verification amounts for the client bank account ID ${clientBankAccount.idClientBankAccount}`;
      this.logger.error(message);
      throw new BadRequestException(message);
    }

    const verification = await this.paymentProviderService.verifyBankAccount({
      customerId: clientBankAccount.userClient.userDetails.customerId,
      bankAccountId: clientBankAccount.chargeId,
      amounts: verificationRequest.amounts,
    });

    await this.stateBankAccountService.createStateBankAccount(
      StateName.ACTIVE,
      clientBankAccount,
      StateDescription.BANK_ACCOUNT_VALIDATION,
    );
    return verification;
  }

  async checkCorrectVerificationAmounts(clientBankAccount, amounts) {
    const transactions = await this.transactionService.getClientBankAccountTransaction(
      clientBankAccount,
    );
    let correctValues = true;

    transactions.forEach(transaction => {
      if (!amounts.includes(transaction.totalAmountWithInterest / 100)) {
        correctValues = false;
      }
    });

    return correctValues;
  }
  async getClientBankAccount(
    userClient: UserClient,
    idBankAccount: number,
  ): Promise<ClientBankAccount> {
    const bankAccount = await this.clientBankAccountRepository.find({
      where: `userClient.idUserClient = ${userClient.idUserClient} AND bankAccount.idBankAccount = ${idBankAccount}`,
      join: {
        alias: 'clientBankAccount',
        innerJoin: {
          bankAccount: 'clientBankAccount.bankAccount',
          userClient: 'clientBankAccount.userClient',
        },
      },
    });
    return bankAccount[0];
  }
}
