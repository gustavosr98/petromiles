import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { TransactionService } from './transaction.service';
import { PlatformInterestService } from '../management/platform-interest/platform-interest.service';
import { PlatformAdministratorModule } from '../management/platform-administrator.module';
import { Transaction } from './transaction/transaction.entity';
import { TransactionInterestService } from './transaction-interest/transaction-interest.service';
import { TransactionInterest } from './transaction-interest/transaction-interest.entity';
import { StateTransactionService } from './state-transaction/state-transaction.service';

@Module({
  imports: [
    PlatformAdministratorModule,
    TypeOrmModule.forFeature([Transaction, TransactionInterest]),
  ],
  providers: [
    TransactionService,
    PlatformInterestService,
    TransactionInterestService,
    StateTransactionService,
  ],
  exports: [
    TransactionService,
    TransactionInterestService,
    StateTransactionService,
    TypeOrmModule.forFeature([Transaction]),
  ],
})
export class TransactionModule {}
