import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class AssociateUserTokenRequest {
  @IsNotEmpty()
  @IsString()
  apiKey: string; // Platform unique identifier provided by Petromiles secretly

  @IsNotEmpty()
  @IsEmail()
  userEmail: string; // Petromiles existing user email

  @IsNotEmpty()
  @IsString()
  userCode: string; // 8 digit code send to user by email
}
