import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository, getConnection } from 'typeorm';

// ENTITIES
import { Language } from '@/entities/language.entity';
import { State } from '@/entities/state.entity';
import { Role } from '@/entities/role.entity';
import { StateUser } from '@/entities/state-user.entity';
import { UserClient } from '@/entities/user-client.entity';
import { Suscription } from '@/entities/suscription.entity';
import { UserAdministrator } from '@/entities/user-administrator.entity';
import { Country } from '@/entities/country.entity';
import { Bank } from '@/entities/bank.entity';

// INTERFACES
import { StateName } from '@/enums/state.enum';
import { Role as RoleEnum } from '@/enums/role.enum';
import { UpdateSubscriptionDTO } from '@/modules/suscription/dto/update-subscription.dto';

@Injectable()
export class ManagementService {
  constructor(
    @InjectRepository(Language)
    private languageRepository: Repository<Language>,
    @InjectRepository(State)
    private stateRepository: Repository<State>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Country)
    private countryRepository: Repository<Country>,
    @InjectRepository(UserClient)
    private userClientRepository: Repository<UserClient>,
    @InjectRepository(StateUser)
    private stateUserRepository: Repository<StateUser>,
    @InjectRepository(Bank)
    private bankRepository: Repository<Bank>,
  ) {}

  async getLanguages(): Promise<Language[]> {
    return await this.languageRepository.find();
  }

  async getLanguage(name: string): Promise<Language> {
    return await this.languageRepository.findOne({ name });
  }

  async getCountries(): Promise<Country[]> {
    return await this.countryRepository.find();
  }

  async getState(name: StateName): Promise<State> {
    return await this.stateRepository.findOne({ name });
  }

  async getRoleByName(name: RoleEnum): Promise<Role> {
    return await this.roleRepository.findOne({ name });
  }

  async getBanks(): Promise<Bank[]> {
    return await this.bankRepository.find();
  }

  async updateSubscriptionConditions(
    idSuscription: number,
    updateSubscriptionDTO: UpdateSubscriptionDTO,
  ) {
    return await getConnection()
      .createQueryBuilder()
      .update(Suscription)
      .set({ ...updateSubscriptionDTO })
      .where('idSuscription = :idSuscription', { idSuscription })
      .execute();
  }

  async updateUserState(
    role: RoleEnum,
    state: StateName,
    id: number,
    adminId: UserAdministrator,
  ): Promise<StateUser> {
    const roleName = await this.roleRepository
      .createQueryBuilder('role')
      .where('role.name = :role', { role: role })
      .getOne();

    let userId, stateus;
    if (roleName.isClient()) {
      userId = await this.userClientRepository.findOne(id);
      stateus = await this.stateUserRepository.findOne({
        where: [{ userClient: userId.idUserClient, finalDate: null }],
      });
    }
    if (roleName.isAdministrator()) {
      stateus = await this.stateUserRepository.findOne({
        where: [{ userClient: adminId, finalDate: null }],
      });
    }

    if (stateus.userAdministrator === adminId) {
      throw new BadRequestException('Cannot change your state');
    }

    await this.updateLastState(stateus);

    const newState = new StateUser();
    newState.initialDate = new Date();
    newState.state = await this.getState(state);
    if (roleName.isClient()) {
      newState.userClient = userId;
    } else if (roleName.isAdministrator()) {
      newState.userAdministrator = adminId;
    }

    return await this.stateUserRepository.save(newState);
  }

  async updateLastState(state: StateUser): Promise<StateUser> {
    state.finalDate = new Date();
    return await this.stateUserRepository.save(state);
  }
}
