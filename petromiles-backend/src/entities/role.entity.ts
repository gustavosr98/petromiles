import { UserRole } from './user-role.entity';
import {Role as Roles} from '@/enums/role.enum'
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

  isClient() {
    return this.name === Roles.CLIENT;
  }

  isAdministrator(){
    return this.name === Roles.ADMINISTRATOR;
  }
}
