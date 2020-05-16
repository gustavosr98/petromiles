import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { UserDetails } from './user-details.entity';
import { Language } from './../language/language.entity';
import { UserClient } from '../../client/user-client/user-client.entity';
import { UserAdministrator } from '../user-administrator/user-administrator.entity';

@Injectable()
export class UserDetailsService {
  constructor(
    @InjectRepository(Language)
    private languageRepository: Repository<Language>,
    @InjectRepository(UserDetails)
    private userDetailsRepository: Repository<UserDetails>,
  ) {}

  async createClientDetails(userClientDetails): Promise<UserDetails> {
    const result = await this.userDetailsRepository.save(userClientDetails);

    result.userClient = null;
    return result;
  }

  async getLanguage(name: string) {
    return await this.languageRepository.findOne({ name });
  }

  async getClientDetails(userClient: UserClient): Promise<UserDetails> {
    return await this.userDetailsRepository.findOne(userClient);
  }

  async getAdministratorDetails(
    userAdministrator: UserAdministrator,
  ): Promise<UserDetails> {
    return await this.userDetailsRepository.findOne(userAdministrator);
  }
}
