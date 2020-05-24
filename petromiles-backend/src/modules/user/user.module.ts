import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// MODULES
import { PaymentProviderModule } from '@/modules/payment-provider/payment-provider.module';
import { ManagementModule } from '@/modules/management/management.module';

// CONTROLLER
import { UserController } from './user.controller';

// SERVICES
import { StateUserService } from '@/modules/user/state-user/state-user.service';
import { UserDetailsService } from '@/modules/user/user-details/user-details.service';
import { UserRoleService } from '@/modules/user/user-role/user-role.service';
import { UserService } from '@/modules/user/user.service';
import { UserAdministratorService } from '@/modules/user/user-administrator/user-administrator.service';
import { UserClientService } from '@/modules/user/user-client/user-client.service';

// ENTITIES
import { State } from '@/modules/management/state/state.entity';
import { StateUser } from '@/modules/user/state-user/state-user.entity';
import { UserDetails } from '@/modules/user/user-details/user-details.entity';
import { Language } from '@/modules/user/language/language.entity';
import { UserClient } from '@/modules/user/user-client/user-client.entity';
import { UserAdministrator } from '@/modules/user/user-administrator/user-administrator.entity';

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
  providers: [
    UserAdministrator,
    StateUserService,
    UserDetailsService,
    UserRoleService,
    UserService,
    UserAdministratorService,
    UserClientService,
  ],
  exports: [
    StateUserService,
    UserDetailsService,
    UserRoleService,
    UserService,
    UserAdministratorService,
    UserClientService,
  ],
})
export class UserModule {}
