import { Module } from '@nestjs/common';
import { dataBaseProvider } from './database.service';

@Module({
  imports: [dataBaseProvider],
  exports: [dataBaseProvider],
})
export class DatabaseModule {}
