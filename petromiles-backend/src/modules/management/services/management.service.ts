import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository, getConnection } from 'typeorm';

// ENTITIES
import { Language } from '@/entities/language.entity';
import { State } from '@/entities/state.entity';
import { Role } from '@/entities/role.entity';

// INTERFACES
import { StateName } from '@/enums/state.enum';
import { Role as RoleEnum } from '@/enums/role.enum';
import { UpdateSubscriptionDTO } from '../../suscription/dto/update-subscription.dto';
import { Suscription } from '../../../entities/suscription.entity';

@Injectable()
export class ManagementService {
  constructor(
    @InjectRepository(Language)
    private languageRepository: Repository<Language>,
    @InjectRepository(State)
    private stateRepository: Repository<State>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async getLanguages(): Promise<Language[]> {
    return await this.languageRepository.find();
  }

  async getLanguage(name: string): Promise<Language> {
    return await this.languageRepository.findOne({ name });
  }

  async getState(name: StateName): Promise<State> {
    return await this.stateRepository.findOne({ name });
  }

  async getRoleByName(name: RoleEnum): Promise<Role> {
    return await this.roleRepository.findOne({ name });
  }

  async updateSubscriptionConditions(
    idSuscription,
    updateSubscriptionDTO: UpdateSubscriptionDTO,
  ) {
    return await getConnection()
      .createQueryBuilder()
      .update(Suscription)
      .set({ ...updateSubscriptionDTO })
      .where('idSuscription = :idSuscription', { idSuscription })
      .execute();
  }
}
