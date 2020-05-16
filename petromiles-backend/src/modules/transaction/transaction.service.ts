import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { Repository } from 'typeorm';

import { PlatformInterestService } from '../management/platform-interest/platform-interest.service';
import { PlatformInterest } from '../management/platform-interest/platform-interest.enum';
import { ClientBankAccount } from '../client/client-bank-account/client-bank-account.entity';
import { PointsConversionService } from '../management/points-conversion/points-conversion.service';
import { Transaction } from './transaction/transaction.entity';
import { ThirdPartyInterestService } from '../management/third-party-interest/third-party-interest.service';
import { ThirdPartyInterest } from '../management/third-party-interest/third-party-interest.enum';
import { TransactionType } from './transaction/transaction.enum';
import { StateName, StateDescription } from '../management/state/state.enum';
import { TransactionInterestService } from './transaction-interest/transaction-interest.service';
import { StateTransactionService } from './state-transaction/state-transaction.service';

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

  /* FOR ALL TYPE OF TRANSACTION */

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
      `[BANK_ACCOUNT] Transaction ID: ${transaction.idTransaction} is created`,
    );
    return transaction;
  }

  /* FOR  BANK ACCOUNT VERIFICATION  TRANSACTION */

  generateRandomAmounts(amount: number, paymentProviderInterest: number) {
    const max = amount - paymentProviderInterest;
    const baseRandomAmount = Number(
      (
        Math.random() * (max - paymentProviderInterest) +
        paymentProviderInterest
      ).toFixed(2),
    );
    const randomAmount = Number((amount - baseRandomAmount).toFixed(2));
    return [baseRandomAmount, randomAmount];
  }

  async createVerificationTransaction(clientBankAccount: ClientBankAccount) {
    this.logger.verbose(
      '[BANK_ACCOUNT] Creating bank account verification transactions',
    );

    const options = await this.getTransactionInterests({
      platformInterestType: PlatformInterest.VERIFICATION,
      platformInterestExtraPointsType: null,
      thirdPartyInterestType: ThirdPartyInterest.STRIPE,
    });

    const randomAmounts = this.generateRandomAmounts(
      options.interest.amount,
      options.thirdPartyInterest.amountDollarCents,
    );

    this.logger.verbose(
      `[BANK_ACCOUNT] Random amounts for each transaction are: ${randomAmounts[0]} - ${randomAmounts[1]}`,
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
}
