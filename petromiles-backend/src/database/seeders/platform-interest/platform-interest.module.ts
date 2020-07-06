import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PlatformInterestSeederService } from '@/database/seeders/platform-interest/platform-interest.service';

import { PlatformInterest } from '@/entities/platform-interest.entity';
import { Suscription } from '@/entities/suscription.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PlatformInterest, Suscription])],
  providers: [PlatformInterestSeederService],
  exports: [PlatformInterestSeederService],
})
export class PlatformInterestSeederModule {}
