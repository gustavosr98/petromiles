import { IsOptional, IsNotEmpty } from 'class-validator';
export class CreateThirdPartyInterestDTO {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  transactionType: string;

  @IsNotEmpty()
  paymentProvider: string;

  @IsNotEmpty()
  amountDollarCents: number;
}
