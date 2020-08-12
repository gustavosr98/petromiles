import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { getConnection, Repository } from 'typeorm';

// ENTITIES
import { TransactionInterest } from '@/entities/transaction-interest.entity';
import { Promotion } from '@/entities/promotion.entity';
import { ThirdPartyInterest } from '@/entities/third-party-interest.entity';
import { PlatformInterest } from '@/entities/platform-interest.entity';
import { Transaction } from '@/entities/transaction.entity';

@Injectable()
export class TransactionInterestService {
  constructor(
    @InjectRepository(TransactionInterest)
    private repository: Repository<TransactionInterest>,
  ) {}

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

    return await this.repository.save(transactionInterest);
  }

  async getExtraPointsTypeByTransaction(transaction: Transaction) {
    const transactionInterest = await getConnection()
      .getRepository(TransactionInterest)
      .findOne({ transaction });

    return transactionInterest.platformInterestExtraPoints.name
  }
}
