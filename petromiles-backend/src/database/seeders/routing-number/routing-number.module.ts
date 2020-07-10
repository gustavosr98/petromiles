import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RoutingNumber } from '@/entities/routing-number.entity';
import { Bank } from '@/entities/bank.entity';

import { RoutingNumberSeederService } from '@/database/seeders/routing-number/routing-number.service';

@Module({
  imports: [TypeOrmModule.forFeature([RoutingNumber, Bank])],
  providers: [RoutingNumberSeederService],
  exports: [RoutingNumberSeederService],
})
export class RoutingNumberModule {}
