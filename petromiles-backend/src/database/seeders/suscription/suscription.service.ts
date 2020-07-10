import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository, InsertResult } from 'typeorm';

import { SUSCRIPTIONS } from './suscription.data';
import { Suscription } from '../../../entities/suscription.entity';

@Injectable()
export class SuscriptionSeederService {
  constructor(
    @InjectRepository(Suscription)
    private readonly suscriptionRepository: Repository<Suscription>,
  ) {}

  createSuscription(): Promise<InsertResult>[] {
    return SUSCRIPTIONS.map(suscription =>
      this.suscriptionRepository.insert(suscription),
    );
  }
}
