import { Injectable, HttpService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as FormData from 'form-data';

@Injectable()
export class PoeditorService {
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {}
  async getTerms(lang: string) {
    const poeditorConfig = this.configService.get('lang.poeditor');

    let bodyFormData = new FormData();
    bodyFormData.append('api_token', poeditorConfig.apiSecretKey);
    bodyFormData.append('id', poeditorConfig.projectId);
    bodyFormData.append('language', lang);

    // JS Destructuring
    const {
      data: {
        result: { terms: poeditorTerms },
      },
    } = await this.httpService
      .post('https://api.poeditor.com/v2/terms/list', bodyFormData, {
        headers: bodyFormData.getHeaders(),
      })
      .toPromise();

    return poeditorTerms;
  }
}
