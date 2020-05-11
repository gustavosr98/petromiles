import { Injectable } from '@nestjs/common';
import { PoeditorService } from './poeditor/poeditor.service';

@Injectable()
export class LanguageService {
  constructor(private poeditorService: PoeditorService) {}

  async getTerms(lang: string) {
    return await this.poeditorService.getTerms(lang);
  }
}
