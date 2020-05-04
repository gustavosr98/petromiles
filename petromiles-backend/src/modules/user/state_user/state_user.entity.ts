import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { UserAdministrator } from '../user_administrator/user_administrator.entity';
import { State } from '../../management/state/state.entity';
import { UserClient } from '../../client/user_client/user_client.entity';

@Entity()
export class StateUser extends BaseEntity {
  @PrimaryGeneratedColumn()
  id_state_user: number;

  @Column({ type: 'timestamp' })
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
    type => UserClient,
    userClient => userClient.id_user_client,
    {
      onDelete: 'CASCADE',
      nullable: true,
    },
  )
  @JoinColumn({ name: 'fk_user_client' })
  userClient: UserClient;

  @ManyToOne(
    type => UserAdministrator,
    userAdministrator => userAdministrator.id_user_administrator,
    {
      onDelete: 'CASCADE',
      nullable: true,
    },
  )
  @JoinColumn({ name: 'fk_user_administrator' })
  userAdministrator: UserAdministrator;
}
