import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Exclude } from 'class-transformer';

import { ClientBankAccount } from '../../bank-account/client-bank-account/client-bank-account.entity';
import { StateUser } from '../state-user/state-user.entity';
import { UserDetails } from '../user-details/user-details.entity';
import { UserRole } from '../user-role/user-role.entity';
import { UserSuscription } from '../../user-suscription/user-suscription.entity';

@Entity()
export class UserClient extends BaseEntity {
  @PrimaryGeneratedColumn()
  idUserClient: number;

  @Column({ nullable: true })
  @Exclude()
  salt: string;

  @Column({ nullable: true })
  googleToken: string;

  @Column({ nullable: true })
  facebookToken: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  @Exclude()
  password: string;

  @OneToMany((type) => StateUser, (stateUser) => stateUser.userClient, {
    nullable: true,
    eager: true,
  })
  stateUser: StateUser[];

  @OneToMany((type) => UserRole, (userRole) => userRole.userClient, {
    nullable: true,
  })
  userRole: UserRole[];

  @OneToOne((type) => UserDetails, (userDetails) => userDetails.userClient, {
    nullable: true,
    eager: true,
  })
  userDetails: UserDetails;

  @OneToMany(
    (type) => UserSuscription,
    (userSuscription) => userSuscription.userClient,
    { nullable: false, eager: true },
  )
  userSuscription: UserSuscription[];

  @OneToMany(
    (type) => ClientBankAccount,
    (clientBankAccount) => clientBankAccount.userClient,
    { nullable: true },
  )
  clientBankAccount: ClientBankAccount[];
}
