import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository, InsertResult } from 'typeorm';

import { PointsConversion } from '../../../modules/management/points_conversion/points_conversion.entity';
import { POINTS_CONVERSION } from './points_conversion.data';

@Injectable()
export class PointsConversionSeederService {
  constructor(
    @InjectRepository(PointsConversion)
    private readonly PointsConversionRepository: Repository<PointsConversion>,
  ) {}

  createPointsConversion(): Promise<InsertResult>[] {
    return POINTS_CONVERSION.map(pointsConversion =>
      this.PointsConversionRepository.insert(pointsConversion),
    );
  }
}
