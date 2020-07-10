import { IsNotEmpty } from 'class-validator';

export class updatePrimaryAccountDTO {
  @IsNotEmpty()
  primary: boolean;

  @IsNotEmpty()
  idBankAccount: number;
}
