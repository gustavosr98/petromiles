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
  Param,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {Roles} from "@/modules/auth/decorators/roles.decorator";

import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { GetUser } from '@/modules/auth/decorators/get-user.decorator';

// INTERFACES
import { CreateBankAccountDTO } from '../dto/createBankAccount.dto';
import { Role } from '@/enums/role.enum';
import { HttpRequest } from '@/logger/http-requests.enum';
import { ApiModules } from '@/logger/api-modules.enum';

// SERVICES
import { ClientBankAccountService } from '../services/client-bank-account.service';
import { BankAccountService } from '../services/bank-account.service';
import {RolesGuard} from "@/modules/auth/guards/roles.guard";

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

    const clientBankAccount = await this.clientBankAccountService.create({
      ...bankAccountCreateParams,
      email: user.email,
    });

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
    const verification = await this.clientBankAccountService.verify(
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
      return await this.clientBankAccountService.getClientBankAccounts(user.id);

    return await this.bankAccountService.getAll();
  }

  @Delete('cancel/:id')
  async cancelBankAccount(
    @GetUser() user,
    @Param('id', ParseIntPipe) idBankAccount,
  ) {
    const { email, id } = user;
    this.logger.http(
      `[${ApiModules.BANK_ACCOUNT}] (${HttpRequest.PUT}) ${user.email} asks /${baseEndpoint}/cancel/${idBankAccount}`,
    );
    return await this.clientBankAccountService.cancelBankAccount(
      id,
      idBankAccount,
      email,
    );
  }

  @Roles(Role.ADMINISTRATOR)
  @UseGuards(RolesGuard)
  @Get('accounts/:account')
  accountInfo(@Param('account') accountId: number){
    this.logger.http(
        `[${ApiModules.BANK_ACCOUNT}] (${HttpRequest.GET}) ask /${baseEndpoint}/account/${accountId}`
    );
    return this.bankAccountService.accountInfo(accountId)
  }

  @Roles(Role.ADMINISTRATOR)
  @UseGuards(RolesGuard)
  @Get('accounts')
  allAccountInfo(){
      this.logger.http(
          `[${ApiModules.BANK_ACCOUNT}] (${HttpRequest.GET}) ask /${baseEndpoint}/accounts all`
      );
      return this.bankAccountService.getAllAccounts();
  }
}
