import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
} from 'typeorm';

import { ClientBankAccount } from '../client-bank-account/client-bank-account.entity';
import { StateUser } from '../../user/state-user/state-user.entity';
import { UserDetails } from '../../user/user-details/user-details.entity';
import { UserRole } from '../../user/user-role/user-role.entity';
import { UserSuscription } from '../user-suscription/user-suscription.entity';

@Entity()
export class UserClient extends BaseEntity {
  @PrimaryGeneratedColumn()
  idUserClient: number;

  @Column({ nullable: true })
  salt: string;

  @Column({ nullable: true })
  googleToken: string;

  @Column({ nullable: true })
  facebookToken: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @OneToMany(
    type => StateUser,
    stateUser => stateUser.idStateUser,
    { nullable: true },
  )
  stateUser: StateUser;

  @OneToMany(
    type => UserRole,
    userRole => userRole.idUserRole,
    { nullable: true },
  )
  userRole: UserRole;

  @OneToOne(
    type => UserDetails,
    userDetails => userDetails.idUserDetails,
    { nullable: true },
  )
  userDetails: UserDetails;

  @OneToMany(
    type => UserSuscription,
    userSuscription => userSuscription.idUserSuscription,
    { nullable: false },
  )
  userSuscription: UserSuscription;

  @OneToMany(
    type => ClientBankAccount,
    clientBankAccount => clientBankAccount.idClientBankAccount,
    { nullable: true },
  )
  clientBankAccount: ClientBankAccount;
}
