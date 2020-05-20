import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bank } from '../../../modules/bank-account/bank/bank.entity';
import { BankSeederService } from './bank.service';

@Module({
  imports: [TypeOrmModule.forFeature([Bank])],
  providers: [BankSeederService],
  exports: [BankSeederService],
})
export class BankSeederModule {}
