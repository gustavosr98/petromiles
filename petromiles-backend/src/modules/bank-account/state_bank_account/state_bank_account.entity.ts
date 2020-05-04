import { State } from '../../management/state/state.entity';
import { ClientBankAccount } from '../../client/client_bank_account/client_bank_account.entity';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class StateBankAccount extends BaseEntity {
  @PrimaryGeneratedColumn()
  id_state_bank_account: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  initial_date: Date;

  @Column({ type: 'timestamp', nullable: true })
  final_date?: Date;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(
    type => State,
    state => state.id_state,
    {
      onDelete: 'CASCADE',
      nullable: false,
    },
  )
  @JoinColumn({ name: 'fk_state' })
  state: State;

  @ManyToOne(
    type => ClientBankAccount,
    clientbankAccount => clientbankAccount.id_client_bank_account,
    {
      onDelete: 'CASCADE',
      nullable: false,
    },
  )
  @JoinColumn({ name: 'fk_client_bank_account' })
  clientbankAccount: ClientBankAccount;
}
