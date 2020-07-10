import {
  Controller,
  Post,
  Body,
  UseGuards,
  ValidationPipe,
  Inject,
  Get,
  Param,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';

import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

import { GetUser } from '@/modules/auth/decorators/get-user.decorator';

// ENTITIES
import { Transaction } from '@/entities/transaction.entity';
import { PointsConversion } from '@/entities/points-conversion.entity';

// INTERFACES
import { ApiModules } from '@/logger/api-modules.enum';
import { TransactionType } from '@/enums/transaction.enum';
import { CreatePaymentDTO } from '@/modules/payments/dto/create-payment.dto';
import { Interest } from '@/modules/payments/interest.interface';

// SERVICES
import { PaymentsService } from '../services/payments.service';

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
  ): Promise<Transaction> {
    const {
      idClientBankAccount,
      amount,
      amountToCharge,
      points,
      subscriptionName,
      infoSubscription,
    } = paymentProperties;
    this.logger.http(
      `[${ApiModules.PAYMENTS}] {${user.email}} asks /${baseEndpoint}/buy-points`,
    );
    return await this.paymentsService.buyPoints(
      idClientBankAccount,
      amount,
      amountToCharge,
      points,
      subscriptionName,
      infoSubscription,
    );
  }

  @Post('withdraw-points')
  async withdrawPoints(
    @GetUser() user,
    @Body(ValidationPipe) paymentProperties: CreatePaymentDTO,
  ) {
    const {
      idClientBankAccount,
      amount,
      amountToCharge,
      points,
    } = paymentProperties;
    this.logger.http(
      `[${ApiModules.PAYMENTS}] {${user.email}} asks /${baseEndpoint}/withdraw-points`,
    );

    return await this.paymentsService.withdrawPoints(
      user,
      idClientBankAccount,
      amount,
      amountToCharge,
      points,
    );
  }

  @Get('one-point-to-dollars')
  async getOnePointToDollars(@GetUser() user): Promise<PointsConversion> {
    this.logger.http(
      `[${ApiModules.PAYMENTS}] {${user.email}} asks /${baseEndpoint}/one-point-to-dollars`,
    );
    const onePointToDollars = await this.paymentsService.getOnePointToDollars();
    return onePointToDollars;
  }

  @Get('interests/:transactionType/:platformInterestType')
  async getInterest(
    @GetUser() user,
    @Param('transactionType') transactionType: TransactionType,
    @Param('platformInterestType') platformInterestType,
  ): Promise<Interest[]> {
    this.logger.http(
      `[${ApiModules.PAYMENTS}] {${user.email}} asks /${baseEndpoint}/interests/${transactionType}`,
    );
    const interests = await this.paymentsService.getInterests(
      transactionType,
      platformInterestType,
    );
    return interests;
  }

  @Post('deposit/invoice/:points/:total')
  @UseInterceptors(FileInterceptor('file'))
  sendPaymentInvoiceEmail(@UploadedFile() file, @GetUser() user) {
    this.paymentsService.sendPaymentInvoiceEmail(user, file);
  }

  @Post('withdrawal/invoice/:points/:total')
  @UseInterceptors(FileInterceptor('file'))
  sendWithdrawalInvoiceEmail(
    @UploadedFile() file,
    @GetUser() user,
    @Param('points') points,
    @Param('total') total,
  ) {
    this.paymentsService.sendWithdrawalInvoiceEmail(user, file, points, total);
  }
}
