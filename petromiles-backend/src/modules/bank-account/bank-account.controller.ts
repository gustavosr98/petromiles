import {
  Controller,
  Post,
  ValidationPipe,
  Body,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Inject,
  Get,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { CreateBankAccountDTO } from './bank-account/dto/createBankAccount.dto';
import { Role } from '../management/role/role.enum';
import { HttpRequest } from 'src/logger/http-requests.enum';
import { ApiModules } from '@/logger/api-modules.enum';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';

import { RolesGuard } from '../auth/guards/roles.guard';
import { BankAccountService } from './bank-account.service';
import { ClientBankAccountService } from './client-bank-account/client-bank-account.service';

const baseEndpoint = Object.freeze('bank-account');

@UseGuards(AuthGuard('jwt'))
@Controller(baseEndpoint)
export class BankAccountController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private clientBankAccountService: ClientBankAccountService,
    private bankAccountService: BankAccountService,
  ) {}

  @Roles()
  @UseGuards(RolesGuard)
  @Post()
  async createBankAccount(
    @Body(ValidationPipe) bankAccount: CreateBankAccountDTO,
    @GetUser() user,
  ) {
    this.logger.http(
      '[BANK_ACCOUNT] Creating bank account for the user: %s',
      user.email,
    );

    const clientBankAccount = await this.clientBankAccountService.createClientBankAccount(
      user.email,
      bankAccount,
    );

    this.logger.http(
      '[BANK_ACCOUNT] Bank account successfully created',
      user.email,
    );

    const { bankAccount: bankAccountCreated } = clientBankAccount;
    return bankAccountCreated;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  getClientBankAccounts(@GetUser() user) {
    this.logger.http(
      `[${ApiModules.BANK_ACCOUNT}] (${HttpRequest.GET}) ${user.email} asks /${baseEndpoint}/${user.role}`,
    );
    if (user.role === Role.CLIENT)
      return this.bankAccountService.getClientBankAccounts(user.id);

    return this.bankAccountService.getBankAccounts();
  }
}
