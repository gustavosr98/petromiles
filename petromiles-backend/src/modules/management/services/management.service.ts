import {BadRequestException, Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository, getConnection } from 'typeorm';

// ENTITIES
import { Language } from '@/entities/language.entity';
import { State } from '@/entities/state.entity';
import { Role } from '@/entities/role.entity';
import {StateUser} from "@/entities/state-user.entity";
import {UserClient} from "@/entities/user-client.entity";
import { Suscription } from '../../../entities/suscription.entity';

// INTERFACES
import { StateName } from '@/enums/state.enum';
import { Role as RoleEnum } from '@/enums/role.enum';
import { UpdateSubscriptionDTO } from '../../suscription/dto/update-subscription.dto';


@Injectable()
export class ManagementService {
  constructor(
    @InjectRepository(Language)
    private languageRepository: Repository<Language>,
    @InjectRepository(State)
    private stateRepository: Repository<State>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(UserClient)
    private userClientRepository: Repository<UserClient>,
    @InjectRepository(StateUser)
    private stateUserRepository: Repository<StateUser>,
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

  async updateUserState(state: StateName, id: number): Promise<StateUser>{

    const userId = await this.userClientRepository.findOne(id);
    if (userId.idUserClient === null){
      throw new BadRequestException('Cannot change the state to an administrator');
    }
    const stateus = await this.stateUserRepository.findOne({where: [{userClient: userId.idUserClient, finalDate: null}]});

    await this.updateLastState(stateus);

    const newState = new StateUser();
    newState.initialDate = new Date();
    newState.state = await this.getState(state)
    newState.userClient = userId;
    return await getConnection()
        .getRepository(StateUser)
        .save(newState);
  }

  async updateLastState(state: StateUser): Promise<StateUser>{
    state.finalDate = new Date();
    return await getConnection()
        .getRepository(StateUser)
        .save(state)
  }
}
