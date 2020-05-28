import { BaseEntity, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { CronJobs } from '@/modules/cron/cron-jobs.enum';

@Entity()
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn()
  idTask: number;

  @Column({
    type: 'enum',
    enum: CronJobs,
  })
  name: CronJobs;

  @Column()
  frequency: number;
}
