import { Module } from '@nestjs/common';
import { ExampleController } from './example.controller';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { LoggerOptions } from '../../../config/logger/Winston.Config.Service';

@Module({
  imports: [
    ConfigModule,
    WinstonModule.forRoot(
      new LoggerOptions().createOptions('petromiles-global-info.log'),
    ),
  ],
  controllers: [ExampleController],
})
export class ExampleModule {}
