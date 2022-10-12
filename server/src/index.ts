import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import controllers from '~/controllers';
import MongoDBAdapter from './db/MongoDBAdapter';
import { initJobs } from '~/cronjobs';
import { StatusId, Task } from '/types';
import { MongoTask } from './types';

initJobs();

const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(controllers);

// (async () => {
//   const allDailyTasks = await MongoDBAdapter.findUserTasks({
//     swimlane: { $eq: 'dailies' },
//   });

//   const dailyTasksGroupedByUser = allDailyTasks.reduce((acc, task) => {
//     if (!acc[task.userId]) {
//       acc[task.userId] = [];
//     }
//     acc[task.userId].push(task);
//     return acc;
//   }, {} as { [userId: string]: MongoTask[] });

//   const updatedDailyTasks = Object.values(dailyTasksGroupedByUser).flatMap(
//     (tasks) =>
//       tasks.map(({ _id, ...rest }, index) => ({
//         ...rest,
//         index,
//         status: 'todo' as StatusId,
//         id: _id.toString(),
//       }))
//   );

//   MongoDBAdapter.updateUserTasks(updatedDailyTasks);
// })();

const port = 3001;
app.listen(port, () => {
  console.log(`Listening to port ${3001}.`);
});
