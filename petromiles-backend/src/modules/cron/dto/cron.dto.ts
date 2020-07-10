import { IsNotEmpty } from 'class-validator';
import { CronJobs } from '@/enums/cron-jobs.enum';
export class UpdateCronDTO {
  @IsNotEmpty()
  name: CronJobs;

  @IsNotEmpty()
  frequency: number;
}
