import { Injectable, Inject, BadRequestException } from '@nestjs/common';

import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

// INTERFACES
import { ApiModules } from '@/logger/api-modules.enum';
import { CsvApiError } from '@/enums/csv-process';

@Injectable()
export class CsvService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    @Inject('CsvToJson') private csvToJson,
  ) {}

  async toJSON<T>(file, posibleHeader?: string[]): Promise<Array<T>> {
    if (!!file) {
      try {
        let headerIsOk: boolean = true;
        const res: T[] = await this.csvToJson()
          .on('header', header => {
            headerIsOk = this.headerIsOk(header, posibleHeader);
          })
          .fromString(file.buffer.toString());

        if (headerIsOk) {
          return res;
        } else {
          throw new Error();
        }
      } catch (error) {
        this.logger.error(
          `[${ApiModules.THIRD_PARTY_CLIENTS}] => (${CsvApiError.CSV_WRONG_FORMAT})`,
        );
        throw new BadRequestException(CsvApiError.CSV_WRONG_FORMAT);
      }
    } else {
      this.logger.error(
        `[${ApiModules.THIRD_PARTY_CLIENTS}] => (${CsvApiError.CSV_NO_FILE_FOUND})`,
      );
      throw new BadRequestException(CsvApiError.CSV_NO_FILE_FOUND);
    }
  }

  private headerIsOk(header: string[], posibleHeader?: string[]): boolean {
    if (!!posibleHeader) {
      return JSON.stringify(header) === JSON.stringify(posibleHeader);
    } else {
      return true;
    }
  }
}
