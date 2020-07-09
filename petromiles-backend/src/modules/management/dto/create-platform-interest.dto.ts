import { IsOptional, IsNotEmpty } from 'class-validator';
import { Suscription } from '@/entities/suscription.entity';
import { PlatformInterest } from '@/enums/platform-interest.enum';
export class CreatePlatformInterestDTO {
  @IsNotEmpty()
  name: PlatformInterest;

  @IsOptional()
  points?: number;

  @IsOptional()
  amount?: string;

  @IsOptional()
  percentage?: string;

  @IsOptional()
  suscription?: Suscription;

  @IsOptional()
  description?: string;
}
