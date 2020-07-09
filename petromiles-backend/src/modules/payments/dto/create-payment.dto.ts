import { IsNotEmpty } from 'class-validator';

import { Interest } from '@/modules/payments/interest.interface';

export class CreatePaymentDTO {
  @IsNotEmpty()
  idClientBankAccount: number;

  @IsNotEmpty()
  amount: string;

  @IsNotEmpty()
  amountToCharge: string;

  @IsNotEmpty()
  points: number;
}
