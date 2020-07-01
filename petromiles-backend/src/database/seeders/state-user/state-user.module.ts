import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {StateUserSeederService} from "@/database/seeders/state-user/state-user.service";
import {StateUser} from "@/entities/state-user.entity";
import {State} from "@/entities/state.entity";

@Module({
    imports: [TypeOrmModule.forFeature([StateUser, State])],
    providers: [StateUserSeederService],
    exports: [StateUserSeederService],
})
export class StateUserSeederModule {}