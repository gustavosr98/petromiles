import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PointsConversion } from './points-conversion.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PointsConversionService {
  constructor(
    @InjectRepository(PointsConversion)
    private pointsConversionRepository: Repository<PointsConversion>,
  ) {}
  async getRecentPointsConversion(): Promise<PointsConversion> {
    return await this.pointsConversionRepository.findOne({ finalDate: null });
  }
}
