import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PointsConversionSeederService } from './points_conversion.service';
import { PointsConversion } from '../../../entities/points-conversion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PointsConversion])],
  providers: [PointsConversionSeederService],
  exports: [PointsConversionSeederService],
})
export class PointsConversionSeederModule {}
