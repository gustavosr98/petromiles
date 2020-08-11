import {
  Controller,
  Get,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Inject,
  Param,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { GetUser } from '@/modules/auth/decorators/get-user.decorator';
import { Roles } from '@/modules/auth/decorators/roles.decorator';

// INTERFACES
import { ApiModules } from '@/logger/api-modules.enum';
import { HttpRequest } from '@/logger/http-requests.enum';
import { Role } from '@/enums/role.enum';
import { AuthenticatedUser } from '@/interfaces/auth/authenticated-user.interface';

// SERVICES
import { TransactionService } from '@/modules/transaction/services/transaction.service';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';

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
  getTransactions(@GetUser() user, @Query('id') idUserClient?: number) {
    this.logger.http(
      `[${ApiModules.TRANSACTION}] (${HttpRequest.GET}) ${user?.email} asks /${baseEndpoint}`,
    );
    const id = idUserClient ? idUserClient : user.id;
    return this.transactionService.getTransactions(id);
  }

  @Get('getThirdPartyTransactions/:id')
  getThirdPartyTransactions(
    @GetUser() user: AuthenticatedUser,
    @Param('id') id: number,
  ) {
    this.logger.http(
      `[${ApiModules.TRANSACTION}] (${HttpRequest.GET}) ${user?.email} asks /${baseEndpoint}/getThirdPartyTransactions/${id}`,
    );
    return this.transactionService.getThirdPartyTransactions({
      idThirdPartyClient: id,
    });
  }

  @Get(':idTransaction')
  getTransaction(
    @Param('idTransaction') idTransaction,
    @GetUser() user,
  ): Promise<App.Transaction.TransactionDetails> {
    this.logger.http(
      `[${ApiModules.TRANSACTION}] (${HttpRequest.GET})  ${user?.email} asks /${baseEndpoint}/${idTransaction}`,
    );
    return this.transactionService.get(idTransaction);
  }

  @Get('extra-points-type/:idTransaction')
  async getExtraPointsOfATransaction(
    @Param('idTransaction') idTransaction: number,
  ) {
    return await this.transactionService.getExtraPointsOfATransaction(
      idTransaction,
    );
  }

  @Get('admin/list/all')
  getTransactionsAdmin(@GetUser() user) {
    this.logger.http(
      `[${ApiModules.TRANSACTION}] (${HttpRequest.GET}) ${user?.email} asks /${baseEndpoint}`,
    );
    return this.transactionService.getTransactionsAdmin();
  }
}
