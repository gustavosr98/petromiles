import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// MODULES
import { ScheduleModule } from '@nestjs/schedule';
import { StripeModule } from '@/modules/payment-provider/stripe/stripe.module';
import { BankAccountModule } from '@/modules/bank-account/bank-account.module';
import { TransactionModule } from '@/modules/transaction/transaction.module';
import { SuscriptionModule } from '@/modules/suscription/suscription.module';
import { MailsModule } from '@/modules/mails/mails.module';

// ENTITIES
import { Task } from '@/entities/task.entity';

//CONTROLLERS
import { CronController } from '@/modules/cron/controllers/cron.controller';

//SERVICES
import { CronService } from '@/modules/cron/services/cron.service';

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
  controllers: [CronController],
})
export class CronModule {}
