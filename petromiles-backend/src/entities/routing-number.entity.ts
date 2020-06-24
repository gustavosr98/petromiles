import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import { Bank } from '@/entities/bank.entity';
import { BankAccount } from '@/entities/bank-account.entity';

@Entity()
export class RoutingNumber extends BaseEntity {
  @PrimaryGeneratedColumn()
  idRoutingNumber: number;

  @Column()
  number: string;

  @ManyToOne(
    type => Bank,
    bank => bank.idBank,
    { nullable: false, eager: true },
  )
  @JoinColumn({ name: 'fk_bank' })
  bank: Bank;

  @OneToMany(
    type => BankAccount,
    bankAccount => bankAccount.idBankAccount,
    { nullable: true },
  )
  bankAccount?: BankAccount[];
}
