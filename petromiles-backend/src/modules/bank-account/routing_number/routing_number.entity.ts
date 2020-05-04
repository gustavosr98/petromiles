import { BankAccount } from '../bank_account/bank_account.entity';
import { Bank } from '../bank/bank.entity';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
@Entity()
export class RoutingNumber extends BaseEntity {
  @PrimaryGeneratedColumn()
  id_routing_number: number;

  @Column()
  region: string;

  @Column()
  aba: number;

  @Column()
  ach: number;

  @OneToMany(
    type => BankAccount,
    bankAccount => bankAccount.id_bank_account,
    { nullable: true },
  )
  bankAccount: BankAccount;
  @ManyToOne(
    type => Bank,
    bank => bank.id_bank,
    { nullable: false },
  )
  @JoinColumn({ name: 'fk_bank' })
  bank: Bank;
}
