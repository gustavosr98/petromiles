import { Module } from '@nestjs/common';
import { SuscriptionService } from './suscription.service';
import { UserModule } from '../user/user.module';
import { BankAccountModule } from '../bank-account/bank-account.module';
import { TransactionModule } from '../transaction/transaction.module';
import { SuscriptionController } from './suscription.controller';

@Module({
  imports: [UserModule, BankAccountModule, TransactionModule],
  providers: [SuscriptionService],
  exports: [SuscriptionService],
  controllers: [SuscriptionController],
})
export class SuscriptionModule {}
