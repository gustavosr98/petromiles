import { Module } from '@nestjs/common';

// MODULES
import { TransactionModule } from '@/modules/transaction/transaction.module';
import { BankAccountModule } from '@/modules/bank-account/bank-account.module';
import { SuscriptionModule } from '@/modules/suscription/suscription.module';
import { UserModule } from '@/modules/user/user.module';
import { ManagementModule } from '@/modules/management/management.module';
import { PaymentProviderModule } from '@/modules/payment-provider/payment-provider.module';
import { MailsModule } from '@/modules/mails/mails.module';

// CONTROLLER
import { PaymentsController } from '@/modules/payments/controller/payments.controller';

// SERVICES
import { PaymentsService } from '@/modules/payments/services/payments.service';

@Module({
  imports: [
    TransactionModule,
    BankAccountModule,
    SuscriptionModule,
    UserModule,
    ManagementModule,
    PaymentProviderModule,
    MailsModule,
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
