import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StateUserService } from './state-user/state-user.service';
import { StateUser } from './state-user/state-user.entity';
import { UserDetailsService } from './user-details/user-details.service';
import { UserDetails } from './user-details/user-details.entity';
import { Language } from './language/language.entity';
import { UserRoleService } from './user-role/user-role.service';
import { PlatformAdministratorModule } from '../management/platform-administrator.module';
import { State } from '../management/state/state.entity';
import { UserService } from './user.service';
import { UserAdministratorService } from './user-administrator/user-administrator.service';
import { UserClientService } from '../client/user-client/user-client.service';
import { UserClient } from '../client/user-client/user-client.entity';

@Module({
  imports: [
    PlatformAdministratorModule,
    TypeOrmModule.forFeature([
      StateUser,
      UserDetails,
      Language,
      State,
      UserClient,
    ]),
  ],
  controllers: [],
  providers: [
    StateUserService,
    UserDetailsService,
    UserRoleService,
    UserService,
    UserAdministratorService,
    UserClientService,
  ],
  exports: [StateUserService, UserDetailsService, UserRoleService, UserService],
})
export class UserModule {}
