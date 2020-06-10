import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Transform } from 'class-transformer';

import { ClientBankAccount } from './client-bank-account.entity';
import { UserDetails } from './user-details.entity';

@Entity()
export class BankAccount extends BaseEntity {
  @PrimaryGeneratedColumn()
  idBankAccount: number;

  @Transform(accountNumber => `${accountNumber.substr(-4)}`)
  @Column()
  accountNumber: string;

  @Column()
  checkNumber: string;

  @Column()
  type: string;

  @Column({ nullable: true })
  primary?: string;

  @Column()
  routingNumber: number;

  @OneToMany(
    type => ClientBankAccount,
    clientBankAccount => clientBankAccount.bankAccount,
    { nullable: true },
  )
  clientBankAccount: ClientBankAccount[];

  @ManyToOne(
    type => UserDetails,
    userDetails => userDetails.idUserDetails,
    { nullable: true },
  )
  @JoinColumn({ name: 'fk_person_details' })
  userDetails: UserDetails;
}
