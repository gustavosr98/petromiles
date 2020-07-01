import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import {InsertResult, Repository} from 'typeorm';

import {STATE_USER} from "@/database/seeders/state-user/state-user.data";
import {StateUser} from "@/entities/state-user.entity";
import {State} from "@/entities/state.entity";
import { StateName } from "@/enums/state.enum";

@Injectable()
export class StateUserSeederService {
    constructor(
        @InjectRepository(StateUser)
        private readonly stateUserRepository: Repository<StateUser>,
        @InjectRepository(State)
        private readonly stateRepository: Repository<State>,
    ) {}

    createStateUser(): Promise<StateUser>[] {
        return STATE_USER.map(async stateUser =>{
            const state = await this.stateRepository.findOne({name: StateName.ACTIVE});
            return this.stateUserRepository
                .create({
                    initialDate: stateUser.initialDate,
                    userAdministrator: stateUser.userAdministrator,
                    state
                })
                .save()
            }
        );
    }
}