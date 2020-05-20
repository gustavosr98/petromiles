import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { State } from './state.entity';
import { StateName } from './state.enum';

@Injectable()
export class StateService {
  constructor(
    @InjectRepository(State)
    private stateRepository: Repository<State>,
  ) {}

  async getState(name: StateName): Promise<State> {
    return await this.stateRepository.findOne({ name });
  }
}
