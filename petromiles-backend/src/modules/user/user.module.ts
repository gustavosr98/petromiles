import { Module } from '@nestjs/common';
import { StateUserService } from './state-user/state-user.service';
import { StateUser } from './state-user/state-user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserDetailsService } from './user-details/user-details.service';
import { UserDetails } from './user-details/user-details.entity';
import { Language } from './language/language.entity';
import { UserRoleService } from './user-role/user-role.service';
import { PlatformAdministratorModule } from '../management/platform-administrator.module';
import { State } from '../management/state/state.entity';
import { UserService } from './user.service';

@Module({
  imports: [
    PlatformAdministratorModule,
    TypeOrmModule.forFeature([StateUser, UserDetails, Language, State]),
  ],
  controllers: [],
  providers: [
    StateUserService,
    UserDetailsService,
    UserRoleService,
    UserService,
  ],
  exports: [StateUserService, UserDetailsService, UserRoleService, UserService],
})
export class UserModule {}
