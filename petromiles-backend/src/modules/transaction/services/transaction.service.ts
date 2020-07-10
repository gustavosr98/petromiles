import { TransactionDetails } from '@/modules/transaction/interfaces/transaction-details.interface';
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { Repository } from 'typeorm';

// SERVICES
import { PlatformInterestService } from '@/modules/management/services/platform-interest.service';
import { PointsConversionService } from '@/modules/management/services/points-conversion.service';
import { ThirdPartyInterestService } from '@/modules/management/services/third-party-interest.service';
import { TransactionInterestService } from '@/modules/transaction/services/transaction-interest.service';
import { StateTransactionService } from '@/modules/transaction/services/state-transaction.service';

// ENTITIES
import { ClientBankAccount } from '@/entities/client-bank-account.entity';
import { Transaction } from '@/entities/transaction.entity';
import { Suscription } from '@/entities/suscription.entity';

// INTERFACES
import { PlatformInterest } from '@/enums/platform-interest.enum';
import { TransactionType } from '@/enums/transaction.enum';
import { StateName, StateDescription } from '@/enums/state.enum';
import { ApiModules } from '@/logger/api-modules.enum';
import { PaymentProvider } from '@/enums/payment-provider.enum';
import { UserClient } from '@/entities/user-client.entity';
import { ConfirmationTicket } from '@/interfaces/third-party-clients/confirmation-ticket.interface';
import { AddPointsRequestCurrency } from '@/enums/add-points-request-currency.enum';
import { PlatformInterestType } from '@/enums/platform-interest-type.enum';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(UserClient)
    private userClientRepository: Repository<UserClient>,
    private platformInterestService: PlatformInterestService,
    private pointsConversionService: PointsConversionService,
    private thirdPartyInterestService: ThirdPartyInterestService,
    private transactionInterestService: TransactionInterestService,
    private stateTransactionService: StateTransactionService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async getAllFiltered(
    stateNames: StateName[],
    transactionsTypes: TransactionType[],
    paymentProviders: PaymentProvider[],
    idClientBankAccount?: number,
    isVerification?: boolean,
  ): Promise<Transaction[]> {
    const transactions: Transaction[] = await this.transactionRepository.query(
      `
      SELECT 
        TRANSACTION.*, CLIENT_BANK_ACCOUNT.fk_user_client AS "idUserClient"
      FROM
        TRANSACTION, STATE_TRANSACTION, STATE, CLIENT_BANK_ACCOUNT
      WHERE
        -- relations
        STATE_TRANSACTION."fk_transaction" = TRANSACTION."idTransaction"
        AND STATE_TRANSACTION."fk_state" = STATE."idState"
        AND TRANSACTION."fk_client_bank_account" = CLIENT_BANK_ACCOUNT."idClientBankAccount"
        -- conditions
        AND STATE_TRANSACTION."finalDate" IS NULL
        AND STATE.name = ANY($1)
        AND TRANSACTION."paymentProviderTransactionId" IS ${
          isVerification ? '' : 'NOT'
        } NULL
        AND TRANSACTION."type" = ANY($2)
        ${
          !idClientBankAccount
            ? ''
            : `AND CLIENT_BANK_ACCOUNT."idClientBankAccount" = ${idClientBankAccount}`
        }
        AND CLIENT_BANK_ACCOUNT."paymentProvider" = ANY($3);
    `,
      [stateNames, transactionsTypes, paymentProviders],
    );

    return transactions;
  }

  async getTransactionsAdmin(): Promise<App.Transaction.TransactionDetails[]> {
    const transactions = await this.transactionRepository.find({
      where: `stateTransaction.finalDate is null AND trans.transaction is null`,
      join: {
        alias: 'trans',
        leftJoinAndSelect: {
          clientOnThirdParty: 'trans.clientOnThirdParty',
          thirdPartyClient: 'clientOnThirdParty.thirdPartyClient',
          user: 'clientOnThirdParty.userClient',
          clientBankAccount: 'trans.clientBankAccount',
          bankAccount: 'clientBankAccount.bankAccount',
          stateTransaction: 'trans.stateTransaction',
          state: 'stateTransaction.state',
          transactionInterest: 'trans.transactionInterest',
          thirdPartyInterest: 'transactionInterest.thirdPartyInterest',
          platformInterest: 'transactionInterest.platformInterest',
          platformInterestExtraPoints:
            'transactionInterest.platformInterestExtraPoints',
          userClient: 'clientBankAccount.userClient',
        },
      },
    });
    return transactions.map(transaction => {
      return transaction.calculateDetails();
    });
  }

  async getThirdPartyTransactions(params: {
    idThirdPartyClient?: number;
    apiKey?: string;
    filter?: {
      transactionIds?: number[];
    };
  }): Promise<TransactionDetails[]> {
    let where = !!params.idThirdPartyClient
      ? `"thirdPartyClient"."idThirdPartyClient" = ${params.idThirdPartyClient}`
      : `"thirdPartyClient"."apiKey" = '${params.apiKey}'`;

    if (!!params.filter?.transactionIds) {
      where =
        where +
        ' AND ' +
        ` transaction."idTransaction" IN( ${params.filter.transactionIds.toString()} ) `;
    }

    const transactions = await this.transactionRepository.find({
      where,
      join: {
        alias: 'transaction',
        innerJoinAndSelect: {
          clientOnThirdParty: 'transaction.clientOnThirdParty',
          userClient: 'clientOnThirdParty.userClient',
          thirdPartyClient: 'clientOnThirdParty.thirdPartyClient',
        },
      },
    });
    return transactions.map(transaction => transaction.calculateDetails());
  }

  async getTransactionInterests(options: App.Transaction.TransactionInterests) {
    const interest = await this.platformInterestService.getInterestByName(
      options.platformInterestType,
    );

    const extraPoints = options.platformInterestExtraPointsType
      ? await this.platformInterestService.getInterestByName(
          options.platformInterestExtraPointsType,
        )
      : null;

    const pointsConversion = await this.pointsConversionService.getRecentPointsConversion();

    const thirdPartyInterest = await this.thirdPartyInterestService.getCurrentInterest(
      options.thirdPartyInterestType,
      options.type,
    );
    return {
      interest,
      extraPoints,
      pointsConversion,
      thirdPartyInterest,
    };
  }

  async getTransactions(
    idUserClient: number,
  ): Promise<App.Transaction.TransactionDetails[]> {
    const email = (await this.userClientRepository.findOne({ idUserClient }))
      .email;

    const transactions = await this.transactionRepository.find({
      where: `(userClient.email = '${email}' OR user.email= '${email}') AND stateTransaction.finalDate is null AND trans.transaction is null`,
      join: {
        alias: 'trans',
        leftJoinAndSelect: {
          clientOnThirdParty: 'trans.clientOnThirdParty',
          user: 'clientOnThirdParty.userClient',
          thirdPartyClient: 'clientOnThirdParty.thirdPartyClient',
          clientBankAccount: 'trans.clientBankAccount',
          bankAccount: 'clientBankAccount.bankAccount',
          stateTransaction: 'trans.stateTransaction',
          state: 'stateTransaction.state',
          transactionInterest: 'trans.transactionInterest',
          thirdPartyInterest: 'transactionInterest.thirdPartyInterest',
          platformInterest: 'transactionInterest.platformInterest',
          platformInterestExtraPoints:
            'transactionInterest.platformInterestExtraPoints',
          userClient: 'clientBankAccount.userClient',
        },
      },
    });

    return transactions.map(transaction => {
      return transaction.calculateDetails();
    });
  }

  async get(
    idTransaction: number,
  ): Promise<App.Transaction.TransactionDetails> {
    const transaction = await this.transactionRepository.findOne(idTransaction);
    return transaction.calculateDetails();
  }

  async createTransaction(
    options: App.Transaction.TransactionCreation,
    state: StateName,
  ): Promise<Transaction> {
    const transaction: Transaction = await this.transactionRepository.save(
      options,
    );

    await this.stateTransactionService.createStateTransaction(
      transaction,
      options.stateTransactionDescription,
      state,
    );

    await this.transactionInterestService.createTransactionInterest(
      transaction,
      options.thirdPartyInterest,
      options.platformInterest,
      options.promotion,
      options.platformInterestExtraPoints,
    );

    this.logger.silly(
      `[${ApiModules.TRANSACTION}] Transaction ID: ${transaction.idTransaction} was created`,
    );

    return transaction;
  }

  async getClientBankAccountTransaction(clientBankAccount) {
    return await this.transactionRepository.find({ clientBankAccount });
  }

  // BANK ACCOUNT VERIFICATION TRANSACTION

  private generateRandomAmounts(
    amount: number,
    paymentProviderInterest: number,
  ) {
    const max = amount - paymentProviderInterest;
    const baseRandomAmount = Math.round(
      Math.random() * (max - paymentProviderInterest) + paymentProviderInterest,
    );
    const randomAmount = Math.round(amount - baseRandomAmount);
    return [baseRandomAmount, randomAmount];
  }

  async createVerificationTransaction(clientBankAccount: ClientBankAccount) {
    this.logger.verbose(
      `[${ApiModules.TRANSACTION}] Creating bank account verification transactions`,
    );

    const options = await this.getTransactionInterests({
      platformInterestType: PlatformInterest.VERIFICATION,
      platformInterestExtraPointsType: null,
      thirdPartyInterestType: PaymentProvider.STRIPE,
      type: TransactionType.DEPOSIT,
    });

    const randomAmounts = this.generateRandomAmounts(
      parseInt(options.interest.amount),
      options.thirdPartyInterest.amountDollarCents,
    );

    this.logger.verbose(
      `[${ApiModules.TRANSACTION}] id: ${
        clientBankAccount.idClientBankAccount
      } | last4: ${clientBankAccount.bankAccount.accountNumber.substr(
        -4,
      )} Random amounts for each transaction are: [${randomAmounts[0] /
        100}, ${randomAmounts[1] / 100}]`,
    );

    let verificationTransaction: Transaction = null;
    for (let i = 0; i < randomAmounts.length; i++) {
      verificationTransaction = await this.createTransaction(
        {
          totalAmountWithInterest: randomAmounts[i],
          transaction: verificationTransaction,
          rawAmount: 0,
          type: TransactionType.BANK_ACCOUNT_VALIDATION,
          pointsConversion: options.pointsConversion,
          clientBankAccount: clientBankAccount,
          thirdPartyInterest: options.thirdPartyInterest,
          platformInterest: options.interest,
          stateTransactionDescription:
            StateDescription.VERIFICATION_TRANSACTION_CREATION,
        },
        StateName.VERIFYING,
      );
    }
  }

  // TRANSACTION TO UPGRADE TO PREMIUM

  async createUpgradeSuscriptionTransaction(
    clientBankAccount: ClientBankAccount,
    suscription: Suscription,
    paymentProviderTransactionId: string,
  ): Promise<Transaction> {
    const options = await this.getTransactionInterests({
      platformInterestType: PlatformInterest.PREMIUM_EXTRA,
      platformInterestExtraPointsType: null,
      thirdPartyInterestType: PaymentProvider.STRIPE,
      type: TransactionType.DEPOSIT,
    });

    return await this.createTransaction(
      {
        totalAmountWithInterest:
          suscription.cost + options.thirdPartyInterest.amountDollarCents,
        rawAmount: 0,
        type: TransactionType.SUSCRIPTION_PAYMENT,
        pointsConversion: options.pointsConversion,
        clientBankAccount: clientBankAccount,
        thirdPartyInterest: options.thirdPartyInterest,
        platformInterest: options.interest,
        stateTransactionDescription: StateDescription.SUSCRIPTION_UPGRADE,
        paymentProviderTransactionId,
      },
      StateName.VERIFYING,
    );
  }

  //POINT PURCHASE TRANSACTION
  async createDeposit(
    clientBankAccount: ClientBankAccount,
    extraPointsType: PlatformInterest,
    amount: number,
    paymentProviderTransactionId: string,
  ): Promise<Transaction> {
    const options = await this.getTransactionInterests({
      platformInterestType: PlatformInterest.BUY,
      platformInterestExtraPointsType: extraPointsType,
      thirdPartyInterestType: PaymentProvider.STRIPE,
      type: TransactionType.DEPOSIT,
    });

    return await this.createTransaction(
      {
        totalAmountWithInterest:
          options.thirdPartyInterest.amountDollarCents +
          parseFloat(options.interest.percentage) * amount,
        rawAmount: await this.calculateExtraPoints(options.extraPoints, amount),
        type: TransactionType.DEPOSIT,
        pointsConversion: options.pointsConversion,
        clientBankAccount,
        thirdPartyInterest: options.thirdPartyInterest,
        platformInterest: options.interest,
        stateTransactionDescription: StateDescription.DEPOSIT,
        platformInterestExtraPoints: options.extraPoints,
        operation: 1,
        paymentProviderTransactionId,
      },
      StateName.VERIFYING,
    );
  }

  private async calculateExtraPoints(extraPoints, amount: number) {
    if (!extraPoints) return amount;
    const extra = 1 + parseFloat(extraPoints.percentage);

    if (extraPoints.name === PlatformInterest.PREMIUM_EXTRA)
      return extra * amount;

    if (extraPoints.name === PlatformInterest.GOLD_EXTRA) {
      const conversion =
        (await this.pointsConversionService.getRecentPointsConversion())
          .onePointEqualsDollars * 100;

      return amount * extra + parseFloat(extraPoints.points) * conversion;
    }
  }

  // WITHDRAWAL TRANSACTION
  async createWithdrawalTransaction(
    clientBankAccount: ClientBankAccount,
    amount: number,
    paymentProviderTransactionId: string,
  ): Promise<Transaction> {
    const options = await this.getTransactionInterests({
      platformInterestType: PlatformInterest.WITHDRAWAL,
      platformInterestExtraPointsType: null,
      thirdPartyInterestType: PaymentProvider.STRIPE,
      type: TransactionType.WITHDRAWAL,
    });

    return await this.createTransaction(
      {
        totalAmountWithInterest:
          options.thirdPartyInterest.amountDollarCents +
          parseFloat(options.interest.percentage) * amount,
        rawAmount: amount,
        type: TransactionType.WITHDRAWAL,
        pointsConversion: options.pointsConversion,
        clientBankAccount,
        thirdPartyInterest: options.thirdPartyInterest,
        platformInterest: options.interest,
        stateTransactionDescription: StateDescription.WITHDRAWAL,
        operation: -1,
        paymentProviderTransactionId,
      },
      StateName.VALID,
    );
  }

  async getExtraPointsOfATransaction(idTransaction: number) {
    const transaction = await this.transactionRepository.findOne(idTransaction);

    return await this.transactionInterestService.getExtraPointsTypeByTransaction(
      transaction,
    );
  }
}
