// NEST CORE
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// CONFIGURATION
import configuration from 'config/configuration';

// LOGGER
import { WinstonModule } from 'nest-winston';
import createOptions from './logger/winston/winston-config';

// MODULES
import { AuthModule } from './modules/auth/auth.module';
import { BankAccountModule } from './modules/bank-account/bank-account.module';
import { DatabaseModule } from './database/database.module';
import { ExampleModule } from './modules/example/example.module';
import { LanguageModule } from './modules/language/language.module';
import { MailsModule } from './modules/mails/mails.module';
import { ManagementModule } from './modules/management/management.module';
import { SuscriptionModule } from './modules/suscription/suscription.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !process.env.NODE_ENV
        ? ['.env.development', '.env']
        : ['.env', '.env.development'],
      load: [configuration],
    }),
    AuthModule,
    BankAccountModule,
    DatabaseModule,
    ExampleModule,
    LanguageModule,
    MailsModule,
    ManagementModule,
    SuscriptionModule,
    TransactionModule,
    UserModule,
    WinstonModule.forRoot(createOptions({ fileName: 'petromiles-global.log' })),
  ],
})
export class AppModule {}
