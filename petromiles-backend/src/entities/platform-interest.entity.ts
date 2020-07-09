import { Transform } from 'class-transformer';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Suscription } from './suscription.entity';
import { TransactionInterest } from './transaction-interest.entity';
import { PlatformInterest as PlatformInterestType } from '@/enums/platform-interest.enum';

@Entity()
export class PlatformInterest extends BaseEntity {
  @PrimaryGeneratedColumn()
  idPlatformInterest: number;

  @Column()
  name: string;

  @Transform(amount => {
    if (amount) return Math.round(amount * 100) / 10000;

    return amount;
  })
  @Column({ nullable: true })
  amount?: string;

  @Transform(percentage => {
    if (percentage) return Math.round(percentage * 1000000) / 10000;

    return percentage;
  })
  @Column({ nullable: true })
  percentage?: string;

  @Column({ nullable: true })
  points?: number;

  @Column({ default: () => 'CURRENT_DATE' })
  initialDate: Date;

  @Column({ nullable: true })
  finalDate?: Date;

  @Column({ nullable: true })
  description?: string;

  @ManyToOne(
    type => Suscription,
    suscription => suscription.idSuscription,
    { nullable: true, eager: true },
  )
  @JoinColumn({ name: 'fk_suscription' })
  suscription?: Suscription;

  @OneToMany(
    type => TransactionInterest,
    transactionInterest => transactionInterest.platformInterest,
    { nullable: true },
  )
  transactionInterest?: TransactionInterest[];

  @OneToMany(
    type => TransactionInterest,
    transactionInterestExtraPoints =>
      transactionInterestExtraPoints.platformInterest,
    { nullable: true },
  )
  transactionInterestExtraPoints?: TransactionInterest[];

  isGold() {
    return this.name === PlatformInterestType.GOLD_EXTRA;
  }
}
