import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Exclude } from 'class-transformer';

// ENTITIES
import { UserClient } from './user-client.entity';
import { Language } from './language.entity';
import { Country } from './country.entity';
import { BankAccount } from './bank-account.entity';
import { UserAdministrator } from './user-administrator.entity';

@Entity()
export class UserDetails extends BaseEntity {
  @PrimaryGeneratedColumn()
  idUserDetails: number;

  @Column()
  firstName: string;

  @Column({ nullable: true })
  middleName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  secondLastName?: string;

  @Column({ nullable: true })
  birthdate?: Date;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  photo?: string;

  @Column({ nullable: true })
  @Exclude()
  customerId?: string;

  @Column({ nullable: true })
  @Exclude()
  accountId?: string;

  @OneToOne(
    type => UserClient,
    userClient => userClient.idUserClient,
    {
      nullable: true,
    },
  )
  @JoinColumn({ name: 'fk_user_client' })
  userClient?: UserClient;

  @OneToOne(
    type => UserAdministrator,
    userAdministrator => userAdministrator.idUserAdministrator,
    { nullable: true },
  )
  @JoinColumn({ name: 'fk_user_administrator' })
  userAdministrator?: UserAdministrator;

  @ManyToOne(
    type => Language,
    language => language.idLanguage,
    {
      nullable: true,
      eager: true,
    },
  )
  @JoinColumn({ name: 'fk_language' })
  language?: Language;

  @ManyToOne(
    type => Country,
    country => country.idCountry,
    {
      nullable: true,
      eager: true,
    },
  )
  @JoinColumn({ name: 'fk_country' })
  country?: Country;

  @OneToMany(
    type => BankAccount,
    bankAccount => bankAccount.userDetails,
    {
      nullable: true,
    },
  )
  bankAccount?: BankAccount[];
}
