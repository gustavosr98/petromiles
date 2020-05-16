import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserClientService } from './user-client/user-client.service';
import { UserClient } from './user-client/user-client.entity';
import { UserModule } from '../user/user.module';
import { ClientBankAccountService } from './client-bank-account/client-bank-account.service';
import { BankAccountModule } from '../bank-account/bank-account.module';
import { BankAccountService } from '../bank-account/bank-account.service';
import { ClientBankAccount } from './client-bank-account/client-bank-account.entity';
import { StateBankAccountService } from '../bank-account/state-bank-account/state-bank-account.service';
import { StateService } from '../management/state/state.service';
import { PlatformAdministratorModule } from '../management/platform-administrator.module';
import { StateBankAccount } from '../bank-account/state-bank-account/state-bank-account.entity';
import { TransactionModule } from '../transaction/transaction.module';
import { TransactionService } from '../transaction/transaction.service';
import { TransactionInterestService } from '../transaction/transaction-interest/transaction-interest.service';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([UserClient, ClientBankAccount, StateBankAccount]),
    BankAccountModule,
    PlatformAdministratorModule,
    TransactionModule,
  ],
  providers: [
    UserClientService,
    ClientBankAccountService,
    BankAccountService,
    StateBankAccountService,
    StateService,
    TransactionService,
    TransactionInterestService,
  ],
  exports: [
    UserClientService,
    TypeOrmModule.forFeature([UserClient, ClientBankAccount]),
  ],
})
export class ClientModule {}
