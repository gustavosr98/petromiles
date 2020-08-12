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
    console.log(pointsConversionId + ' ' + onePointEqualsDollars + ' pointsdConv y onepoin');
    const lastConversion = await this.endLast(pointsConversionId);
    const conversion = await this.pointsConversionRepository.save({
      onePointEqualsDollars,
    });
    console.log(JSON.stringify(lastConversion) + ' lasConv')
    console.log(JSON.stringify(conversion)+ ' conversion')

    const amount = conversion.onePointEqualsDollars;
    const last = lastConversion.onePointEqualsDollars;
    const log = `One point equals to = Last: [${last} $] ; New: [${amount} $] `;

    this.logger.warn(
      `[${ApiModules.MANAGEMENT}] Points conversion updated | ${log}`,
    );
    console.log(JSON.stringify(conversion) + ' conversion return');
    return conversion;
  }

  async endLast(idPointsConversion: number): Promise<PointsConversion> {
    console.log(JSON.stringify(idPointsConversion)+ 'idPointsConversion');
    const currentPointsConversion = await this.pointsConversionRepository.findOne(
      idPointsConversion,
    );
    console.log(JSON.stringify(currentPointsConversion)+ ' currentPoint');
    currentPointsConversion.finalDate = new Date();
    console.log(this.pointsConversionRepository.save(currentPointsConversion))
    return await this.pointsConversionRepository.save(currentPointsConversion);
  }
}
