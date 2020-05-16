import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { State } from './state/state.entity';
import { Role } from './role/role.entity';
import { StateService } from './state/state.service';
import { RoleService } from './role/role.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([State]),
    TypeOrmModule.forFeature([Role]),
  ],
  providers: [StateService, RoleService],
  exports: [StateService, RoleService],
})
export class PlatformAdministratorModule {}
