import { IsOptional, IsNumber } from 'class-validator';
export class UpdateSubscriptionDTO {
  @IsNumber()
  @IsOptional()
  cost: number;

  @IsNumber()
  @IsOptional()
  upgradedAmount: number;
}
