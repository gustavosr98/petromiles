import { IsString, IsNotEmpty } from 'class-validator';

export class CsvCheckRequest {
  @IsNotEmpty()
  @IsString()
  apiKey: string; // Platform unique identifier provided by Petromiles secretly
}
