import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesSeederService } from './role.service';
import { Role } from '../../../entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  providers: [RolesSeederService],
  exports: [RolesSeederService],
})
export class RoleSeederModule {}
