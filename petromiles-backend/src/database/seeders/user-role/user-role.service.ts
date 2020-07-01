import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository, InsertResult } from 'typeorm';

import {USER_ROLE} from "@/database/seeders/user-role/user-role.data";
import {UserRole} from "@/entities/user-role.entity";

@Injectable()
export class UserRoleSeederService {
    constructor(
        @InjectRepository(UserRole)
        private readonly userRoleRepository: Repository<UserRole>,
    ) {}

    createUserRole(): Promise<InsertResult>[] {
        return USER_ROLE.map(userRole =>
            this.userRoleRepository.insert(userRole),
        );
    }
}