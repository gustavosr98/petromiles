import { Controller, Get, Param } from '@nestjs/common';
import { LanguageService } from './language.service';

@Controller('language')
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

  @Get(':lang')
  async getTerms(@Param('lang') lang) {
    return await this.languageService.getTerms(lang);
  }
}
