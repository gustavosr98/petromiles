import { UserClient } from '../../client/user_client/user_client.entity';
import { UserAdministrator } from '../../management/user_administrator/user_administrator.entity';
import { Language } from '../language/language.entity';
import { Country } from '../../management/country/country.entity';
import { BankAccount } from '../../bank-account/bank_account/bank_account.entity';
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

@Entity()
export class UserDetails extends BaseEntity {
  @PrimaryGeneratedColumn()
  id_user_details: number;

  @Column()
  first_name: string;

  @Column({ nullable: true })
  middle_name: string;

  @Column()
  last_name: string;

  @Column({ nullable: true })
  second_last_name: string;

  @Column({ nullable: true })
  birthdate: Date;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  phone: string;

  /*FOTO DE QUE TIPO ES */
  @Column({ nullable: true })
  photo: string;

  @OneToOne(
    type => UserClient,
    userClient => userClient.id_user_client,
    { nullable: true },
  )
  @JoinColumn({ name: 'fk_user_client' })
  userClient: UserClient;

  @OneToOne(
    type => UserAdministrator,
    userAdministrator => userAdministrator.id_user_administrator,
    { nullable: true },
  )
  @JoinColumn({ name: 'fk_user_administrator' })
  userAdministrator: UserAdministrator;

  @ManyToOne(
    type => Language,
    language => language.id_language,
    { nullable: false },
  )
  @JoinColumn({ name: 'fk_language' })
  language: Language;

  @ManyToOne(
    type => Country,
    country => country.id_country,
    { nullable: true },
  )
  @JoinColumn({ name: 'fk_country' })
  country: Country;

  @OneToMany(
    type => BankAccount,
    bankAccount => bankAccount.id_bank_account,
    { nullable: true },
  )
  bankAccount: BankAccount;
}
