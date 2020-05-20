import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { BankAccountService } from '../bank-account.service';
import { ClientBankAccount } from './client-bank-account.entity';
import { StateBankAccountService } from '../state-bank-account/state-bank-account.service';
import {
  StateName,
  StateDescription,
} from 'src/modules/management/state/state.enum';
import { UserClientService } from '../../user/user-client/user-client.service';
import { TransactionService } from '../../transaction/transaction.service';

@Injectable()
export class ClientBankAccountService {
  constructor(
    private bankAccountService: BankAccountService,
    @InjectRepository(ClientBankAccount)
    private clientBankAccountRepository: Repository<ClientBankAccount>,
    private stateBankAccountService: StateBankAccountService,
    private userClientService: UserClientService,
    private transactionService: TransactionService,
  ) {}

  async createClientBankAccount(email, account): Promise<ClientBankAccount> {
    const bankAccount = await this.bankAccountService.createBankAccount({
      ...account,
    });

    const userClient = await this.userClientService.getActiveClient(email);

    const clientBankAccount = await this.clientBankAccountRepository
      .create({
        bankAccount,
        userClient,
      })
      .save();

    await this.stateBankAccountService.createStateBankAccount(
      StateName.VERIFYING,
      clientBankAccount,
      StateDescription.NEWLY_CREATED_ACCOUNT,
    );

    await this.transactionService.createVerificationTransaction(
      clientBankAccount,
    );

    return clientBankAccount;
  }
}
