import { Module } from '@nestjs/common';

// SERVICES
import { SuscriptionService } from '@/modules/suscription/service/suscription.service';

// MODULES
import { UserModule } from '@/modules/user/user.module';
import { BankAccountModule } from '@/modules/bank-account/bank-account.module';
import { TransactionModule } from '@/modules/transaction/transaction.module';
import { MailsModule } from '@/modules/mails/mails.module';
import { ManagementModule } from '@/modules/management/management.module';
import { PaymentProviderModule } from '@/modules/payment-provider/payment-provider.module';

//CONTROLLER
import { SuscriptionController } from '@/modules/suscription/controller/suscription.controller';
import { Suscription } from '@/entities/suscription.entity';
import { UserClient } from '@/entities/user-client.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import {PlatformInterest} from "@/entities/platform-interest.entity";

@Module({
  imports: [
    UserModule,
    BankAccountModule,
    TransactionModule,
    MailsModule,
    ManagementModule,
    PaymentProviderModule,
    TypeOrmModule.forFeature([Suscription, UserClient, PlatformInterest]),
  ],
  providers: [SuscriptionService],
  exports: [SuscriptionService],
  controllers: [SuscriptionController],
})
export class SuscriptionModule {}
