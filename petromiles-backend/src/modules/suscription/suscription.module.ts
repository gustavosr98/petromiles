import { Module } from '@nestjs/common';

// SERVICES
import { SuscriptionService } from '@/modules/suscription/service/suscription.service';

// MODULES
import { UserModule } from '@/modules/user/user.module';
import { BankAccountModule } from '@/modules/bank-account/bank-account.module';
import { TransactionModule } from '@/modules/transaction/transaction.module';

//CONTROLLER
import { SuscriptionController } from '@/modules/suscription/controller/suscription.controller';

@Module({
  imports: [UserModule, BankAccountModule, TransactionModule],
  providers: [SuscriptionService],
  exports: [SuscriptionService],
  controllers: [SuscriptionController],
})
export class SuscriptionModule {}
