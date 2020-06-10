import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { State } from './state.entity';
import { Transaction } from './transaction.entity';

@Entity()
export class StateTransaction extends BaseEntity {
  @PrimaryGeneratedColumn()
  idStateTransaction: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  initialDate: Date;

  @Column({
    nullable: true,
    type: 'timestamp',
  })
  finalDate: Date;

  @Column({ nullable: true })
  description?: string;

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
    type => Transaction,
    transaction => transaction.idTransaction,
    { nullable: false },
  )
  @JoinColumn({ name: 'fk_transaction' })
  transaction: Transaction;
}
