import { StateUser } from '../../user/state_user/state_user.entity';
import { StateBankAccount } from '../../bank-account/state_bank_account/state_bank_account.entity';
import { StateTransaction } from '../../transaction/state_transaction/state_transaction.entity';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';

@Entity()
export class State extends BaseEntity {
  @PrimaryGeneratedColumn()
  id_state: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(
    type => StateUser,
    stateUser => stateUser.id_state_user,
    { nullable: true },
  )
  stateUser?: StateUser;

  @OneToMany(
    type => StateBankAccount,
    stateBankAccount => stateBankAccount.id_state_bank_account,
    { nullable: true },
  )
  stateBankAccount?: StateBankAccount;

  @OneToMany(
    type => StateTransaction,
    stateTransaction => stateTransaction.id_state_transaction,
    { nullable: true },
  )
  stateTransaction?: StateTransaction;
}
