import { StateName } from '@/enums/state.enum';
import { CsvProcessDescription, CsvProcessResult } from '@/enums/csv-process';

export interface CsvProcessDetails {
  description: CsvProcessDescription[];
  result: CsvProcessResult;
  state: StateName;
}
