import { UserDetails } from '@/entities/user-details.entity';

import { IsNotEmpty, IsOptional } from 'class-validator';
export class CreateBankAccountDTO {
  @IsNotEmpty()
  accountNumber: number;

  @IsNotEmpty()
  routingNumber: string;

  @IsNotEmpty()
  checkNumber: number;

  @IsNotEmpty()
  type: string;

  @IsOptional()
  userDetails?: UserDetails;
}
