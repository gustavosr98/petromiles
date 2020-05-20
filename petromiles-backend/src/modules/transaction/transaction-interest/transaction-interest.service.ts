import { Injectable } from '@nestjs/common';

import { getConnection } from 'typeorm';

import { TransactionInterest } from './transaction-interest.entity';
import { Transaction } from '../transaction/transaction.entity';
import { Promotion } from '../../management/promotion/promotion.entity';
import { ThirdPartyInterest } from '../../management/third-party-interest/third-party-interest.entity';
import { PlatformInterest } from 'src/modules/management/platform-interest/platform-interest.entity';

@Injectable()
export class TransactionInterestService {
  async createTransactionInterest(
    transaction: Transaction,
    thirdPartyInterest: ThirdPartyInterest,
    platformInterest: PlatformInterest,
    promotion: Promotion,
    platformInterestExtraPoints: PlatformInterest,
  ): Promise<TransactionInterest> {
    const transactionInterest = new TransactionInterest();
    transactionInterest.transaction = transaction;
    transactionInterest.thirdPartyInterest = thirdPartyInterest;
    transactionInterest.platformInterest = platformInterest;
    transactionInterest.promotion = promotion;
    transactionInterest.platformInterestExtraPoints = platformInterestExtraPoints;

    return await getConnection()
      .getRepository(TransactionInterest)
      .save(transactionInterest);
  }
}
