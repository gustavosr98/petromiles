import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository, InsertResult } from 'typeorm';

import {USER_ROLE} from "@/database/seeders/user-role/user-role.data";
import {UserRole} from "@/entities/user-role.entity";
import {Role} from "@/entities/role.entity";
import {Role as RoleName} from "@/enums/role.enum"


@Injectable()
export class UserRoleSeederService {
    constructor(
        @InjectRepository(UserRole)
        private readonly userRoleRepository: Repository<UserRole>,
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
    ) {}

    createUserRole(): Promise<UserRole>[] {
        return USER_ROLE.map(async userRole =>{
            const role = await this.roleRepository.findOne({name: RoleName.ADMINISTRATOR})
            return this.userRoleRepository
                .create({
                    userAdministrator: userRole.userAdministrator,
                    role
                })
                .save()
            }
        );
    }
}