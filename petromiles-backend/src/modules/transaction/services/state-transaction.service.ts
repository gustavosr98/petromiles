import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';

import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

// SERVICES
import { ManagementService } from '@/modules/management/services/management.service';

// ENTITIES
import { StateTransaction } from '@/entities/state-transaction.entity';
import { Transaction } from '@/entities/transaction.entity';

// INTERFACES
import { ApiModules } from '@/logger/api-modules.enum';
import { StateName } from '@/enums/state.enum';

@Injectable()
export class StateTransactionService {
  constructor(
    @InjectRepository(StateTransaction)
    private repository: Repository<StateTransaction>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private managementService: ManagementService,
  ) {}

  async createStateTransaction(
    transaction: Transaction,
    description: string,
    stateName: StateName,
  ): Promise<StateTransaction> {
    const stateTransaction = new StateTransaction();
    stateTransaction.transaction = transaction;
    stateTransaction.description = description;
    stateTransaction.state = await this.managementService.getState(stateName);

    return await getConnection()
      .getRepository(StateTransaction)
      .save(stateTransaction);
  }

  async update(
    stateName: StateName,
    transaction: Transaction,
    description?: string,
  ) {
    await this.endLastState(transaction);

    const newState = new StateTransaction();
    newState.transaction = transaction;
    newState.description = description;
    newState.state = await this.managementService.getState(stateName);

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
