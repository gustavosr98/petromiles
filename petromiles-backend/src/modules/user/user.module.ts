import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// MODULES
import { ManagementModule } from '../management/management.module';

// CONTROLLER
import { UserController } from './user.controller';

// SERVICES
import { StateUserService } from './state-user/state-user.service';
import { UserDetailsService } from './user-details/user-details.service';
import { UserRoleService } from './user-role/user-role.service';
import { UserService } from './user.service';
import { UserAdministratorService } from './user-administrator/user-administrator.service';
import { UserClientService } from './user-client/user-client.service';

// ENTITIES
import { StateUser } from './state-user/state-user.entity';
import { UserDetails } from './user-details/user-details.entity';
import { Language } from './language/language.entity';
import { State } from '../management/state/state.entity';
import { UserClient } from './user-client/user-client.entity';
import { UserAdministrator } from './user-administrator/user-administrator.entity';

@Module({
  imports: [
    ManagementModule,
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
