import { TransactionType } from './transaction.enum';
import { UserSuscription } from '../../client/user-suscription/user-suscription.entity';
import { PointsConversion } from '../../management/points-conversion/points-conversion.entity';
import { ClientBankAccount } from '../../client/client-bank-account/client-bank-account.entity';
import { StateTransaction } from '../state-transaction/state-transaction.entity';
import { TransactionInterest } from '../transaction-interest/transaction-interest.entity';
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

@Entity()
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn()
  idTransaction: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  initialDate: Date;

  @Column()
  rawAmount: number;

  @Column()
  totalAmountWithInterest: number;

  @Column()
  type: TransactionType;

  @ManyToOne(
    type => Transaction,
    transaction => transaction.idTransaction,
    { nullable: true },
  )
  @JoinColumn({ name: 'fk_transaction' })
  transaction: Transaction;

  @OneToOne(
    type => UserSuscription,
    userSuscription => userSuscription.idUserSuscription,
    { nullable: true },
  )
  userSuscription: UserSuscription;

  @OneToMany(
    type => StateTransaction,
    stateTransaction => stateTransaction.idStateTransaction,
    { nullable: false },
  )
  stateTransaction: StateTransaction;

  @OneToMany(
    type => TransactionInterest,
    transactionInterest => transactionInterest.idTransactionInterest,
    { nullable: true },
  )
  transactionInterest: TransactionInterest;

  @ManyToOne(
    type => PointsConversion,
    pointsConversion => pointsConversion.idPointsConversion,
    { nullable: false },
  )
  @JoinColumn({ name: 'fk_points_conversion' })
  pointsConvertion: PointsConversion;

  @ManyToOne(
    type => ClientBankAccount,
    clientBankAccount => clientBankAccount.idClientBankAccount,
    { nullable: false },
  )
  @JoinColumn({ name: 'fk_client_bank_account' })
  clientBankAccount: ClientBankAccount;
}