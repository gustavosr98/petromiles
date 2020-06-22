import { UserDetails } from '@/entities/user-details.entity';

import { IsNotEmpty, IsOptional } from 'class-validator';

import { Bank } from '@/entities/bank.entity';

export class CreateBankAccountDTO {
  @IsNotEmpty()
  accountNumber: string;

  @IsNotEmpty()
  routingNumber: string;

  @IsNotEmpty()
  checkNumber: string;

  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  nickname: string;

  @IsOptional()
  userDetails?: UserDetails;

  @IsNotEmpty()
  bank: Bank;
}
