import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository, getConnection } from 'typeorm';

import { Language } from '../user/language/language.entity';
import { UpdateSubscriptionDTO } from './dto/update-subscription.dto';
import { Suscription } from '../suscription/suscription/suscription.entity';
import { PlatformInterest } from 'src/modules/management/platform-interest/platform-interest.entity';
import { CreatePlatformInterestDTO } from './dto/create-platform-interest.dto';
import { PointsConversion } from './points-conversion/points-conversion.entity';
import { ThirdPartyInterest } from './third-party-interest/third-party-interest.entity';
import { CreateThirdPartyInterestDTO } from './dto/create-third-party-interest.dto';

@Injectable()
export class ManagementService {
  private connection = getConnection();
  constructor(
    @InjectRepository(Language)
    private languageRepository: Repository<Language>,
  ) {}

  async getLanguages(): Promise<Language[]> {
    return await this.languageRepository.find();
  }

  async getThirdPartyInterests(): Promise<ThirdPartyInterest[]> {
    return await this.connection
      .getRepository(ThirdPartyInterest)
      .find({ finalDate: null });
  }

  // Subscription
  async updateSubscriptionConditions(
    idSuscription,
    updateSubscriptionDTO: UpdateSubscriptionDTO,
  ) {
    return await this.connection
      .createQueryBuilder()
      .update(Suscription)
      .set({ ...updateSubscriptionDTO })
      .where('idSuscription = :idSuscription', { idSuscription })
      .execute();
  }

  // Platform Interest
  async updatePlatformInterest(
    currentPlatformInterestId,
    createPlatformInterest: CreatePlatformInterestDTO,
  ) {
    await this.endLastPlatformInterest(currentPlatformInterestId);
    return this.connection
      .getRepository(PlatformInterest)
      .save(createPlatformInterest);
  }

  async endLastPlatformInterest(idPlatformInterest: number) {
    const platformInterestRepository = this.connection.getRepository(
      PlatformInterest,
    );
    const currentPlatformInterest = await platformInterestRepository.findOne({
      idPlatformInterest,
    });
    currentPlatformInterest.finalDate = new Date();

    await platformInterestRepository.save(currentPlatformInterest);
  }

  // Points conversion
  async updatePointsConversion(
    pointsConversionId: number,
    onePointEqualsDollars: number,
  ) {
    await this.endLastPointsConversion(pointsConversionId);
    return this.connection
      .getRepository(PointsConversion)
      .save({ onePointEqualsDollars });
  }

  async endLastPointsConversion(idPointsConversion: number) {
    const pointsConversionRepository = this.connection.getRepository(
      PointsConversion,
    );
    const currentPointsConversion = await pointsConversionRepository.findOne(
      idPointsConversion,
    );
    currentPointsConversion.finalDate = new Date();

    await pointsConversionRepository.save(currentPointsConversion);
  }

  // Third Party Interest
  async updateThirdPartyInterest(
    thirdPartyInterestId: number,
    createThirdPartyInterestDTO: CreateThirdPartyInterestDTO,
  ) {
    await this.endLastThirdPartyInterest(thirdPartyInterestId);
    return this.connection
      .getRepository(ThirdPartyInterest)
      .save(createThirdPartyInterestDTO);
  }

  async endLastThirdPartyInterest(idThirdPartyInterest: number) {
    const thirdPartyInterestRepository = this.connection.getRepository(
      ThirdPartyInterest,
    );
    const currentThirdPartyInterest = await thirdPartyInterestRepository.findOne(
      idThirdPartyInterest,
    );
    currentThirdPartyInterest.finalDate = new Date();

    await thirdPartyInterestRepository.save(currentThirdPartyInterest);
  }
}
