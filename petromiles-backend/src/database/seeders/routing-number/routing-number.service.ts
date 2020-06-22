import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { RoutingNumber } from '@/entities/routing-number.entity';
import { Bank } from '@/entities/bank.entity';

import { RoutingNumber as RoutingNumbers } from '@/database/seeders/routing-number/routing-number.data';

@Injectable()
export class RoutingNumberSeederService {
  constructor(
    @InjectRepository(RoutingNumber)
    private readonly routingNumber: Repository<RoutingNumber>,
    @InjectRepository(Bank)
    private readonly bank: Repository<Bank>,
  ) {}

  createRoutingNumber(): Promise<RoutingNumber>[] {
    return RoutingNumbers.map(async routingNumber => {
      const bank = await this.bank.findOne({ name: routingNumber.bankName });
      return this.routingNumber
        .create({
          idRoutingNumber: routingNumber.id,
          number: routingNumber.number,
          bank,
        })
        .save();
    });
  }
}
