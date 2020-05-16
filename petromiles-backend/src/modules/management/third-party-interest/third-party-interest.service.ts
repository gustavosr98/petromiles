import { Injectable } from '@nestjs/common';
import { ThirdPartyInterest as ThirdPartyInterestEnum } from './third-party-interest.enum';
import { ThirdPartyInterest } from './third-party-interest.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ThirdPartyInterestService {
  constructor(
    @InjectRepository(ThirdPartyInterest)
    private thirdPartyInterestRepository: Repository<ThirdPartyInterest>,
  ) {}

  async getThirdPartyInterest(
    paymentProvider: ThirdPartyInterestEnum,
  ): Promise<ThirdPartyInterest> {
    return await this.thirdPartyInterestRepository.findOne({
      paymentProvider,
      finalDate: null,
    });
  }
}
