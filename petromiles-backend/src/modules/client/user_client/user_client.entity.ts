import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
} from 'typeorm';

import { ClientBankAccount } from '../client_bank_account/client_bank_account.entity';
import { StateUser } from '../../user/state_user/state_user.entity';
import { UserDetails } from '../../user/user_details/user_details.entity';
import { UserSuscription } from '../../suscription/user_suscription/user_suscription.entity';

@Entity()
export class UserClient extends BaseEntity {
  @PrimaryGeneratedColumn()
  id_user_client: number;

  @Column({ nullable: true })
  google_token: string;

  @Column({ nullable: true })
  facebook_token: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

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
    type => UserSuscription,
    userSuscription => userSuscription.id_user_suscription,
    { nullable: false },
  )
  userSuscription: UserSuscription;

  @OneToMany(
    type => ClientBankAccount,
    clientBankAccount => clientBankAccount.id_client_bank_account,
    { nullable: true },
  )
  clientBankAccount: ClientBankAccount;
}
