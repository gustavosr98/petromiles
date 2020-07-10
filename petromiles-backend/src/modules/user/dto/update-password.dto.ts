import { IsNotEmpty, MinLength } from 'class-validator';
export class UpdatePasswordDTO {
  @IsNotEmpty()
  currentPassword: string;

  @MinLength(8)
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  salt: string;
}
