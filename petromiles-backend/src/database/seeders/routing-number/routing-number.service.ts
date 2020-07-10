import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { RoutingNumber } from '@/entities/routing-number.entity';
import { Bank } from '@/entities/bank.entity';

import { routingNumbers } from '@/database/seeders/routing-number/routing-number.data';

@Injectable()
export class RoutingNumberSeederService {
  constructor(
    @InjectRepository(RoutingNumber)
    private readonly repository: Repository<RoutingNumber>,
    @InjectRepository(Bank)
    private readonly bankRepository: Repository<Bank>,
  ) {}

  async createRoutingNumber(): Promise<Promise<RoutingNumber>[]> {
    const banks = await this.bankRepository.find();

    return routingNumbers.map(async routingNumber => {
      const bank = banks.find(b => b.name === routingNumber.bankName);
      return this.repository
        .create({
          number: routingNumber.number,
          bank,
        })
        .save();
    });
  }
}
