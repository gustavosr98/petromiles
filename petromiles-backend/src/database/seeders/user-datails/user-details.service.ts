import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository, InsertResult } from 'typeorm';

import {USER_DETAILS} from "@/database/seeders/user-datails/user-details.data";
import {UserDetails} from "@/entities/user-details.entity";

@Injectable()
export class UserDetailsSeederService {
    constructor(
        @InjectRepository(UserDetails)
        private readonly userDetailsRepository: Repository<UserDetails>,
    ) {}

    createUserDetails(): Promise<InsertResult>[] {
        return USER_DETAILS.map(userDetails  =>
            this.userDetailsRepository.insert(userDetails),
        );
    }
}