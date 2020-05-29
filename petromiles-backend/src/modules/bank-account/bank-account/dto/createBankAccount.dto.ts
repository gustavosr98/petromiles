import { UserDetails } from '../../../user/user-details/user-details.entity';

import {
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsNumber,
  MaxLength,
  MinLength,
} from 'class-validator';
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
