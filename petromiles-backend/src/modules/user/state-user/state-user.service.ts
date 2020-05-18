import { Injectable } from '@nestjs/common';
import { getConnection } from 'typeorm';

import { StateUser } from './state-user.entity';
import { StateService } from '../../management/state/state.service';
import { UserClient } from '../user-client/user-client.entity';
import { StateName } from '../../management/state/state.enum';

@Injectable()
export class StateUserService {
  private connection = getConnection();

  constructor(private stateService: StateService) {}

  async createClientState(
    user: UserClient,
    stateName: StateName,
    description: string,
  ): Promise<StateUser> {
    const userState = new StateUser();
    userState.userClient = user;
    userState.initialDate = new Date();
    userState.description = description;
    userState.state = await this.stateService.getState(stateName);

    return await this.connection.manager.save(userState);
  }
}
