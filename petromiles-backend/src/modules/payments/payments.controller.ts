import { Interest } from './interest.interface';
import {
  Controller,
  Post,
  Body,
  UseGuards,
  ValidationPipe,
  Inject,
  Get,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

import { GetUser } from '../auth/decorators/get-user.decorator';
import { PaymentsService } from './payments.service';

// INTERFACES
import { ApiModules } from '@/logger/api-modules.enum';
import { TransactionType } from '@/modules/transaction/transaction/transaction.enum';
import { CreatePaymentDTO } from './dto/create-payment.dto';

const baseEndpoint = 'payments';

@UseGuards(AuthGuard('jwt'))
@Controller(baseEndpoint)
export class PaymentsController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private paymentsService: PaymentsService,
  ) {}

  @Post('buy-points')
  async buyPoints(
    @GetUser() user,
    @Body(ValidationPipe) paymentProperties: CreatePaymentDTO,
  ) {
    const { idClientBankAccount, amount, amountToCharge } = paymentProperties;
    this.logger.http(
      `[${ApiModules.PAYMENTS}] {${user.email}} asks /${baseEndpoint}/buy-points`,
    );
    return await this.paymentsService.buyPoints(
      user.id,
      idClientBankAccount,
      amount,
      amountToCharge,
    );
  }

  @Post('withdraw-points')
  async withdrawPoints(
    @GetUser() user,
    @Body(ValidationPipe) paymentProperties: CreatePaymentDTO,
  ) {
    const { idClientBankAccount, amount } = paymentProperties;
    this.logger.http(
      `[${ApiModules.PAYMENTS}] {${user.email}} asks /${baseEndpoint}/withdraw-points`,
    );

    return await this.paymentsService.withdrawPoints(
      user,
      idClientBankAccount,
      amount,
    );
  }

  @Get('one-point-to-dollars')
  async getOnePointToDollars(@GetUser() user): Promise<number> {
    this.logger.http(
      `[${ApiModules.PAYMENTS}] {${user.email}} asks /${baseEndpoint}/one-point-to-dollars`,
    );
    const onePointToDollars = await this.paymentsService.getOnePointToDollars();
    return onePointToDollars;
  }

  @Get('interests/:transactionType')
  async getInterest(
    @GetUser() user,
    @Param('transactionType') transactionType: TransactionType,
  ): Promise<Interest[]> {
    this.logger.http(
      `[${ApiModules.PAYMENTS}] {${user.email}} asks /${baseEndpoint}/interests/${transactionType}`,
    );
    const interests = await this.paymentsService.getInterests(transactionType);
    return interests;
  }
}
