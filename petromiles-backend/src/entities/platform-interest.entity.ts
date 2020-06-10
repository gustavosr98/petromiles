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

@Entity()
export class PlatformInterest extends BaseEntity {
  @PrimaryGeneratedColumn()
  idPlatformInterest: number;

  @Column()
  name: string;

  @Transform(amount => amount / 100)
  @Column({ nullable: true })
  amount: string;

  @Transform(percentage => percentage * 100)
  @Column({ nullable: true })
  percentage: string;

  @Column({ default: () => 'CURRENT_DATE' })
  initialDate: Date;

  @Column({ nullable: true })
  finalDate: Date;

  @ManyToOne(
    type => Suscription,
    suscription => suscription.idSuscription,
    { nullable: true, eager: true },
  )
  @JoinColumn({ name: 'fk_suscription' })
  suscription: Suscription;

  @OneToMany(
    type => TransactionInterest,
    transactionInterest => transactionInterest.platformInterest,
    { nullable: true },
  )
  transactionInterest: TransactionInterest[];

  @OneToMany(
    type => TransactionInterest,
    transactionInterestExtraPoints =>
      transactionInterestExtraPoints.platformInterest,
    { nullable: true },
  )
  transactionInterestExtraPoints: TransactionInterest[];
}
