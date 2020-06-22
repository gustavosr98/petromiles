import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Column,
} from 'typeorm';
import { Exclude } from 'class-transformer';

// ENTITIES
import { UserClient } from '@/entities/user-client.entity';
import { BankAccount } from './bank-account.entity';
import { Transaction } from '@/entities/transaction.entity';
import { StateBankAccount } from './state-bank-account.entity';

import { PaymentProvider } from '@/enums/payment-provider.enum';

@Entity()
export class ClientBankAccount extends BaseEntity {
  @PrimaryGeneratedColumn()
  idClientBankAccount: number;

  @Column({
    type: 'enum',
    enum: PaymentProvider,
  })
  @Exclude()
  paymentProvider: string;

  @Column({ nullable: true })
  @Exclude()
  chargeId?: string;

  @Column({ nullable: true, default: false })
  primary: boolean;

  @Column({ nullable: true })
  @Exclude()
  transferId?: string;

  @ManyToOne(
    type => UserClient,
    userClient => userClient.idUserClient,
    { nullable: false, eager: true },
  )
  @JoinColumn({ name: 'fk_user_client' })
  userClient: UserClient;

  @ManyToOne(
    type => BankAccount,
    bankAccount => bankAccount.idBankAccount,
    { nullable: false, eager: true },
  )
  @JoinColumn({ name: 'fk_bank_account' })
  bankAccount: BankAccount;

  @OneToMany(
    type => Transaction,
    transaction => transaction.clientBankAccount,
    { nullable: true },
  )
  transaction: Transaction[];

  @OneToMany(
    type => StateBankAccount,
    stateBankAccount => stateBankAccount.clientBankAccount,
    { nullable: false, eager: true },
  )
  stateBankAccount: StateBankAccount[];
}
