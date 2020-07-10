import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository, InsertResult } from 'typeorm';

import { PLATAFORM_INTERESTS } from './platform-interest.data';

import { PlatformInterest } from '@/entities/platform-interest.entity';
import { Suscription } from '@/entities/suscription.entity';

@Injectable()
export class PlatformInterestSeederService {
  constructor(
    @InjectRepository(PlatformInterest)
    private readonly platformInterestRepository: Repository<PlatformInterest>,
    @InjectRepository(Suscription)
    private readonly subscriptionRepository: Repository<Suscription>,
  ) {}

  createPlatformInterest(): Promise<PlatformInterest>[] {
    return PLATAFORM_INTERESTS.map(async platformInterest => {
      const subscription = await this.subscriptionRepository.findOne({
        name: platformInterest.name.toUpperCase(),
      });

      return this.platformInterestRepository
        .create({
          ...platformInterest,
          suscription: subscription ? subscription : null,
        })
        .save();
    });
  }
}
