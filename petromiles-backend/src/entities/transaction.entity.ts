import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { Transform } from 'class-transformer';

import { UserSuscription } from './user-suscription.entity';
import { ClientBankAccount } from './client-bank-account.entity';
import { StateTransaction } from './state-transaction.entity';
import { TransactionInterest } from './transaction-interest.entity';
import { PointsConversion } from './points-conversion.entity';
import { TransactionType } from '../enums/transaction.enum';

@Entity()
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn()
  idTransaction: number;

  @Transform(date => date.toLocaleDateString())
  @Column({ default: () => 'CURRENT_DATE' })
  initialDate: Date;

  @Column('decimal', { precision: 12, scale: 3 })
  rawAmount: number;

  @Column('decimal', { precision: 12, scale: 3 })
  totalAmountWithInterest: number;

  @Column()
  type: TransactionType;

  @Column({ nullable: true })
  operation?: number;

  @Column({ nullable: true })
  paymentProviderTransactionId?: string;

  @ManyToOne(
    type => Transaction,
    transaction => transaction.idTransaction,
    { nullable: true },
  )
  @JoinColumn({ name: 'fk_transaction' })
  transaction: Transaction;

  @OneToOne(
    type => UserSuscription,
    userSuscription => userSuscription.transaction,
    { nullable: true },
  )
  userSuscription: UserSuscription;

  @OneToMany(
    type => StateTransaction,
    stateTransaction => stateTransaction.transaction,
    { nullable: false, eager: true },
  )
  stateTransaction: StateTransaction[];

  @OneToMany(
    type => TransactionInterest,
    transactionInterest => transactionInterest.transaction,
    { nullable: true, eager: true },
  )
  transactionInterest: TransactionInterest[];

  @ManyToOne(
    type => PointsConversion,
    pointsConversion => pointsConversion.idPointsConversion,
    { nullable: false, eager: true },
  )
  @JoinColumn({ name: 'fk_points_conversion' })
  pointsConversion: PointsConversion;

  @ManyToOne(
    type => ClientBankAccount,
    clientBankAccount => clientBankAccount.idClientBankAccount,
    { nullable: false, eager: true },
  )
  @JoinColumn({ name: 'fk_client_bank_account' })
  clientBankAccount: ClientBankAccount;
}
