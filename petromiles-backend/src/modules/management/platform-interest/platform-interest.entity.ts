import { Suscription } from '../../suscription/suscription/suscription.entity';
import { TransactionInterest } from '../../transaction/transaction-interest/transaction-interest.entity';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class PlatformInterest extends BaseEntity {
  @PrimaryGeneratedColumn()
  idPlatformInterest: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  amount: string;

  @Column({ nullable: true })
  percentage: string;

  @Column({ default: () => 'CURRENT_DATE' })
  initialDate: Date;

  @Column({ nullable: true })
  finalDate: Date;

  @ManyToOne(
    (type) => Suscription,
    (suscription) => suscription.idSuscription,
    { nullable: true, eager: true },
  )
  @JoinColumn({ name: 'fk_suscription' })
  suscription: Suscription;

  @OneToMany(
    (type) => TransactionInterest,
    (transactionInterest) => transactionInterest.platformInterest,
    { nullable: true },
  )
  transactionInterest: TransactionInterest[];

  @OneToMany(
    (type) => TransactionInterest,
    (transactionInterestExtraPoints) =>
      transactionInterestExtraPoints.platformInterest,
    { nullable: true },
  )
  transactionInterestExtraPoints: TransactionInterest[];
}
