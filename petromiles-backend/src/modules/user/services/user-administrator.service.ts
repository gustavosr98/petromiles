import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

import { getConnection, Repository } from 'typeorm';

// ENTITIES
import { StateUser } from '@/entities/state-user.entity';
import { State } from '@/entities/state.entity';
import { UserAdministrator } from '@/entities/user-administrator.entity';
import { UserDetails } from '@/entities/user-details.entity';

// INTERFACES
import { StateName } from '@/enums/state.enum';

@Injectable()
export class UserAdministratorService {
  constructor(
    @InjectRepository(UserAdministrator)
    private userAdministratorRepository: Repository<UserAdministrator>,
    @InjectRepository(UserDetails)
    private userDetailsRepository: Repository<UserDetails>,
  ) {}

  async findAll(): Promise<UserAdministrator[]> {
    return await this.userAdministratorRepository.find({
      relations: ['stateUser', 'userDetails', 'userRole'],
    });
  }

  async getActive(email: string): Promise<UserAdministrator> {
    return await getConnection()
      .createQueryBuilder()
      .select('admin')
      .from(UserAdministrator, 'admin')
      .innerJoin(
        StateUser,
        'state_user',
        'state_user.fk_user_administrator = admin."idUserAdministrator"',
      )
      .innerJoin(State, 'state', 'state."idState" = state_user.fk_state')
      .where(`admin.email = '${email}'`)
      .andWhere(`state.name = '${StateName.ACTIVE}'`)
      .andWhere('state_user."finalDate" is null')
      .getOne();
  }

  async getDetails(userAdministrator: UserAdministrator): Promise<UserDetails> {
    if (userAdministrator)
      return await this.userDetailsRepository.findOne({
        where: {
          fk_user_client: userAdministrator.idUserAdministrator,
        },
      });

    return null;
  }
}
