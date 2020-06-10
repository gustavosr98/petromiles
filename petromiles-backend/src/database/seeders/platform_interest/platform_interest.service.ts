import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository, InsertResult } from 'typeorm';

import { PLATAFORM_INTERESTS } from './platform_interest.data';
import { PlatformInterest } from '../../../entities/platform-interest.entity';

@Injectable()
export class PlatformInterestSeederService {
  constructor(
    @InjectRepository(PlatformInterest)
    private readonly platformInterestRepository: Repository<PlatformInterest>,
  ) {}

  createPlatformInterest(): Promise<InsertResult>[] {
    return PLATAFORM_INTERESTS.map(platformInterest =>
      this.platformInterestRepository.insert(platformInterest),
    );
  }
}
