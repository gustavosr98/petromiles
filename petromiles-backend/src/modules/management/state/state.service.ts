import { Injectable } from '@nestjs/common';
import { State } from './state.entity';
import { StateName } from './state.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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
