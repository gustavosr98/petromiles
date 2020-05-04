import { State } from '../../management/state/state.entity';
import { Transaction } from '../transaction/transaction.entity';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class StateTransaction extends BaseEntity {
  @PrimaryGeneratedColumn()
  id_state_transaction: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  initial_date: Date;

  @Column({
    nullable: true,
    type: 'timestamp',
  })
  final_date: Date;

  @Column({ nullable: true })
  description?: string;

  @ManyToOne(
    type => State,
    state => state.id_state,
    {
      nullable: false,
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'fk_state' })
  state: State;

  @ManyToOne(
    type => Transaction,
    transaction => transaction.id_transaction,
    { nullable: false, onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'fk_transaction' })
  transaction: Transaction;
}
