import { Product } from '@/interfaces/third-party-clients/product.interface';
import { AddPointsRequestType } from '@/enums/add-points-request-type.enum';

export interface AddPointsRequest {
  apiKey: string;
  products: Product[];
  type: AddPointsRequestType;
}
