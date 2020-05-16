import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { BankAccountService } from './bank-account.service';
import { StateBankAccountService } from './state-bank-account/state-bank-account.service';
import { BankAccount } from './bank-account/bank-account.entity';
import { StateBankAccount } from './state-bank-account/state-bank-account.entity';
import { PlatformAdministratorModule } from '../management/platform-administrator.module';
import { BankAccountController } from './bank-account.controller';
import { TransactionModule } from '../transaction/transaction.module';
import { StateService } from '../management/state/state.service';
import { TransactionService } from '../transaction/transaction.service';
import { ClientBankAccountService } from '../client/client-bank-account/client-bank-account.service';
import { UserClient } from '../client/user-client/user-client.entity';
import { ClientBankAccount } from '../client/client-bank-account/client-bank-account.entity';
import { UserClientService } from '../client/user-client/user-client.service';
import { StateUserService } from '../user/state-user/state-user.service';
import { UserModule } from '../user/user.module';
import { UserRoleService } from '../user/user-role/user-role.service';
import { TransactionInterestService } from '../transaction/transaction-interest/transaction-interest.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BankAccount,
      StateBankAccount,
      UserClient,
      ClientBankAccount,
    ]),
    PlatformAdministratorModule,
    BankAccountModule,
    TransactionModule,
    UserModule,
  ],
  providers: [
    BankAccountService,
    StateBankAccountService,
    ClientBankAccountService,
    StateService,
    TransactionService,
    UserClientService,
    StateUserService,
    UserRoleService,
    TransactionInterestService,
  ],
  exports: [
    BankAccountService,
    TypeOrmModule.forFeature([BankAccount]),
    StateBankAccountService,
  ],
  controllers: [BankAccountController],
})
export class BankAccountModule {}
