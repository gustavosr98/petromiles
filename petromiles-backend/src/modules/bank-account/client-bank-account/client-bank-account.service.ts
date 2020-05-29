import { State } from '@/modules/management/state/state.entity';
import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository, getConnection } from 'typeorm';

import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

// SERVICES
import { BankAccountService } from '@/modules/bank-account/bank-account.service';
import { StateBankAccountService } from '@/modules/bank-account/state-bank-account/state-bank-account.service';
import { UserClientService } from '@/modules/user/user-client/user-client.service';
import { TransactionService } from '@/modules/transaction/transaction.service';
import { StateTransactionService } from '@/modules/transaction/state-transaction/state-transaction.service';
import { PaymentProviderService } from '@/modules/payment-provider/payment-provider.service';

// ENTITIES
import { UserClient } from '@/modules/user/user-client/user-client.entity';
import { ClientBankAccount } from './client-bank-account.entity';
import { StateBankAccount } from '@/modules/bank-account/state-bank-account/state-bank-account.entity';

// ENUMS
import { PaymentProvider } from '@/modules/payment-provider/payment-provider.enum';
import { ApiModules } from '@/logger/api-modules.enum';
import {
  StateName,
  StateDescription,
} from '@/modules/management/state/state.enum';
import { TransactionType } from '@/modules/transaction/transaction/transaction.enum';

@Injectable()
export class ClientBankAccountService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private bankAccountService: BankAccountService,
    @InjectRepository(ClientBankAccount)
    private clientBankAccountRepository: Repository<ClientBankAccount>,
    private stateTransactionService: StateTransactionService,
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

    await this.stateBankAccountService.updateStateBankAccount(
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
      throw new BadRequestException('error-messages.invalidVerification');
    }

    const verification = await this.paymentProviderService.verifyBankAccount({
      customerId: clientBankAccount.userClient.userDetails.customerId,
      bankAccountId: clientBankAccount.chargeId,
      amounts: verificationRequest.amounts,
    });

    await this.stateBankAccountService.updateStateBankAccount(
      StateName.ACTIVE,
      clientBankAccount,
      StateDescription.BANK_ACCOUNT_VALIDATION,
    );

    const verificationTransactions = await this.transactionService.getAllFiltered(
      [StateName.VERIFYING],
      [TransactionType.BANK_ACCOUNT_VALIDATION],
      [PaymentProvider.STRIPE],
      clientBankAccount.idClientBankAccount,
      true,
    );

    await this.stateTransactionService.update(
      StateName.VALID,
      verificationTransactions[0],
    );
    await this.stateTransactionService.update(
      StateName.VALID,
      verificationTransactions[1],
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

  async updateState(
    idClientBankAccount: number,
    state: StateName,
    description?: string,
  ): Promise<StateBankAccount> {
    const clientBankAccount: ClientBankAccount = await this.clientBankAccountRepository.findOne(
      {
        idClientBankAccount,
      },
    );

    return await this.stateBankAccountService.updateStateBankAccount(
      state,
      clientBankAccount,
      description,
    );
  }

  async getByState(
    states: StateName[],
  ): Promise<
    (ClientBankAccount & {
      email: string;
      customerId: string;
      idStateBankAccount: number;
    })[]
  > {
    const bankAccounts = await getConnection().query(
      `
      SELECT
        CLIENT_BANK_ACCOUNT.*, USER_CLIENT.email, USER_DETAILS."customerId",  STATE_BANK_ACCOUNT."idStateBankAccount"
      FROM 
        CLIENT_BANK_ACCOUNT,
        USER_CLIENT,
        USER_DETAILS, 
        STATE_USER,
        STATE_BANK_ACCOUNT,
        STATE STATE_BA,
        STATE STATE_U
      WHERE
        -- Relations
        CLIENT_BANK_ACCOUNT.fk_user_client = USER_CLIENT."idUserClient"
        AND STATE_BANK_ACCOUNT.fk_client_bank_account = CLIENT_BANK_ACCOUNT."idClientBankAccount"
        AND STATE_BANK_ACCOUNT.fk_state = STATE_BA."idState"
        AND STATE_USER.fk_user_client = USER_CLIENT."idUserClient"
        AND STATE_USER.fk_state = STATE_U."idState" 
        AND USER_DETAILS.fk_user_client = USER_CLIENT."idUserClient"
        -- Conditions
        AND STATE_BANK_ACCOUNT."finalDate" IS NULL
        AND STATE_U.name = 'active'
        AND STATE_BA.name = ANY($1)    
    `,
      [states],
    );
    return bankAccounts;
  }
}
