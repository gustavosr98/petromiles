import {
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsPositive,
  IsInt,
} from 'class-validator';

import { AddPointsRequestCurrency } from '@/enums/add-points-request-currency.enum';
import { ThirdPartyClientsErrorCodes } from '@/enums/third-party-clients-error-codes.enum';

export class Product {
  @IsNotEmpty()
  id: string; // Not signifinative to Petromiles. Only to be used as reference for third party clients

  @IsNotEmpty()
  @IsPositive()
  @IsInt()
  priceTag: number; // USD dollar cents Ej. 1000 = $1

  @IsNotEmpty()
  @IsEnum(AddPointsRequestCurrency, {
    message: ThirdPartyClientsErrorCodes.UNKNOWN_TYPE,
  })
  currency: string; // Ej. 'usd'

  @IsOptional()
  tentativePoints?: number;
}
