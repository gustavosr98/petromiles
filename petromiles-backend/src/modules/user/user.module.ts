import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// MODULES
import { PaymentProviderModule } from '@/modules/payment-provider/payment-provider.module';
import { ManagementModule } from '@/modules/management/management.module';

// CONTROLLER
import { UserController } from './controllers/user.controller';

// SERVICES
import { UserService } from '@/modules/user/services/user.service';
import { UserAdministratorService } from '@/modules/user/services/user-administrator.service';
import { UserClientService } from '@/modules/user/services/user-client.service';

// ENTITIES
import { State } from '@/entities/state.entity';
import { StateUser } from '@/entities/state-user.entity';
import { UserDetails } from '@/entities/user-details.entity';
import { Language } from '@/entities/language.entity';
import { UserClient } from '@/entities/user-client.entity';
import { UserAdministrator } from '@/entities/user-administrator.entity';
import { State } from '@/modules/management/state/state.entity';
import { StateUser } from '@/modules/user/state-user/state-user.entity';
import { UserDetails } from '@/modules/user/user-details/user-details.entity';
import { Language } from '@/modules/user/language/language.entity';
import { UserClient } from '@/modules/user/user-client/user-client.entity';
import { UserAdministrator } from '@/modules/user/user-administrator/user-administrator.entity';
import {Suscription} from "@/modules/suscription/suscription/suscription.entity";
import {UserSuscription} from "@/modules/user-suscription/user-suscription.entity";

@Module({
  imports: [
    ManagementModule,
    PaymentProviderModule,
    TypeOrmModule.forFeature([
      StateUser,
      UserDetails,
      Language,
      State,
      UserClient,
      UserAdministrator,
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, UserAdministratorService, UserClientService],
  exports: [UserService, UserAdministratorService, UserClientService],
})
export class UserModule {}
