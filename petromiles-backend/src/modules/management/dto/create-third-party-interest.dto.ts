import { IsOptional, IsNotEmpty } from 'class-validator';
import { TransactionType } from '@/enums/transaction.enum';
export class CreateThirdPartyInterestDTO {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  transactionType: TransactionType;

  @IsNotEmpty()
  paymentProvider: string;

  @IsNotEmpty()
  amountDollarCents: number;
}
