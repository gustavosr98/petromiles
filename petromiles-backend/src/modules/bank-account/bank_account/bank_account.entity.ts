import { ClientBankAccount } from '../../client/client_bank_account/client_bank_account.entity';
import { UserDetails } from '../../user/user_details/user_details.entity';
import { RoutingNumber } from '../routing_number/routing_number.entity';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class BankAccount extends BaseEntity {
  @PrimaryGeneratedColumn()
  id_bank_account: number;

  @Column()
  account_number: string;

  @Column({ nullable: true })
  primary: string;

  @OneToMany(
    type => ClientBankAccount,
    clientBankAccount => clientBankAccount.id_client_bank_account,
    { nullable: false },
  )
  clientBankAccount: ClientBankAccount;

  @ManyToOne(
    type => UserDetails,
    userDetails => userDetails.id_user_details,
    { nullable: true },
  )
  @JoinColumn({ name: 'fk_person_details' })
  userDetails: UserDetails;

  @ManyToOne(
    type => RoutingNumber,
    routingNumber => routingNumber.id_routing_number,
    { nullable: false },
  )
  @JoinColumn({ name: 'fk_routing_number' })
  routingNumber: RoutingNumber;
}
