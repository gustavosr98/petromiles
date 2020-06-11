import {
  Controller,
  Get,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Inject,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { GetUser } from '@/modules/auth/decorators/get-user.decorator';

// INTERFACES
import { ApiModules } from '@/logger/api-modules.enum';
import { HttpRequest } from '@/logger/http-requests.enum';

// SERVICES
import { TransactionService } from '@/modules/transaction/services/transaction.service';

const baseEndpoint = Object.freeze('transaction');

@UseGuards(AuthGuard('jwt'))
@UseInterceptors(ClassSerializerInterceptor)
@Controller(baseEndpoint)
export class TransactionController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private transactionService: TransactionService,
  ) {}

  @Get()
  getTransactions(@GetUser() user) {
    this.logger.http(
      `[${ApiModules.TRANSACTION}] (${HttpRequest.GET}) ${user?.email} asks /${baseEndpoint}`,
    );
    return this.transactionService.getTransactions(user.email);
  }

  @Get(':idTransaction')
  getTransaction(
    @Param('idTransaction') idTransaction,
    @GetUser() user,
  ): Promise<App.Transaction.TransactionInformation> {
    this.logger.http(
      `[${ApiModules.TRANSACTION}] (${HttpRequest.GET})  ${user?.email} asks /${baseEndpoint}/${idTransaction}`,
    );
    return this.transactionService.get(idTransaction);
  }
}
