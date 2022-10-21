import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import controllers from '~/controllers';
import { initJobs } from '~/cronjobs';

const corsOrigin = (() => {
  if (!process.env.CORS_ORIGIN) {
    console.log(
      'CORS_ORIGIN is not defined in .env, falling back to http://localhost:3000.'
    );
    return 'http://localhost:3000';
  }
  return process.env.CORS_ORIGIN;
})();

initJobs();

const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use(helmet());
app.use(
  cors({
    origin: corsOrigin,
  })
);
app.use(controllers);

const port = 3001;
app.listen(port, () => {
  console.log(`Listening to port ${3001}.`);
});
