import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { UserAdministrator } from './user-administrator.entity';
import { State } from './state.entity';
import { UserClient } from './user-client.entity';

@Entity()
export class StateUser extends BaseEntity {
  @PrimaryGeneratedColumn()
  idStateUser: number;

  @Column({ type: 'timestamp' })
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
    type => UserClient,
    userClient => userClient.idUserClient,
    { nullable: true },
  )
  @JoinColumn({ name: 'fk_user_client' })
  userClient: UserClient;

  @ManyToOne(
    type => UserAdministrator,
    userAdministrator => userAdministrator.idUserAdministrator,
    {
      nullable: true,
    },
  )
  @JoinColumn({ name: 'fk_user_administrator' })
  userAdministrator: UserAdministrator;
}
