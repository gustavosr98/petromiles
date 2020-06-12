import {BadRequestException, Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {Repository, getConnection, getManager} from 'typeorm';

// ENTITIES
import { Language } from '@/entities/language.entity';
import { State } from '@/entities/state.entity';
import { Role } from '@/entities/role.entity';
import {StateUser} from "@/entities/state-user.entity";
import {UserClient} from "@/entities/user-client.entity";
import { Suscription } from '../../../entities/suscription.entity';
import {UserAdministrator} from "@/entities/user-administrator.entity";
import {UserRole} from "@/entities/user-role.entity";

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
    @InjectRepository(UserAdministrator)
    private userAdministratorRepository: Repository<UserAdministrator>,
    @InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>,
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

  async updateUserState(state: StateName, id: number, adminId: UserAdministrator): Promise<StateUser>{

    const roleName = await this.roleRepository
        .createQueryBuilder('role')
        .innerJoin('user_role', 'ur','ur.fk_role= role."idRole"')
        .where('ur.fk_user_client= :id', {id: id})
        .orWhere('ur.fk_user_administrator= :id',{id: id})
        .getOne()

    let userId,stateus,admin
    if(roleName.name === 'CLIENT'){
       userId = await this.userClientRepository.findOne(id);
       stateus = await this.stateUserRepository.findOne({where: [{userClient: userId.idUserClient, finalDate: null}]});
    }
    if(roleName.name === 'ADMINISTRATOR'){
       stateus = await this.stateUserRepository.findOne({where: [{userClient: adminId, finalDate: null}]});
    }

    if (stateus.userAdministrator === adminId){
      throw new BadRequestException('Cannot change your state');
    }

    await this.updateLastState(stateus);

    const newState = new StateUser();
    newState.initialDate = new Date();
    newState.state = await this.getState(state)
    if(roleName.name === 'CLIENT'){
      newState.userClient = userId;
    }else if(roleName.name === 'ADMINISTRATOR'){
      newState.userAdministrator = adminId
    }

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
