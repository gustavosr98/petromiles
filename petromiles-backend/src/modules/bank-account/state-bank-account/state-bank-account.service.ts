import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { StateBankAccount } from './state-bank-account.entity';
import { getConnection, Repository } from 'typeorm';
import { StateService } from '../../management/state/state.service';
import { ClientBankAccount } from '../client-bank-account/client-bank-account.entity';
import { StateName } from '../../management/state/state.enum';
import { ApiModules } from '@/logger/api-modules.enum';

@Injectable()
export class StateBankAccountService {
  constructor(
    private stateService: StateService,
    @InjectRepository(StateBankAccount)
    private stateBankAccountRepository: Repository<StateBankAccount>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async updateStateBankAccount(
    stateName: StateName,
    clientBankAccount: ClientBankAccount,
    description?,
  ) {
    if (clientBankAccount.stateBankAccount)
      await this.endLastState(clientBankAccount);

    const stateBankAccount = new StateBankAccount();
    stateBankAccount.clientBankAccount = clientBankAccount;
    stateBankAccount.description = description;
    stateBankAccount.state = await this.stateService.getState(stateName);

    this.logger.silly(
      `[${ApiModules.BANK_ACCOUNT}] New state:  (${stateName})`,
    );
    return await getConnection()
      .getRepository(StateBankAccount)
      .save(stateBankAccount);
  }

  async endLastState(clientBankAccount: ClientBankAccount) {
    const currentStateBankAccount = await this.stateBankAccountRepository.findOne(
      {
        clientBankAccount,
        finalDate: null,
      },
    );

    currentStateBankAccount.finalDate = new Date();
    await this.stateBankAccountRepository.save(currentStateBankAccount);
  }
}
