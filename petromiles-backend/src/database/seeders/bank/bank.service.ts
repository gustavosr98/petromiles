import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository, InsertResult } from 'typeorm';

import { Bank } from '../../../modules/bank-account/bank/bank.entity';
import { BANK } from './Bank.data';

@Injectable()
export class BankSeederService {
  constructor(
    @InjectRepository(Bank)
    private readonly bankRepository: Repository<Bank>,
  ) {}

  createBank(): Promise<InsertResult>[] {
    return BANK.map(bank => this.bankRepository.insert(bank));
  }
}
