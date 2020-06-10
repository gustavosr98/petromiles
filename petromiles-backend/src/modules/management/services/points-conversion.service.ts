import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// ENTITIES
import { PointsConversion } from '@/entities/points-conversion.entity';

@Injectable()
export class PointsConversionService {
  constructor(
    @InjectRepository(PointsConversion)
    private pointsConversionRepository: Repository<PointsConversion>,
  ) {}
  async getRecentPointsConversion(): Promise<PointsConversion> {
    return await this.pointsConversionRepository.findOne({ finalDate: null });
  }

  async update(pointsConversionId: number, onePointEqualsDollars: number) {
    await this.endLast(pointsConversionId);
    return await this.pointsConversionRepository.save({
      onePointEqualsDollars,
    });
  }

  async endLast(idPointsConversion: number) {
    const currentPointsConversion = await this.pointsConversionRepository.findOne(
      idPointsConversion,
    );
    currentPointsConversion.finalDate = new Date();

    await this.pointsConversionRepository.save(currentPointsConversion);
  }
}
