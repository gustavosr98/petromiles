import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { WINSTON_MODULE_PROVIDER, WinstonModuleOptions } from 'nest-winston';
import { Logger } from 'winston';

import { Repository } from 'typeorm';

// SERVICES
import { PlatformInterestService } from '@/modules/management/platform-interest/platform-interest.service';
import { PointsConversionService } from '@/modules/management/points-conversion/points-conversion.service';
import { ThirdPartyInterestService } from '@/modules/management/third-party-interest/third-party-interest.service';
import { TransactionInterestService } from '@/modules/transaction/transaction-interest/transaction-interest.service';
import { StateTransactionService } from '@/modules/transaction/state-transaction/state-transaction.service';
import { PaymentProviderService } from '@/modules/payment-provider/payment-provider.service';

// ENTITIES
import { ClientBankAccount } from '../bank-account/client-bank-account/client-bank-account.entity';
import { Transaction } from './transaction/transaction.entity';
import { Suscription } from '../suscription/suscription/suscription.entity';

// INTERFACES
import { PlatformInterest } from '../management/platform-interest/platform-interest.enum';
import { TransactionType } from './transaction/transaction.enum';
import { StateName, StateDescription } from '../management/state/state.enum';
import { ApiModules } from '@/logger/api-modules.enum';
import { PaymentProvider } from '@/modules/payment-provider/payment-provider.enum';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private platformInterestService: PlatformInterestService,
    private pointsConversionService: PointsConversionService,
    private thirdPartyInterestService: ThirdPartyInterestService,
    private transactionInterestService: TransactionInterestService,
    private stateTransactionService: StateTransactionService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  // ANY TYPE OF TRANSACTION
  async get(idTransaction: number): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      idTransaction,
    });
    return transaction;
  }

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
        TRANSACTION.* 
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

    const thirdPartyInterest = await this.thirdPartyInterestService.getThirdPartyInterest(
      options.thirdPartyInterestType,
    );
    return {
      interest,
      extraPoints,
      pointsConversion,
      thirdPartyInterest,
    };
  }

  async getTransactions(email: string) {
    const transactions = await this.transactionRepository.find({
      where: `userClient.email = '${email}' AND stateTransaction.finalDate is null AND trans.transaction is null`,
      join: {
        alias: 'trans',
        innerJoinAndSelect: {
          clientBankAccount: 'trans.clientBankAccount',
          stateTransaction: 'trans.stateTransaction',
          state: 'stateTransaction.state',
          transactionInterest: 'trans.transactionInterest',
          platformInterest: 'transactionInterest.platformInterest',
          userClient: 'clientBankAccount.userClient',
        },
      },
    });

    return transactions;
  }

  async getTransaction(
    idTransaction,
  ): Promise<App.Transaction.TransactionInformation> {
    const transaction = await this.transactionRepository.findOne(idTransaction);
    return this.transformTransactionInformation(transaction);
  }

  private transformTransactionInformation(
    transaction: Transaction,
  ): App.Transaction.TransactionInformation {
    const state = transaction.stateTransaction.find(state => !state.finalDate)
      .state.name;

    const amount =
      transaction.rawAmount == 0
        ? parseFloat(
            transaction.transactionInterest[0].platformInterest.amount,
          ) / 100
        : transaction.rawAmount;
    const interest =
      transaction.rawAmount == 0 ? 0 : transaction.totalAmountWithInterest;
    return {
      id: transaction.idTransaction,
      date: transaction.initialDate.toLocaleDateString(),
      type: transaction.type,
      bankAccount: transaction.clientBankAccount.bankAccount.accountNumber.substr(
        -4,
      ),
      equivalent: amount / transaction.pointsConversion.onePointEqualsDollars,
      conversion: 1 / transaction.pointsConversion.onePointEqualsDollars,
      state,
      amount,
      interest,
    };
  }

  async createTransaction(
    options: App.Transaction.TransactionCreation,
  ): Promise<Transaction> {
    const transaction: Transaction = await this.transactionRepository.save(
      options,
    );

    await this.stateTransactionService.createStateTransaction(
      transaction,
      options.stateTransactionDescription,
      StateName.VERIFYING,
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
    const baseRandomAmount = Number(
      (
        Math.random() * (max - paymentProviderInterest) +
        paymentProviderInterest
      ).toFixed(0),
    );
    const randomAmount = Number((amount - baseRandomAmount).toFixed(0));
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
      verificationTransaction = await this.createTransaction({
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
      });
    }
  }

  // TRANSACTION TO UPGRADE TO PREMIUM

  async createUpgradeSuscriptionTransaction(
    clientBankAccount: ClientBankAccount,
    suscription: Suscription,
  ): Promise<Transaction> {
    const options = await this.getTransactionInterests({
      platformInterestType: PlatformInterest.PREMIUM_EXTRA,
      platformInterestExtraPointsType: null,
      thirdPartyInterestType: PaymentProvider.STRIPE,
    });

    return await this.createTransaction({
      totalAmountWithInterest:
        suscription.cost + options.thirdPartyInterest.amountDollarCents,
      rawAmount: 0,
      type: TransactionType.SUSCRIPTION_PAYMENT,
      pointsConversion: options.pointsConversion,
      clientBankAccount: clientBankAccount,
      thirdPartyInterest: options.thirdPartyInterest,
      platformInterest: options.interest,
      stateTransactionDescription: StateDescription.SUSCRIPTION_UPGRADE,
    });
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
    });

    return await this.createTransaction({
      totalAmountWithInterest:
        options.thirdPartyInterest.amountDollarCents +
        parseFloat(options.interest.percentage) * amount,
      rawAmount: this.calculateExtraPoints(options.extraPoints, amount),
      type: TransactionType.DEPOSIT,
      pointsConversion: options.pointsConversion,
      clientBankAccount,
      thirdPartyInterest: options.thirdPartyInterest,
      platformInterest: options.interest,
      stateTransactionDescription: StateDescription.DEPOSIT,
      platformInterestExtraPoints: options.extraPoints,
      operation: 1,
      paymentProviderTransactionId,
    });
  }

  private calculateExtraPoints(extraPoints, amount) {
    if (!extraPoints) return amount;
    if (extraPoints.name === PlatformInterest.PREMIUM_EXTRA)
      return amount * extraPoints.percentage + amount;
    if (extraPoints.name === PlatformInterest.GOLD_EXTRA)
      return amount * extraPoints.percentage + amount + extraPoints.amount;
  }

  // WITHDRAWAL TRANSACTION
  async createWithdrawalTransaction(
    clientBankAccount: ClientBankAccount,
    amount: number,
  ): Promise<Transaction> {
    const options = await this.getTransactionInterests({
      platformInterestType: PlatformInterest.WITHDRAWAL,
      platformInterestExtraPointsType: null,
      thirdPartyInterestType: PaymentProvider.STRIPE,
    });

    return await this.createTransaction({
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
    });
  }
}
