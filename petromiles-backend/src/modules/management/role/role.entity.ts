import { UserRole } from '../../user/user-role/user-role.entity';
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
  idRole: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(
    type => UserRole,
    userRole => userRole.role,
    { nullable: true },
  )
  userRole?: UserRole[];
}
