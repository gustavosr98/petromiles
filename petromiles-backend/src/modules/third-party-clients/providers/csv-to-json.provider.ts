import { ValueProvider } from '@nestjs/common';
import * as CsvToJson from 'csvtojson';

export const CsvToJsonProvider: ValueProvider = {
  provide: 'CsvToJson',
  useValue: CsvToJson,
};
