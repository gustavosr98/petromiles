import { BankAccount } from '../bank-account/bank-account.entity';
import { Bank } from '../bank/bank.entity';
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  OneToOne,
} from 'typeorm';
@Entity()
export class RoutingNumber extends BaseEntity {
  @PrimaryGeneratedColumn()
  idRoutingNumber: number;

  @Column()
  region: string;

  @Column()
  aba: number;

  @Column()
  ach: number;

  @OneToOne(
    type => BankAccount,
    bankAccount => bankAccount.idBankAccount,
    { nullable: true },
  )
  bankAccount: BankAccount;
  @ManyToOne(
    type => Bank,
    bank => bank.idBank,
    { nullable: false },
  )
  @JoinColumn({ name: 'fk_bank' })
  bank: Bank;
}
