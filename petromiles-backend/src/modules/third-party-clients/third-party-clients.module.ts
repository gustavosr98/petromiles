import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// ENTITIES
import { ThirdPartyClient } from '@/entities/third-party-client.entity';
import { UserClient } from '@/entities/user-client.entity';
import { ClientOnThirdParty } from '@/entities/client-on-third-party.entity';

// MODULES
import { PaymentsModule } from '@/modules/payments/payments.module';
import { ManagementModule } from '@/modules/management/management.module';
import { MailsModule } from '@/modules/mails/mails.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { UserModule } from '@/modules/user/user.module';
import { TransactionModule } from '@/modules/transaction/transaction.module';

// CONTROLLERS
import { ThirdPartyClientsController } from '@/modules/third-party-clients/controllers/third-party-clients.controller';

// SERVICES
import { ThirdPartyClientsService } from '@/modules/third-party-clients/services/third-party-clients.service';
import { CsvService } from '@/modules/third-party-clients/services/csv.service';

// PROVIDERS
import { CsvToJsonProvider } from '@/modules/third-party-clients/providers/csv-to-json.provider';
import { ThirdPartyAdministrationController } from './controllers/third-party-administration.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ThirdPartyClient,
      UserClient,
      ClientOnThirdParty,
      ThirdPartyClient,
    ]),
    MailsModule,
    AuthModule,
    ManagementModule,
    PaymentsModule,
    TransactionModule,
    UserModule,
  ],
  controllers: [
    ThirdPartyClientsController,
    ThirdPartyAdministrationController,
  ],
  providers: [ThirdPartyClientsService, CsvToJsonProvider, CsvService],
})
export class ThirdPartyClientsModule {}
