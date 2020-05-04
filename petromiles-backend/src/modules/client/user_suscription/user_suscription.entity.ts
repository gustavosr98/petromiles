import { UserClient } from '../user_client/user_client.entity';
import { Suscription } from '../../suscription/suscription/suscription.entity';
import { Transaction } from '../../transaction/transaction/transaction.entity';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';

@Entity()
export class UserSuscription extends BaseEntity {
  @PrimaryGeneratedColumn()
  id_user_suscription: number;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  initial_date: Date;

  @Column({ nullable: true })
  upgraded_amount: number;

  @Column({ nullable: true })
  final_date: string;

  @ManyToOne(
    type => UserClient,
    userClient => userClient.id_user_client,
    { nullable: false },
  )
  @JoinColumn({ name: 'fk_user_client' })
  user_client: UserClient;

  @ManyToOne(
    type => Suscription,
    suscription => suscription.id_suscription,
    { nullable: false },
  )
  @JoinColumn({ name: 'fk_suscription' })
  suscription: Suscription;

  @OneToOne(
    type => Transaction,
    transaction => transaction.id_transaction,
    { nullable: false },
  )
  @JoinColumn({ name: 'fk_transaction' })
  transaction: Transaction;
}
