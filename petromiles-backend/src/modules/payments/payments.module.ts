import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { TransactionModule } from '../transaction/transaction.module';
import { BankAccountModule } from '../bank-account/bank-account.module';
import { SuscriptionModule } from '../suscription/suscription.module';
import { UserModule } from '../user/user.module';
import { ManagementModule } from '../management/management.module';
import { PaymentProviderModule } from './../payment-provider/payment-provider.module';

@Module({
  imports: [
    TransactionModule,
    BankAccountModule,
    SuscriptionModule,
    UserModule,
    ManagementModule,
    PaymentProviderModule,
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
