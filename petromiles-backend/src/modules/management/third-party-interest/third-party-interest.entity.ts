import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';

// ENTITIES
import { TransactionInterest } from '@/modules/transaction/transaction-interest/transaction-interest.entity';

// INTERFACES
import { PaymentProvider } from '@/modules/payment-provider/payment-provider.enum';
import { TransactionType } from '@/modules/transaction/transaction/transaction.enum';

@Entity()
export class ThirdPartyInterest extends BaseEntity {
  @PrimaryGeneratedColumn()
  idThirdPartyInterest: number;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  transactionType: string;

  @Column({
    type: 'enum',
    enum: PaymentProvider,
  })
  paymentProvider: string;

  @Column({ nullable: true })
  amountDollarCents: number;

  @Column({ nullable: true })
  percentage: number;

  @Column({ default: () => 'CURRENT_DATE' })
  initialDate: Date;

  @Column({ nullable: true })
  finalDate: Date;

  @OneToMany(
    type => TransactionInterest,
    transactionInterest => transactionInterest.thirdPartyInterest,
    { nullable: true },
  )
  transactionInterest: TransactionInterest[];
}
