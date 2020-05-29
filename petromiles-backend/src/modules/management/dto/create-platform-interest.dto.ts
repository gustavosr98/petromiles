import { IsOptional, IsNotEmpty } from 'class-validator';
export class CreatePlatformInterestDTO {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  amount: string;

  @IsOptional()
  percentage: string;
}
