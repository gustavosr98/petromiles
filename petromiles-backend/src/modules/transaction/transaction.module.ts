import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// CONTROLLER
import { TransactionController } from '@/modules/transaction/controllers/transaction.controller';

// MODULES
import { ManagementModule } from '@/modules/management/management.module';
import { PaymentProviderModule } from '@/modules/payment-provider/payment-provider.module';

// SERVICES
import { TransactionService } from '@/modules/transaction/services/transaction.service';
import { TransactionInterestService } from '@/modules/transaction/services/transaction-interest.service';
import { StateTransactionService } from '@/modules/transaction/services/state-transaction.service';

// ENTITIES
import { Transaction } from '@/entities/transaction.entity';
import { TransactionInterest } from '@/entities/transaction-interest.entity';
import { StateTransaction } from '@/entities/state-transaction.entity';

@Module({
  imports: [
    PaymentProviderModule,
    ManagementModule,
    TypeOrmModule.forFeature([
      Transaction,
      TransactionInterest,
      StateTransaction,
    ]),
  ],
  providers: [
    TransactionService,
    TransactionInterestService,
    StateTransactionService,
  ],
  exports: [
    TransactionService,
    TransactionInterestService,
    StateTransactionService,
  ],
  controllers: [TransactionController],
})
export class TransactionModule {}
