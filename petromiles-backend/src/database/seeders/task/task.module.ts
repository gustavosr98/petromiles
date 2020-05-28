import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TaskSeederService } from './task.service';
import { Task } from '@/modules/management/task/task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task])],
  providers: [TaskSeederService],
  exports: [TaskSeederService],
})
export class TaskSeederModule {}
