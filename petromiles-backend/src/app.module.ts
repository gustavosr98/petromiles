// NEST CORE
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// CONFIGURATION
import configuration from '@/config/configuration';

// LOGGER
import { WinstonModule } from 'nest-winston';
import createOptions from './logger/winston/winston-config';

// MODULES
import { AuthModule } from '@/modules/auth/auth.module';
import { BankAccountModule } from '@/modules/bank-account/bank-account.module';
import { CronModule } from '@/modules/cron/cron.module';
import { DatabaseModule } from './database/database.module';
import { ExampleModule } from '@/modules/example/example.module';
import { LanguageModule } from '@/modules/language/language.module';
import { MailsModule } from '@/modules/mails/mails.module';
import { ManagementModule } from '@/modules/management/management.module';
import { SuscriptionModule } from '@/modules/suscription/suscription.module';
import { TransactionModule } from '@/modules/transaction/transaction.module';
import { UserModule } from '@/modules/user/user.module';
import { PaymentsModule } from '@/modules/payments/payments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development', '.env'],
      load: [configuration],
    }),
    AuthModule,
    BankAccountModule,
    CronModule,
    DatabaseModule,
    ExampleModule,
    LanguageModule,
    MailsModule,
    ManagementModule,
    SuscriptionModule,
    UserModule,
    TransactionModule,
    WinstonModule.forRoot(createOptions({ fileName: 'petromiles-global.log' })),
    PaymentsModule,
  ],
  providers: [],
})
export class AppModule {}
