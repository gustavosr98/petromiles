import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlatformInterestSeederService } from './platform_interest.service';
import { PlatformInterest } from '../../../modules/management/platform-interest/platform-interest.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PlatformInterest])],
  providers: [PlatformInterestSeederService],
  exports: [PlatformInterestSeederService],
})
export class PlatformInterestSeederModule {}
