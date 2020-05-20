import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Exclude } from 'class-transformer';

import { StateUser } from '../../user/state-user/state-user.entity';
import { UserDetails } from '../../user/user-details/user-details.entity';
import { UserRole } from '../../user/user-role/user-role.entity';

@Entity()
export class UserAdministrator extends BaseEntity {
  @PrimaryGeneratedColumn()
  idUserAdministrator: number;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password?: string;

  @Column()
  @Exclude()
  salt?: string;

  @Column({ nullable: true })
  photo?: string;

  @OneToMany(
    type => StateUser,
    stateUser => stateUser.userAdministrator,
    { nullable: true },
  )
  stateUser?: StateUser[];

  @OneToOne(
    type => UserDetails,
    userDetails => userDetails.userAdministrator,
    { nullable: true },
  )
  userDetails?: UserDetails[];

  @OneToMany(
    type => UserRole,
    userRole => userRole.userAdministrator,
    { nullable: true },
  )
  userRole?: UserRole[];
}
