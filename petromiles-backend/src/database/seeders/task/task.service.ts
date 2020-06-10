import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository, InsertResult } from 'typeorm';

import { TASKS } from './task.data';
import { Task } from '@/entities/task.entity';

@Injectable()
export class TaskSeederService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  createTask(): Promise<InsertResult>[] {
    return TASKS.map(task => this.taskRepository.insert(task));
  }
}
