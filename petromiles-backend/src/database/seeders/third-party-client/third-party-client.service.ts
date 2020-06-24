import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository, InsertResult } from 'typeorm';

import { ThirdPartyClient } from '@/entities/third-party-client.entity';

import { THIRD_PARTY_CLIENT } from '@/database/seeders/third-party-client/third-party-client.data.ts';

@Injectable()
export class ThirdPartyClientSeederService {
  constructor(
    @InjectRepository(ThirdPartyClient)
    private readonly thirdPartyClientRepository: Repository<ThirdPartyClient>,
  ) {}

  createThirdPartyClient(): Promise<InsertResult>[] {
    return THIRD_PARTY_CLIENT.map(thirdPartyClient =>
      this.thirdPartyClientRepository.insert(thirdPartyClient),
    );
  }
}
