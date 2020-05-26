import {
  Controller,
  Post,
  Body,
  UseGuards,
  ValidationPipe,
  Inject,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { Logger } from 'winston';

import { GetUser } from '../auth/decorators/get-user.decorator';
import { CreatePaymentDTO } from './dto/create-payment.dto';
import { PaymentsService } from './payments.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ApiModules } from '@/logger/api-modules.enum';

const baseEndpoint = 'payments';

@UseGuards(AuthGuard('jwt'))
@Controller(baseEndpoint)
export class PaymentsController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private paymentsService: PaymentsService,
  ) {}

  @Post('buy-points')
  buyPoints(
    @GetUser() user,
    @Body(ValidationPipe) paymentProperties: CreatePaymentDTO,
  ) {
    const { idClientBankAccount, amount } = paymentProperties;
    this.logger.http(
      `[${ApiModules.PAYMENTS}] {${user.email}} asks /${baseEndpoint}/buy-points`,
    );
    return this.paymentsService.buyPoints(user.id, idClientBankAccount, amount);
  }

  @Post('withdraw-points')
  withdrawPoints(
    @GetUser() user,
    @Body(ValidationPipe) paymentProperties: CreatePaymentDTO,
  ) {
    const { idClientBankAccount, amount } = paymentProperties;
    this.logger.http(
      `[${ApiModules.PAYMENTS}] {${user.email}} asks /${baseEndpoint}/withdraw-points`,
    );

    return this.paymentsService.withdrawPoints(
      user,
      idClientBankAccount,
      amount,
    );
  }
}
