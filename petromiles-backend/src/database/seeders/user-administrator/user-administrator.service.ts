import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository, InsertResult } from 'typeorm';

import {USER_ADMINISTRATOR} from "@/database/seeders/user-administrator/user-administrator.data";
import {UserAdministrator} from "@/entities/user-administrator.entity";

@Injectable()
export class UserAdministratorSeederService {
    constructor(
        @InjectRepository(UserAdministrator)
        private readonly userAdministratorRepository: Repository<UserAdministrator>,
    ) {}

    createUserAdministrator(): Promise<InsertResult>[] {
        return USER_ADMINISTRATOR.map(administrator =>
            this.userAdministratorRepository.insert(administrator),
        );
    }
}