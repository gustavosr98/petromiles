import { Injectable, Inject } from '@nestjs/common';

import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { StateBankAccount } from './state-bank-account.entity';
import { getConnection } from 'typeorm';
import { StateService } from '../../management/state/state.service';
import { ClientBankAccount } from '../client-bank-account/client-bank-account.entity';
import { StateName } from '../../management/state/state.enum';
import { ApiModules } from '@/logger/api-modules.enum';

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
    if (clientBankAccount.stateBankAccount)
      await this.changeCurrentState(clientBankAccount);

    const state = await this.stateService.getState(stateName);
    const stateBankAccount = new StateBankAccount();
    stateBankAccount.clientBankAccount = clientBankAccount;
    stateBankAccount.description = description;
    stateBankAccount.state = state;

    this.logger.silly(
      `[${ApiModules.BANK_ACCOUNT}] New state:  (${stateName})`,
    );
    return await getConnection()
      .getRepository(StateBankAccount)
      .save(stateBankAccount);
  }

  async changeCurrentState(clientBankAccount: ClientBankAccount) {
    const stateBankAccountRepository = await getConnection().getRepository(
      StateBankAccount,
    );
    const currentStateBankAccount = await stateBankAccountRepository.findOne({
      clientBankAccount,
      finalDate: null,
    });

    currentStateBankAccount.finalDate = new Date();
    await stateBankAccountRepository.save(currentStateBankAccount);
  }
}
