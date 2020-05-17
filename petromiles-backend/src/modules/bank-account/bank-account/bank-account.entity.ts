import { ClientBankAccount } from '../../client/client-bank-account/client-bank-account.entity';
import { UserDetails } from '../../user/user-details/user-details.entity';
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
