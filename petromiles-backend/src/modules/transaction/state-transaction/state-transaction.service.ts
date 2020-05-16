import { Injectable } from '@nestjs/common';

import { getConnection } from 'typeorm';

import { Transaction } from '../transaction/transaction.entity';
import { StateName } from '../../management/state/state.enum';
import { StateTransaction } from './state-transaction.entity';
import { StateService } from '../../management/state/state.service';

@Injectable()
export class StateTransactionService {
  constructor(private stateService: StateService) {}

  async createStateTransaction(
    transaction: Transaction,
    description: string,
    stateName: StateName,
  ): Promise<StateTransaction> {
    const stateTransaction = new StateTransaction();
    stateTransaction.transaction = transaction;
    stateTransaction.description = description;
    stateTransaction.state = await this.stateService.getState(stateName);

    return await getConnection()
      .getRepository(StateTransaction)
      .save(stateTransaction);
  }
}
