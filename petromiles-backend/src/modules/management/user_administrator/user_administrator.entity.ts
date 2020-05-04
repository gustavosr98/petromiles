import { StateUser } from '../../user/state_user/state_user.entity';
import { UserDetails } from '../../user/user_details/user_details.entity';
import { UserRole } from '../../user/user_role/user_role.entity';
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
  id_user_administrator: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  photo: string;

  @OneToMany(
    type => StateUser,
    stateUser => stateUser.id_state_user,
    { nullable: false },
  )
  stateUser: StateUser;

  @OneToOne(
    type => UserDetails,
    userDetails => userDetails.id_user_details,
    { nullable: true },
  )
  userDetails: UserDetails;

  @OneToMany(
    type => UserRole,
    userRole => userRole.id_user_role,
    { nullable: false },
  )
  userRole: UserRole;
}
