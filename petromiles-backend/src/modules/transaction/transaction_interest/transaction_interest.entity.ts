import { PlatformInterest } from '../../management/platform_interest/platform_interest.entity';
import { ThirdPartyInterest } from '../../management/third_party_interest/third_party_interest.entity';
import { Promotion } from '../../management/promotion/promotion.entity';
import { Transaction } from '../transaction/transaction.entity';

import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class TransactionInterest extends BaseEntity {
  @PrimaryGeneratedColumn()
  id_transaction_interest: number;

  @ManyToOne(
    type => PlatformInterest,
    platformInterest => platformInterest.id_platform_interest,
    { nullable: true },
  )
  @JoinColumn({ name: 'fk_platform_interest' })
  platformInterest: PlatformInterest;

  @ManyToOne(
    type => PlatformInterest,
    platformInterest => platformInterest.id_platform_interest,
    { nullable: true },
  )
  @JoinColumn({ name: 'fk_platform_interest_extra_points' })
  platformInterestExtraPoints: PlatformInterest;

  @ManyToOne(
    type => ThirdPartyInterest,
    thirdPartyInterest => thirdPartyInterest.id_third_party_interest,
    { nullable: true },
  )
  @JoinColumn({ name: 'fk_third_party_interest' })
  thirdPartyInterest: ThirdPartyInterest;

  @ManyToOne(
    type => Promotion,
    promotion => promotion.id_promotion,
    { nullable: true },
  )
  @JoinColumn({ name: 'fk_promotion' })
  promotion: Promotion;

  @ManyToOne(
    type => Transaction,
    transaction => transaction.id_transaction,
    { nullable: false },
  )
  @JoinColumn({ name: 'fk_transaction' })
  transaction: Transaction;
}
