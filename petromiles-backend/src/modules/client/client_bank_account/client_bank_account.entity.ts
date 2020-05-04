import { UserClient } from '../user_client/user_client.entity';
import { BankAccount } from '../../bank-account/bank_account/bank_account.entity';
import { Transaction } from '../../transaction/transaction/transaction.entity';
import { StateBankAccount } from '../../bank-account/state_bank_account/state_bank_account.entity';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class ClientBankAccount extends BaseEntity {
  @PrimaryGeneratedColumn()
  id_client_bank_account: number;

  @ManyToOne(
    type => UserClient,
    userClient => userClient.id_user_client,
    { nullable: false },
  )
  @JoinColumn({ name: 'fk_user_client' })
  userClient: UserClient;

  @ManyToOne(
    type => BankAccount,
    bankAccount => bankAccount.id_bank_account,
    { nullable: false },
  )
  @JoinColumn({ name: 'fk_bank_account' })
  bankAccount: BankAccount;

  @OneToMany(
    type => Transaction,
    transaction => transaction.id_transaction,
    { nullable: true },
  )
  transaction: Transaction;

  @OneToMany(
    type => StateBankAccount,
    stateBankAccount => stateBankAccount.id_state_bank_account,
    { nullable: false },
  )
  stateBankAccount: StateBankAccount;
}
