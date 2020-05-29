import { Injectable } from '@nestjs/common';
import { PlatformInterest as PlatformInterestEnum } from './platform-interest.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { PlatformInterest } from './platform-interest.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PlatformInterestService {
  constructor(
    @InjectRepository(PlatformInterest)
    private platformInterestRepository: Repository<PlatformInterest>,
  ) {}
  async getInterestByName(
    name: PlatformInterestEnum,
  ): Promise<PlatformInterest> {
    return await this.platformInterestRepository.findOne({
      name,
      finalDate: null,
    });
  }

  async getInterests(): Promise<PlatformInterest[]> {
    return await this.platformInterestRepository.find({
      finalDate: null,
    });
  }
}
