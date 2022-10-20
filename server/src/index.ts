import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import controllers from '~/controllers';
import { initJobs } from '~/cronjobs';

initJobs();

const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  })
);
app.use(controllers);

const port = 3001;
app.listen(port, () => {
  console.log(`Listening to port ${3001}.`);
});
