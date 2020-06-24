import { Module } from '@nestjs/common';

// CONTROLLERS
import { ThirdPartyClientsController } from '@/modules/third-party-clients/controllers/third-party-clients.controller';

// SERVICES
import { ThirdPartyClientsService } from '@/modules/third-party-clients/services/third-party-clients.service';

@Module({
  controllers: [ThirdPartyClientsController],
  providers: [ThirdPartyClientsService],
})
export class ThirdPartyClientsModule {}
