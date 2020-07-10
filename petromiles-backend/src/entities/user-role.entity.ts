import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

// ENTITIES
import { UserAdministrator } from './user-administrator.entity';
import { Role } from './role.entity';
import { UserClient } from './user-client.entity';

@Entity()
export class UserRole extends BaseEntity {
  @PrimaryGeneratedColumn()
  idUserRole: number;

  @ManyToOne(
    type => UserAdministrator,
    userAdministrator => userAdministrator.idUserAdministrator,
    { nullable: true },
  )
  @JoinColumn({ name: 'fk_user_administrator' })
  userAdministrator?: UserAdministrator;

  @ManyToOne(
    type => UserClient,
    userClient => userClient.idUserClient,
    { nullable: true },
  )
  @JoinColumn({ name: 'fk_user_client' })
  userClient?: UserClient;

  @ManyToOne(
    type => Role,
    role => role.idRole,
    { nullable: false },
  )
  @JoinColumn({ name: 'fk_role' })
  role: Role;
}
