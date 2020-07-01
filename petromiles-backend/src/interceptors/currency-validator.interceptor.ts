import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { BadRequestException, Inject } from '@nestjs/common';

import { Observable } from 'rxjs';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

import { ApiModules } from '@/logger/api-modules.enum';
import { ThirdPartyClientsErrorCodes } from '@/enums/third-party-clients-error-codes.enum';
import { AddPointsRequestCurrency } from '@/enums/add-points-request-currency.enum';
import { Product } from '@/modules/third-party-clients/dto/product.dto';

export interface Response<T> {
  data: T;
}

@Injectable()
export class CurrencyInterceptor<T> implements NestInterceptor<T, Response<T>> {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  private areAllCurrenciesOk(
    products: Product[],
    currency: AddPointsRequestCurrency,
  ): boolean {
    return products.every(product => product.currency === currency);
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<Response<T>>> {
    const req = context.switchToHttp().getRequest();

    const currency = req.body.products[0].currency;

    const valid = this.areAllCurrenciesOk(req.body.products, currency);

    if (!valid) {
      this.logger.error(
        `[${ApiModules.THIRD_PARTY_CLIENTS}] Diferent currencies`,
      );
      throw new BadRequestException(
        ThirdPartyClientsErrorCodes.DIFFERENT_CURRENCIES,
      );
    }

    return next.handle().pipe();
  }
}
