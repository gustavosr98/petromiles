import { Injectable } from '@nestjs/common';
import { getConnection } from 'typeorm';
import { ClientBankAccount } from '../../entities/client-bank-account.entity';
import { BankAccount } from '../../entities/bank-account.entity';

@Injectable()
export class ExampleService {
  test(): string {
    return 'I am working!';
  }
}
