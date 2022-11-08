import { CronCommand, CronJob } from 'cron';
import MongoDBAdapter from '~/db/MongoDBAdapter';

class StockholmCronJob extends CronJob {
  constructor(cronTime: string | Date, onTick: CronCommand) {
    super(cronTime, onTick, null, false, 'Europe/Stockholm');
  }
}

enum CronTimeEnum {
  DAILY = '0 0 * * *',
  WEEKLY = '0 0 * * 1',
  MONTHLY = '0 0 1 * *',
}

const dailyJob = new StockholmCronJob(CronTimeEnum.DAILY, () => {
  console.log('Running daily job');
  MongoDBAdapter.updateManyStatuses('dailies', 'todo');
});

const weeklyJob = new StockholmCronJob(CronTimeEnum.WEEKLY, () => {
  console.log('Running weekly job');
  MongoDBAdapter.updateManyStatuses('weeklies', 'todo');
});

const monthlyJob = new StockholmCronJob(CronTimeEnum.MONTHLY, () => {
  console.log('Running monthly job');
  MongoDBAdapter.updateManyStatuses('monthlies', 'todo');
});

const jobs = [dailyJob, weeklyJob, monthlyJob];

export const initJobs = () => jobs.forEach((job) => job.start());
