import { Transaction } from '../../transaction/transaction/transaction.entity';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';

@Entity()
export class PointsConversion extends BaseEntity {
  @PrimaryGeneratedColumn()
  idPointsConversion: number;

  @Column('decimal', { precision: 8, scale: 3 })
  onePointEqualsDollars: number;

  @Column({ default: () => 'CURRENT_DATE' })
  initialDate: Date;

  @OneToMany(
    type => Transaction,
    transaction => transaction.idTransaction,
    { nullable: true },
  )
  transaction: Transaction;
}
