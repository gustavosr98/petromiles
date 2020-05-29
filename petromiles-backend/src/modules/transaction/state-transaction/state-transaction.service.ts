import { Injectable, Inject } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';

import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

// SERVICES
import { StateService } from '@/modules/management/state/state.service';

// ENTITIES
import { StateTransaction } from './state-transaction.entity';
import { Transaction } from '../transaction/transaction.entity';

// INTERFACES
import { ApiModules } from '@/logger/api-modules.enum';
import { StateName } from '@/modules/management/state/state.enum';

@Injectable()
export class StateTransactionService {
  constructor(
    private stateService: StateService,
    @InjectRepository(StateTransaction)
    private repository: Repository<StateTransaction>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

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

  async update(stateName: StateName, transaction: Transaction, description?) {
    await this.endLastState(transaction);

    const newState = new StateTransaction();
    newState.transaction = transaction;
    newState.description = description;
    newState.state = await this.stateService.getState(stateName);

    this.logger.silly(
      `[${ApiModules.TRANSACTION}] ID: ${transaction.idTransaction} updated to state: (${stateName})`,
    );

    return await this.repository.save(newState);
  }

  private async endLastState(transaction: Transaction) {
    let currentState = await this.repository.findOne({
      transaction,
      finalDate: null,
    });
    if (!!currentState) {
      currentState.finalDate = new Date();
      await this.repository.save(currentState);
    }
  }
}
