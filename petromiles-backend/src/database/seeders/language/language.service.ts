import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository, InsertResult } from 'typeorm';

import { LANGUAGES } from './language.data';
import { Language } from '../../../entities/language.entity';

@Injectable()
export class LanguageSeederService {
  constructor(
    @InjectRepository(Language)
    private readonly languageRepository: Repository<Language>,
  ) {}

  createLanguage(): Promise<InsertResult>[] {
    return LANGUAGES.map(language => this.languageRepository.insert(language));
  }
}
