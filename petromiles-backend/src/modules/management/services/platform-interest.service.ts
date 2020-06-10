import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// ENTITIES
import { PlatformInterest } from '@/entities/platform-interest.entity';

// INTERFACES
import { CreatePlatformInterestDTO } from '../dto/create-platform-interest.dto';
import { PlatformInterest as PlatformInterestEnum } from '../../../enums/platform-interest.enum';

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

  async update(
    currentPlatformInterestId,
    createPlatformInterest: CreatePlatformInterestDTO,
  ) {
    await this.endLast(currentPlatformInterestId);
    return await this.platformInterestRepository.save(createPlatformInterest);
  }

  async endLast(idPlatformInterest: number) {
    const currentPlatformInterest = await this.platformInterestRepository.findOne(
      { idPlatformInterest },
    );
    currentPlatformInterest.finalDate = new Date();

    await this.platformInterestRepository.save(currentPlatformInterest);
  }
}
