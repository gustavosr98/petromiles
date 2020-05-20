import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

// ENTITIES
import { UserClient } from '../../user/user-client/user-client.entity';
import { BankAccount } from '../bank-account/bank-account.entity';
import { Transaction } from '../../transaction/transaction/transaction.entity';
import { StateBankAccount } from '../state-bank-account/state-bank-account.entity';

@Entity()
export class ClientBankAccount extends BaseEntity {
  @PrimaryGeneratedColumn()
  idClientBankAccount: number;

  @ManyToOne(
    type => UserClient,
    userClient => userClient.idUserClient,
    { nullable: false },
  )
  @JoinColumn({ name: 'fk_user_client' })
  userClient: UserClient;

  @ManyToOne(
    type => BankAccount,
    bankAccount => bankAccount.idBankAccount,
    { nullable: false },
  )
  @JoinColumn({ name: 'fk_bank_account' })
  bankAccount: BankAccount;

  @OneToMany(
    type => Transaction,
    transaction => transaction.clientBankAccount,
    { nullable: true },
  )
  transaction: Transaction[];

  @OneToMany(
    type => StateBankAccount,
    stateBankAccount => stateBankAccount.clientBankAccount,
    { nullable: false },
  )
  stateBankAccount: StateBankAccount[];
}
