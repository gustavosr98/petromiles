import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Transform } from 'class-transformer';

// ENTITIES
import { TransactionInterest } from '@/entities/transaction-interest.entity';

// INTERFACES
import { PaymentProvider } from '@/enums/payment-provider.enum';
import { TransactionType } from '@/enums/transaction.enum';

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

  @Transform(amount => Math.round(amount * 100) / 10000)
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
