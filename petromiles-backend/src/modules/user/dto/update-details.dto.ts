import { IsOptional } from 'class-validator';
import { Country } from '@/entities/country.entity';
export class UpdateDetailsDTO {
  @IsOptional()
  firstName?: string;

  @IsOptional()
  middleName?: string;

  @IsOptional()
  lastName?: string;

  @IsOptional()
  secondLastName?: string;

  @IsOptional()
  birthdate?: Date;

  @IsOptional()
  address?: string;

  @IsOptional()
  phone?: string;

  @IsOptional()
  photo?: string;

  @IsOptional()
  country?: Country;

  role: string;
}
