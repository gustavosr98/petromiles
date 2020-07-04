import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {UserRoleSeederService} from "@/database/seeders/user-role/user-role.service";
import {UserRole} from "@/entities/user-role.entity";
import {Role} from "@/entities/role.entity";

@Module({
    imports: [TypeOrmModule.forFeature([UserRole, Role])],
    providers: [UserRoleSeederService],
    exports: [UserRoleSeederService],
})
export class UserRoleSeederModule {}