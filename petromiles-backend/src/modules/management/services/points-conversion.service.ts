import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

// ENTITIES
import { PointsConversion } from '@/entities/points-conversion.entity';
import { ApiModules } from '@/logger/api-modules.enum';

@Injectable()
export class PointsConversionService {
  constructor(
    @InjectRepository(PointsConversion)
    private pointsConversionRepository: Repository<PointsConversion>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}
  async getRecentPointsConversion(): Promise<PointsConversion> {
    return await this.pointsConversionRepository.findOne({ finalDate: null });
  }

  async update(
    pointsConversionId: number,
    onePointEqualsDollars: number,
  ): Promise<PointsConversion> {
    const lastConversion = await this.endLast(pointsConversionId);
    const conversion = await this.pointsConversionRepository.save({
      onePointEqualsDollars,
    });

    const amount = conversion.onePointEqualsDollars;
    const last = lastConversion.onePointEqualsDollars;
    const log = `One point equals to = Last: [${last} $] ; New: [${amount} $] `;

    this.logger.warn(
      `[${ApiModules.MANAGEMENT}] Points conversion updated | ${log}`,
    );
    return conversion;
  }

  async endLast(idPointsConversion: number): Promise<PointsConversion> {
    const currentPointsConversion = await this.pointsConversionRepository.findOne(
      idPointsConversion,
    );
    currentPointsConversion.finalDate = new Date();

    return await this.pointsConversionRepository.save(currentPointsConversion);
  }
}
