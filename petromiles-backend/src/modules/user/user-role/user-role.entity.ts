import { UserAdministrator } from '../user-administrator/user-administrator.entity';
import { Role } from '../../management/role/role.entity';
import { UserClient } from '../../client/user-client/user-client.entity';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

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
