import {
  IsEmail,
  MinLength,
  IsNotEmpty,
  IsString,
  IsOptional,
} from 'class-validator';

import { Country } from '@/entities/country.entity';

export class CreateUserDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @MinLength(8)
  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  salt?: string;

  @IsString()
  @IsOptional()
  facebookToken?: string;

  @IsString()
  @IsOptional()
  googleToken?: string;

  @IsString()
  @IsOptional()
  middleName?: string;

  @IsString()
  @IsOptional()
  secondLastName?: string;

  @IsOptional()
  birthdate?: Date;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  photo?: string;

  @IsOptional()
  country?: Country;
}
