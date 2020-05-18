import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

import { getConnection, Repository } from 'typeorm';

import { StateUser } from '../state-user/state-user.entity';
import { State } from '../../management/state/state.entity';
import { StateName } from 'src/modules/management/state/state.enum';
import { UserAdministrator } from './user-administrator.entity';

@Injectable()
export class UserAdministratorService {
  constructor(
    @InjectRepository(UserAdministrator)
    private userAdministratorRepository: Repository<UserAdministrator>,
  ) {}

  async findAll() {
    return await this.userAdministratorRepository.find({
      relations: ['stateUser', 'userDetails', 'userRole'],
    });
  }

  async getActiveAdministrator(email: string): Promise<UserAdministrator> {
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
}
