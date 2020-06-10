import { State } from './state.entity';
import { ClientBankAccount } from './client-bank-account.entity';
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
  idStateBankAccount: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  initialDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  finalDate?: Date;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(
    type => State,
    state => state.idState,
    {
      nullable: false,
      eager: true,
    },
  )
  @JoinColumn({ name: 'fk_state' })
  state: State;

  @ManyToOne(
    type => ClientBankAccount,
    clientbankAccount => clientbankAccount.idClientBankAccount,
    {
      nullable: false,
    },
  )
  @JoinColumn({ name: 'fk_client_bank_account' })
  clientBankAccount: ClientBankAccount;
}
