import { StateUser } from '../../user/state-user/state-user.entity';
import { UserDetails } from '../../user/user-details/user-details.entity';
import { UserRole } from '../../user/user-role/user-role.entity';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
} from 'typeorm';

@Entity()
export class UserAdministrator extends BaseEntity {
  @PrimaryGeneratedColumn()
  idUserAdministrator: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password?: string;

  @Column()
  salt?: string;

  @Column({ nullable: true })
  photo?: string;

  @OneToMany(
    type => StateUser,
    stateUser => stateUser.idStateUser,
    { nullable: true },
  )
  stateUser?: StateUser;

  @OneToOne(
    type => UserDetails,
    userDetails => userDetails.idUserDetails,
    { nullable: true },
  )
  userDetails?: UserDetails;

  @OneToMany(
    type => UserRole,
    userRole => userRole.idUserRole,
    { nullable: true },
  )
  userRole?: UserRole;
}
