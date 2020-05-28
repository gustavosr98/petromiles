import { IsNotEmpty } from 'class-validator';
export class CreatePaymentDTO {
  @IsNotEmpty()
  idClientBankAccount: number;

  @IsNotEmpty()
  amount: string;

  @IsNotEmpty()
  amountToCharge: string;
}
