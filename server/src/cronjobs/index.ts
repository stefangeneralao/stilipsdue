import { CronJob } from 'cron';
import MongoDBAdapter from '~/db/MongoDBAdapter';

const dailyJob = new CronJob('0 0 0 */1 * *', () => {
  console.log('Running daily job');
  MongoDBAdapter.updateAllTasksStatus('dailies', 'todo');
});

const weeklyJob = new CronJob('0 0 0 * * 0', () => {
  console.log('Running weekly job');
  MongoDBAdapter.updateAllTasksStatus('weeklies', 'todo');
});

const monthlyJob = new CronJob('0 0 0 1 * *', () => {
  console.log('Running monthly job');
  MongoDBAdapter.updateAllTasksStatus('monthlies', 'todo');
});

const jobs = [dailyJob, weeklyJob, monthlyJob];

export const initJobs = () => jobs.forEach((job) => job.start());
