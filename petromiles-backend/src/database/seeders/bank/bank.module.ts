import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bank } from '../../../entities/bank.entity';
import { BankSeederService } from './bank.service';

@Module({
  imports: [TypeOrmModule.forFeature([Bank])],
  providers: [BankSeederService],
  exports: [BankSeederService],
})
export class BankSeederModule {}
