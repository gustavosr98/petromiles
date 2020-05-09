import { Injectable } from '@nestjs/common';
import { UserDetails } from './user-details.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection } from 'typeorm';
import { Language } from './../language/language.entity';
import { UserClient } from '../../client/user-client/user-client.entity';

@Injectable()
export class UserDetailsService {
  private connection = getConnection();

  constructor(
    @InjectRepository(Language)
    private languageRepository: Repository<Language>,
    @InjectRepository(UserDetails)
    private userDetailsRepository: Repository<UserDetails>,
  ) {}

  async createUserClientDetails(userClientDetails): Promise<UserDetails> {
    const result = await this.userDetailsRepository.save(userClientDetails);

    result.userClient = null;
    return result;
  }

  async getLanguage(name: string) {
    return await this.languageRepository.findOne({ name });
  }
}
