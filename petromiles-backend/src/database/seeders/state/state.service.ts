import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository, InsertResult } from 'typeorm';

import { STATES } from './state.data';
import { State } from '../../../modules/management/state/state.entity';

@Injectable()
export class StateSeederService {
  constructor(
    @InjectRepository(State)
    private readonly stateRepository: Repository<State>,
  ) {}

  createState(): Promise<InsertResult>[] {
    return STATES.map(state => this.stateRepository.insert(state));
  }
}
