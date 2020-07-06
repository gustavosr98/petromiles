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
    if (amount) return (amount / 100).toFixed(2);

    return amount;
  })
  @Column({ nullable: true })
  amount?: string;

  @Transform(percentage => {
    if (percentage) return (percentage * 100).toFixed(2);

    return percentage;
  })
  @Column({ nullable: true })
  percentage?: string;

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
