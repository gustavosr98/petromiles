import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { TransactionInterest } from '../../transaction/transaction-interest/transaction-interest.entity';

@Entity()
export class ThirdPartyInterest extends BaseEntity {
  @PrimaryGeneratedColumn()
  idThirdPartyInterest: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  paymentProvider: string;

  @Column({ nullable: true })
  amountDollarCents: number;

  @Column({ nullable: true })
  percentage: number;

  @Column({ default: () => 'CURRENT_DATE' })
  initialDate: Date;

  @Column({ nullable: true })
  finalDate: Date;

  @OneToMany(
    type => TransactionInterest,
    transactionInterest => transactionInterest.thirdPartyInterest,
    { nullable: true },
  )
  transactionInterest: TransactionInterest[];
}
