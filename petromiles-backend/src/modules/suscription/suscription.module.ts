import { Module } from '@nestjs/common';

// SERVICES
import { SuscriptionService } from '@/modules/suscription/service/suscription.service';

// MODULES
import { UserModule } from '@/modules/user/user.module';
import { BankAccountModule } from '@/modules/bank-account/bank-account.module';
import { TransactionModule } from '@/modules/transaction/transaction.module';

//CONTROLLER
import { SuscriptionController } from '@/modules/suscription/controller/suscription.controller';
import { SuscriptionService } from './suscription.service';
import { UserModule } from '../user/user.module';
import { BankAccountModule } from '../bank-account/bank-account.module';
import { TransactionModule } from '../transaction/transaction.module';
import { SuscriptionController } from './suscription.controller';
import {Suscription} from "@/modules/suscription/suscription/suscription.entity";
import {UserClient} from "@/modules/user/user-client/user-client.entity";
import {TypeOrmModule} from "@nestjs/typeorm";

@Module({
  imports: [UserModule, BankAccountModule, TransactionModule,
    TypeOrmModule.forFeature([
        Suscription,
        UserClient,
    ])],
  providers: [SuscriptionService],
  exports: [SuscriptionService],
  controllers: [SuscriptionController],
})
export class SuscriptionModule {}
