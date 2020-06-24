import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository, InsertResult } from 'typeorm';

import { BANK } from './bank.data';
import { Bank } from '@/entities/bank.entity';

@Injectable()
export class BankSeederService {
  constructor(
    @InjectRepository(Bank)
    private readonly bankRepository: Repository<Bank>,
  ) {}

  createBank(): Promise<Bank>[] {
    return BANK.map(bank => this.bankRepository.create(bank).save());
  }
}
