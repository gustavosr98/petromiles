import { IsOptional } from 'class-validator';
export class UpdateUserDTO {
  @IsOptional()
  email?: string;

  @IsOptional()
  password?: string;

  @IsOptional()
  salt?: string;
}
