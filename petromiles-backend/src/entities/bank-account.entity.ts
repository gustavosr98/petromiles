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

import { ClientBankAccount } from '@/entities/client-bank-account.entity';
import { UserDetails } from '@/entities/user-details.entity';
import { RoutingNumber } from '@/entities/routing-number.entity';

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
  nickname: string;

  @Column()
  type: string;

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

  @ManyToOne(
    type => RoutingNumber,
    routingNumber => routingNumber.idRoutingNumber,
    { nullable: false, eager: true },
  )
  @JoinColumn({ name: 'fk_routing_number' })
  routingNumber: RoutingNumber;
}
