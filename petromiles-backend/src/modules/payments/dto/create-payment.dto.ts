import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePaymentDTO {
  @IsNotEmpty()
  idClientBankAccount: number;

  @IsNotEmpty()
  amount: string;

  @IsNotEmpty()
  amountToCharge: string;

  @IsNotEmpty()
  points: number;

  @IsOptional()
  subscriptionName?: string;

  @IsOptional()
  infoSubscription?;
}
