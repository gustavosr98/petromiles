import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';

// ENTITIES
import { UserClient } from './user-client.entity';
import { Suscription } from './suscription.entity';
import { Transaction } from './transaction.entity';

@Entity()
export class UserSuscription extends BaseEntity {
  @PrimaryGeneratedColumn()
  idUserSuscription: number;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  initialDate: Date;

  @Column({ nullable: true })
  upgradedAmount: number;

  @Column({ nullable: true })
  finalDate: Date;

  @ManyToOne(
    type => UserClient,
    userClient => userClient.idUserClient,
    {
      nullable: false,
    },
  )
  @JoinColumn({ name: 'fk_user_client' })
  userClient: UserClient;

  @ManyToOne(
    type => Suscription,
    suscription => suscription.idSuscription,
    { nullable: false, eager: true },
  )
  @JoinColumn({ name: 'fk_suscription' })
  suscription: Suscription;

  @OneToOne(
    type => Transaction,
    transaction => transaction.idTransaction,
    {
      nullable: true,
    },
  )
  @JoinColumn({ name: 'fk_transaction' })
  transaction: Transaction;
}
