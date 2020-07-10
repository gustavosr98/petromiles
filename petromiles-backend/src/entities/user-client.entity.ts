import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Exclude } from 'class-transformer';

import * as bcrypt from 'bcrypt';

import { ClientBankAccount } from '@/entities/client-bank-account.entity';
import { StateUser } from '@/entities/state-user.entity';
import { UserDetails } from '@/entities/user-details.entity';
import { UserRole } from '@/entities/user-role.entity';
import { UserSuscription } from '@/entities/user-suscription.entity';
import { ClientOnThirdParty } from '@/entities/client-on-third-party.entity';

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

  @OneToMany(
    type => StateUser,
    stateUser => stateUser.userClient,
    {
      nullable: true,
      eager: true,
    },
  )
  stateUser: StateUser[];

  @OneToMany(
    type => UserRole,
    userRole => userRole.userClient,
    {
      nullable: true,
    },
  )
  userRole: UserRole[];

  @OneToOne(
    type => UserDetails,
    userDetails => userDetails.userClient,
    {
      nullable: true,
      eager: true,
    },
  )
  userDetails: UserDetails;

  @OneToMany(
    type => UserSuscription,
    userSuscription => userSuscription.userClient,
    { nullable: false, eager: true },
  )
  userSuscription: UserSuscription[];

  @OneToMany(
    type => ClientBankAccount,
    clientBankAccount => clientBankAccount.userClient,
    { nullable: true },
  )
  clientBankAccount: ClientBankAccount[];

  @OneToMany(
    type => ClientOnThirdParty,
    clientOnThirdParty => clientOnThirdParty.idClientOnThirdParty,
    { nullable: true },
  )
  clientOnThirdParty?: ClientOnThirdParty[];

  async isPasswordCorrect(password: string): Promise<boolean> {
    const passwordHashed = await bcrypt.hash(password, this.salt);
    return passwordHashed === this.password;
  }
}
