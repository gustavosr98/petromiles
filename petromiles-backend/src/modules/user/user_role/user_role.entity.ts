import { UserAdministrator } from '../user_administrator/user_administrator.entity';
import { Role } from '../../management/role/role.entity';
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
  id_user_role: number;

  @ManyToOne(
    type => UserAdministrator,
    userAdministrator => userAdministrator.id_user_administrator,
    { nullable: false },
  )
  @JoinColumn({ name: 'fk_user_administrator' })
  userAdministrator: UserAdministrator;

  @ManyToOne(
    type => Role,
    role => role.id_role,
    { nullable: false },
  )
  @JoinColumn({ name: 'fk_role' })
  role: Role;
}
