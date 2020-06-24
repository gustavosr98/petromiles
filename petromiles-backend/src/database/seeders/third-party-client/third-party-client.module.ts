import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ThirdPartyClient } from '@/entities/third-party-client.entity';

import { ThirdPartyClientSeederService } from '@/database/seeders/third-party-client/third-party-client.service.ts';

@Module({
  imports: [TypeOrmModule.forFeature([ThirdPartyClient])],
  providers: [ThirdPartyClientSeederService],
  exports: [ThirdPartyClientSeederService],
})
export class ThirdPartyClientSeederModule {}
