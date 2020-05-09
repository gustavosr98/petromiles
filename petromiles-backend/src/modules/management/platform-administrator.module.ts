import { Module } from '@nestjs/common';
import { StateService } from './state/state.service';
import { RoleService } from './role/role.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { State } from './state/state.entity';
import { Role } from './role/role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([State]),
    TypeOrmModule.forFeature([Role]),
  ],
  providers: [StateService, RoleService],
  exports: [StateService, RoleService],
})
export class PlatformAdministratorModule {}
