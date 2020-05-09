import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import configuration from 'config/configuration';
import { APP_FILTER } from '@nestjs/core';
import { PostgreExceptionFilter } from './exceptions/postgre-exception.filter';
import { ExampleModule } from './modules/example/example.module';
import { BankAccountModule } from './modules/bank-account/bank-account.module';
import { ClientModule } from './modules/client/client.module';
import { PlatformAdministratorModule } from './modules/management/platform-administrator.module';
import { SuscriptionModule } from './modules/suscription/suscription.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { UserModule } from './modules/user/user.module';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { LoggerOptions } from '../config/logger/Winston.Config.Service';
import { AuthModule } from './modules/auth/auth.module';
import { MailsModule } from './modules/mails/mails.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env.' + process.env.NODE_ENV,
      load: [configuration],
    }),
    ExampleModule,
    BankAccountModule,
    ClientModule,
    PlatformAdministratorModule,
    SuscriptionModule,
    TransactionModule,
    UserModule,
    AuthModule,
    MailsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: PostgreExceptionFilter,
    },
  ],
})
export class AppModule {}
