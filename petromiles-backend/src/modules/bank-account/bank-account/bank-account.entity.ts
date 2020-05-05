import { ClientBankAccount } from '../../client/client-bank-account/client-bank-account.entity';
import { UserDetails } from '../../user/user-details/user-details.entity';
import { RoutingNumber } from '../routing-number/routing-number.entity';
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
export class BankAccount extends BaseEntity {
  @PrimaryGeneratedColumn()
  idBankAccount: number;

  @Column()
  accountNumber: string;

  @Column({ nullable: true })
  primary: string;

  @OneToMany(
    type => ClientBankAccount,
    clientBankAccount => clientBankAccount.idClientBankAccount,
    { nullable: false },
  )
  clientBankAccount: ClientBankAccount;

  @ManyToOne(
    type => UserDetails,
    userDetails => userDetails.idUserDetails,
    { nullable: true },
  )
  @JoinColumn({ name: 'fk_person_details' })
  userDetails: UserDetails;

  @OneToOne(
    type => RoutingNumber,
    routingNumber => routingNumber.idRoutingNumber,
    { nullable: false },
  )
  @JoinColumn({ name: 'fk_routing_number' })
  routingNumber: RoutingNumber;
}
