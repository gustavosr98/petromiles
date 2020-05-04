import { TransactionType } from './transaction.enum';
import { UserSuscription } from '../../client/user_suscription/user_suscription.entity';
import { StateTransaction } from '../state_transaction/state_transaction.entity';
import { TransactionInterest } from '../transaction_interest/transaction_interest.entity';
import { PointsConversion } from '../../management/points_conversion/points_conversion.entity';
import { ClientBankAccount } from '../../client/client_bank_account/client_bank_account.entity';
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
  id_transaction: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  initial_date: Date;

  @Column()
  raw_amount: number;

  @Column()
  total_amount_with_interest: number;

  @Column()
  type: TransactionType;

  @ManyToOne(
    type => Transaction,
    transaction => transaction.id_transaction,
    { nullable: true },
  )
  @JoinColumn({ name: 'fk_transaction' })
  transaction: Transaction;

  @OneToOne(
    type => UserSuscription,
    userSuscription => userSuscription.id_user_suscription,
    { nullable: true },
  )
  userSuscription: UserSuscription;

  @OneToMany(
    type => StateTransaction,
    stateTransaction => stateTransaction.id_state_transaction,
    { nullable: false },
  )
  stateTransaction: StateTransaction;

  @OneToMany(
    type => TransactionInterest,
    transactionInterest => transactionInterest.id_transaction_interest,
    { nullable: true },
  )
  transactionInterest: TransactionInterest;

  @ManyToOne(
    type => PointsConversion,
    pointsConversion => pointsConversion.id_points_conversion,
    { nullable: false },
  )
  @JoinColumn({ name: 'fk_points_conversion' })
  pointsConvertion: PointsConversion;

  @ManyToOne(
    type => ClientBankAccount,
    clientBankAccount => clientBankAccount.id_client_bank_account,
    { nullable: false },
  )
  @JoinColumn({ name: 'fk_client_bank_account' })
  clientBankAccount: ClientBankAccount;
}
