import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
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
import { ThirdPartyInterest } from '../management/third-party-interest/third-party-interest.enum';
import { TransactionType } from './transaction/transaction.enum';
import { StateName, StateDescription } from '../management/state/state.enum';
import { ApiModules } from '@/logger/api-modules.enum';

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
    private paymentProviderService: PaymentProviderService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  // ANY TYPE OF TRANSACTION

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
      `[${ApiModules.TRANSACTION}] Transaction ID: ${transaction.idTransaction} was created`,
    );
    return transaction;
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
      thirdPartyInterestType: ThirdPartyInterest.STRIPE,
    });

    const randomAmounts = this.generateRandomAmounts(
      options.interest.amount,
      options.thirdPartyInterest.amountDollarCents,
    );

    this.logger.verbose(
      `[${ApiModules.TRANSACTION}] Random amounts for each transaction are: [${randomAmounts[0]}, ${randomAmounts[1]}]`,
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

  async createUpgradeSuscriptionTransaction(
    clientBankAccount: ClientBankAccount,
    suscription: Suscription,
  ) {
    const options = await this.getTransactionInterests({
      platformInterestType: PlatformInterest.PREMIUM,
      platformInterestExtraPointsType: null,
      thirdPartyInterestType: ThirdPartyInterest.STRIPE,
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
}
