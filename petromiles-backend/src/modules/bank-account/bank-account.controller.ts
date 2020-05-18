import {
  Controller,
  Post,
  ValidationPipe,
  Body,
  UseGuards,
} from '@nestjs/common';
import { Inject } from '@nestjs/common';

import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { CreateBankAccountDTO } from './bank-account/dto/createBankAccount.dto';
import { ClientBankAccountService } from './client-bank-account/client-bank-account.service';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';

@UseGuards(AuthGuard('jwt'))
@Controller('bank-account')
export class BankAccountController {
  constructor(
    private clientBankAccountService: ClientBankAccountService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @Roles()
  @UseGuards(RolesGuard)
  @Post()
  async createClientBankAccount(
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
}
