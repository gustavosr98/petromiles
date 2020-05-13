import { Module } from '@nestjs/common';
import { ExampleController } from './example.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [ExampleController],
})
export class ExampleModule {}
