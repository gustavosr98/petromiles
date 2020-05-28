/* eslint-disable @typescript-eslint/camelcase */
import { CronJobs } from '@/modules/cron/cron-jobs.enum';

const minute = 60 * 1000;

export const TASKS = Object.freeze([
  {
    idBank: 1,
    name: CronJobs.BANK_ACCOUNT_STATUS_STRIPE,
    frequency: 5 * minute,
  },
  {
    idBank: 2,
    name: CronJobs.TRANSACTION_CHARGE_STATUS_STRIPE,
    frequency: 5 * minute,
  },
  {
    idBank: 3,
    name: CronJobs.TRANSACTION_TRANSFER_STATUS_STRIPE,
    frequency: 5 * minute,
  },
]);
