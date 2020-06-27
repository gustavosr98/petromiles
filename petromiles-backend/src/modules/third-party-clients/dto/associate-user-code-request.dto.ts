import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class AssociateUserCodeRequest {
  @IsNotEmpty()
  @IsString()
  apiKey: string; // Platform unique identifier provided by secretly Petromiles

  @IsNotEmpty()
  @IsEmail()
  userEmail: string; // Petromiles existing user email
}
