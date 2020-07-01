import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {UserRoleSeederService} from "@/database/seeders/user-role/user-role.service";
import {UserRole} from "@/entities/user-role.entity";

@Module({
    imports: [TypeOrmModule.forFeature([UserRole])],
    providers: [UserRoleSeederService],
    exports: [UserRoleSeederService],
})
export class UserRoleSeederModule {}