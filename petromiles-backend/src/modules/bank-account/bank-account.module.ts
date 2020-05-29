import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// MODULES
import { UserModule } from '../user/user.module';
import { TransactionModule } from '../transaction/transaction.module';
import { ManagementModule } from '../management/management.module';
import { PaymentProviderModule } from '@/modules/payment-provider/payment-provider.module';

// CONTROLLER
import { BankAccountController } from './bank-account.controller';

// SERVICES
import { BankAccountService } from './bank-account.service';
import { StateBankAccountService } from './state-bank-account/state-bank-account.service';
import { StateService } from '../management/state/state.service';
import { ClientBankAccountService } from './client-bank-account/client-bank-account.service';

// ENTITIES
import { BankAccount } from './bank-account/bank-account.entity';
import { StateBankAccount } from './state-bank-account/state-bank-account.entity';
import { ClientBankAccount } from './client-bank-account/client-bank-account.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BankAccount,
      StateBankAccount,
      ClientBankAccount,
    ]),
    PaymentProviderModule,
    ManagementModule,
    TransactionModule,
    UserModule,
  ],
  providers: [
    BankAccountService,
    StateBankAccountService,
    ClientBankAccountService,
    StateService,
  ],
  exports: [
    BankAccountService,
    StateBankAccountService,
    ClientBankAccountService,
  ],
  controllers: [BankAccountController],
})
export class BankAccountModule {}
