import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {UserDetailsSeederService} from "@/database/seeders/user-datails/user-details.service";
import {UserDetails} from "@/entities/user-details.entity";

@Module({
    imports: [TypeOrmModule.forFeature([UserDetails])],
    providers: [UserDetailsSeederService],
    exports: [UserDetailsSeederService],
})
export class UserDetailsSeederModule {}