import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {UserAdministratorSeederService} from "@/database/seeders/user-administrator/user-administrator.service";
import {UserAdministrator} from "@/entities/user-administrator.entity";

@Module({
    imports: [TypeOrmModule.forFeature([UserAdministrator])],
    providers: [UserAdministratorSeederService],
    exports: [UserAdministratorSeederService],
})
export class UserAdministratorSeederModule {}