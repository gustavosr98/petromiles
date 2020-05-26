import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { PlatformInterest } from '../../management/platform-interest/platform-interest.entity';
import { ThirdPartyInterest } from '../../management/third-party-interest/third-party-interest.entity';
import { Promotion } from '../../management/promotion/promotion.entity';
import { Transaction } from '../transaction/transaction.entity';

@Entity()
export class TransactionInterest extends BaseEntity {
  @PrimaryGeneratedColumn()
  idTransactionInterest: number;

  @ManyToOne(
    (type) => PlatformInterest,
    (platformInterest) => platformInterest.idPlatformInterest,
    { nullable: true, eager: true },
  )
  @JoinColumn({ name: 'fk_platform_interest' })
  platformInterest: PlatformInterest;

  @ManyToOne(
    (type) => PlatformInterest,
    (platformInterest) => platformInterest.idPlatformInterest,
    { nullable: true },
  )
  @JoinColumn({ name: 'fk_platform_interest_extra_points' })
  platformInterestExtraPoints: PlatformInterest;

  @ManyToOne(
    (type) => ThirdPartyInterest,
    (thirdPartyInterest) => thirdPartyInterest.idThirdPartyInterest,
    { nullable: true },
  )
  @JoinColumn({ name: 'fk_third_party_interest' })
  thirdPartyInterest: ThirdPartyInterest;

  @ManyToOne((type) => Promotion, (promotion) => promotion.idPromotion, {
    nullable: true,
  })
  @JoinColumn({ name: 'fk_promotion' })
  promotion: Promotion;

  @ManyToOne(
    (type) => Transaction,
    (transaction) => transaction.idTransaction,
    { nullable: false },
  )
  @JoinColumn({ name: 'fk_transaction' })
  transaction: Transaction;
}
