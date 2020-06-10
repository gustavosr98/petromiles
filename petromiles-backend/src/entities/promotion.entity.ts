import { TransactionInterest } from './transaction-interest.entity';
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
  idPromotion: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  isADiscount: string;

  @Column()
  token: string;

  @Column('decimal', { nullable: true, precision: 8, scale: 2 })
  amount: number;

  @Column('decimal', { nullable: true, precision: 6, scale: 2 })
  percentage: number;

  @Column({ default: () => 'CURRENT_DATE' })
  initialDate: Date;

  @Column({ nullable: true })
  finalDate: Date;

  @OneToMany(
    type => TransactionInterest,
    transactionInterest => transactionInterest.promotion,
    { nullable: true },
  )
  transactionInterest: TransactionInterest[];
}
