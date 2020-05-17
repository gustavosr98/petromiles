import { Injectable } from '@nestjs/common';
import { getConnection } from 'typeorm';
import { ClientBankAccount } from '../client/client-bank-account/client-bank-account.entity';
import { BankAccount } from '../bank-account/bank-account/bank-account.entity';

@Injectable()
export class ExampleService {
  async example() {
    const accounts = await getConnection()
      .getRepository(ClientBankAccount)
      .find({
        join: {
          alias: 'clientBankAccount',
          innerJoinAndSelect: {
            bankAccount: 'clientBankAccount.bankAccount',
          },
        },
      });
    console.log('Direct relationship');
    console.log(accounts);

    const clientBankAccount = await getConnection()
      .getRepository(BankAccount)
      .find({
        join: {
          alias: 'bankAccount',
          innerJoinAndSelect: {
            clientBankAccount: 'bankAccount.clientBankAccount',
          },
        },
      });
    console.log('Inverse relationship');
    console.log(clientBankAccount);
  }
}
