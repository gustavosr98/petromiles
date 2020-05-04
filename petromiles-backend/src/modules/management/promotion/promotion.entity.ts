import { TransactionInterest } from '../../transaction/transaction_interest/transaction_interest.entity';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';

@Entity()
export class Promotion extends BaseEntity {
  @PrimaryGeneratedColumn()
  id_promotion: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  is_a_discount: string;

  @Column()
  token: string;

  @Column('decimal', { nullable: true, precision: 8, scale: 2 })
  amount: number;

  @Column('decimal', { nullable: true, precision: 6, scale: 2 })
  percentage: number;

  @Column({ default: () => 'CURRENT_DATE' })
  initial_date: Date;

  @Column({ nullable: true })
  final_date: Date;

  @OneToMany(
    type => TransactionInterest,
    transactionInterest => transactionInterest.id_transaction_interest,
    { nullable: true },
  )
  transactionInterest: TransactionInterest;
}
