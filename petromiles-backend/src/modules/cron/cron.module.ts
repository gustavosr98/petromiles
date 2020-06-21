import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { TypeOrmModule } from '@nestjs/typeorm';

// MODULES
import { ScheduleModule } from '@nestjs/schedule';
import { StripeModule } from '@/modules/payment-provider/stripe/stripe.module';
import { BankAccountModule } from '@/modules/bank-account/bank-account.module';
import { TransactionModule } from './../transaction/transaction.module';
import { SuscriptionModule } from '../suscription/suscription.module';
import { MailsModule } from '@/modules/mails/mails.module';

// ENTITIES
import { Task } from '@/entities/task.entity';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([Task]),
    BankAccountModule,
    StripeModule,
    TransactionModule,
    SuscriptionModule,
    MailsModule,
  ],
  providers: [CronService],
  exports: [ScheduleModule.forRoot(), CronService],
})
export class CronModule {}
