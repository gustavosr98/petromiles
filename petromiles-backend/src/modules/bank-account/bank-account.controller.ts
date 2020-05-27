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
@UseInterceptors(ClassSerializerInterceptor)
export class BankAccountController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private clientBankAccountService: ClientBankAccountService,
    private bankAccountService: BankAccountService,
  ) {}

  @Post()
  async createClientBankAccount(
    @Body(ValidationPipe) bankAccountCreateParams: CreateBankAccountDTO,
    @GetUser() user,
  ) {
    this.logger.http(
      `[${ApiModules.BANK_ACCOUNT}] {${user.email}} Creating bank account to the client`,
    );

    const clientBankAccount = await this.clientBankAccountService.createClientBankAccount(
      {
        ...bankAccountCreateParams,
        email: user.email,
      },
    );

    const { bankAccount: bankAccountCreated } = clientBankAccount;
    return bankAccountCreated;
  }

  @Post('verify')
  async verifyBankAccount(
    @Body()
    verificationRequest: {
      clientBankAccountId: number;
      amounts: number[];
    },
  ) {
    const verification = await this.clientBankAccountService.verifyBankAccount(
      verificationRequest,
    );
    return verification;
  }

  @Get()
  async getClientBankAccounts(@GetUser() user) {
    this.logger.http(
      `[${ApiModules.BANK_ACCOUNT}] (${HttpRequest.GET}) ${user.email} asks /${baseEndpoint}/${user.role}`,
    );
    if (user.role === Role.CLIENT)
      return await this.bankAccountService.getClientBankAccounts(user.id);

    return await this.bankAccountService.getBankAccounts();
  }
}
