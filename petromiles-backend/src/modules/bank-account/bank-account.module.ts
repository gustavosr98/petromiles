import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// MODULES
import { UserModule } from '@/modules/user/user.module';
import { TransactionModule } from '@/modules/transaction/transaction.module';
import { ManagementModule } from '@/modules/management/management.module';
import { PaymentProviderModule } from '@/modules/payment-provider/payment-provider.module';
import { MailsModule } from '@/modules/mails/mails.module';

// CONTROLLER
import { BankAccountController } from '@/modules/bank-account/controllers/bank-account.controller';

// SERVICES
import { BankAccountService } from './services/bank-account.service';
import { ClientBankAccountService } from './services/client-bank-account.service';

// ENTITIES
import { BankAccount } from '@/entities/bank-account.entity';
import { StateBankAccount } from '@/entities/state-bank-account.entity';
import { ClientBankAccount } from '@/entities/client-bank-account.entity';
import { RoutingNumber } from '@/entities/routing-number.entity';
import { UserClient } from '@/entities/user-client.entity';
import { UserDetails } from '@/entities/user-details.entity';
import { State } from '@/entities/state.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BankAccount,
      StateBankAccount,
      ClientBankAccount,
      RoutingNumber,
      UserClient,
      UserDetails,
      State,
    ]),
    PaymentProviderModule,
    ManagementModule,
    TransactionModule,
    UserModule,
    MailsModule,
  ],
  providers: [BankAccountService, ClientBankAccountService],
  exports: [BankAccountService, ClientBankAccountService],
  controllers: [BankAccountController],
})
export class BankAccountModule {}
