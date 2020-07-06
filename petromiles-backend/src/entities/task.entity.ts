import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeUpdate,
} from 'typeorm';
import { Transform } from 'class-transformer';
import { CronJobs } from '@/enums/cron-jobs.enum';

@Entity()
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn()
  idTask: number;

  @Column({
    type: 'enum',
    enum: CronJobs,
  })
  name: CronJobs;

  @Transform(frecuency => frecuency / 60000)
  @Column()
  frequency: number;
}
