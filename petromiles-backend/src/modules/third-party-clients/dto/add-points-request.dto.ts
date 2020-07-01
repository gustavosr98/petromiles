import {
  IsNotEmpty,
  IsEnum,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

import { Product } from '@/modules/third-party-clients/dto/product.dto';
import { AddPointsRequestType } from '@/enums/add-points-request-type.enum';
import { ThirdPartyClientsErrorCodes } from '@/enums/third-party-clients-error-codes.enum';

export class AddPointsRequest {
  @IsNotEmpty()
  apiKey: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Product)
  products: Product[];

  @IsOptional()
  totalTentativeCommission?: number; // USD dollar cents | Opertative expenses

  @IsNotEmpty()
  @IsEnum(AddPointsRequestType, {
    message: ThirdPartyClientsErrorCodes.UNKNOWN_TYPE,
  })
  type: AddPointsRequestType;
}
