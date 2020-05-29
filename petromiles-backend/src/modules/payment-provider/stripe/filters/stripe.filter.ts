import { ArgumentsHost, Catch, ExceptionFilter, Inject } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ApiSubmodules } from '@/logger/api-modules.enum';

import Stripe from 'stripe';
import { ERROR } from '@/exceptions/error-messages';

@Catch(Stripe.errors.StripeError)
export class StripeFilter<T> implements ExceptionFilter {
  @Inject(WINSTON_MODULE_PROVIDER)
  private logger: Logger;
  catch(exception: Stripe.StripeError, host: ArgumentsHost) {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response = ctx.getResponse();

    this.logger.error(
      `${[ApiSubmodules.STRIPE]} ${exception.message}`,
      exception,
    );

    response.status(ERROR.STRIPE.statusCode).json(ERROR.STRIPE);
  }
}
