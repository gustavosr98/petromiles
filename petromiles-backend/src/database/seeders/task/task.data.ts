/* eslint-disable @typescript-eslint/camelcase */

import { CronJobs } from '@/enums/cron-jobs.enum';

const minute = 60 * 1000;
const hour = 60 * minute;

export const TASKS = Object.freeze([
  {
    idBank: 1,
    name: CronJobs.BANK_ACCOUNT_STATUS_STRIPE,
    frequency: 24 * hour,
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
