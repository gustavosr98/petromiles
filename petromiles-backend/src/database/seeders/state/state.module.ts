import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { State } from '../../../entities/state.entity';
import { StateSeederService } from './state.service';

@Module({
  imports: [TypeOrmModule.forFeature([State])],
  providers: [StateSeederService],
  exports: [StateSeederService],
})
export class StatesSeederModule {}
