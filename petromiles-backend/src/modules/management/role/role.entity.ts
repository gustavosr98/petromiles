import { UserRole } from '../../user/user_role/user_role.entity';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';

@Entity()
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn()
  id_role: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(
    type => UserRole,
    userRole => userRole.id_user_role,
    { nullable: true },
  )
  userRole?: UserRole;
}
