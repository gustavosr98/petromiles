import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Transaction } from './transaction.entity';

@Entity()
export class PointsConversion extends BaseEntity {
  @PrimaryGeneratedColumn()
  idPointsConversion: number;

  @Column('decimal', { precision: 19, scale: 14 })
  onePointEqualsDollars: number;

  @Column({ default: () => 'CURRENT_DATE' })
  initialDate: Date;

  @Column({ nullable: true })
  finalDate: Date;

  @OneToMany(
    type => Transaction,
    transaction => transaction.pointsConversion,
    { nullable: true },
  )
  transaction: Transaction[];
}
