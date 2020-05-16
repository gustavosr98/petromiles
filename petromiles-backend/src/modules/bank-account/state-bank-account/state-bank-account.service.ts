import { Injectable, Inject } from '@nestjs/common';

import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { StateBankAccount } from './state-bank-account.entity';
import { getConnection } from 'typeorm';
import { StateService } from '../../management/state/state.service';
import { ClientBankAccount } from '../../client/client-bank-account/client-bank-account.entity';
import { StateName } from '../../management/state/state.enum';

@Injectable()
export class StateBankAccountService {
  constructor(
    private stateService: StateService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async createStateBankAccount(
    stateName: StateName,
    clientBankAccount: ClientBankAccount,
    description,
  ) {
    const state = await this.stateService.getState(stateName);
    const stateBankAccount = new StateBankAccount();
    stateBankAccount.clientbankAccount = clientBankAccount;
    stateBankAccount.description = description;
    stateBankAccount.state = state;

    this.logger.silly(
      `[BANK_ACCOUNT] State of the bank account ID: ${clientBankAccount.bankAccount.idBankAccount} is ${stateName}`,
    );
    return await getConnection()
      .getRepository(StateBankAccount)
      .save(stateBankAccount);
  }
}
