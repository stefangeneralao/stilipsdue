import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import controllers from '~/controllers';
import MongoDBAdapter from './db/MongoDBAdapter';

const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(controllers);

// (async () => {
//   const result = await MongoDBAdapter.deleteUserTasks
//     ({
//       userId: { $eq: 'google-oauth2|104046422165335444848' },
//       status: { $eq: 'done' },
//     })

//   console.log(result);
// })();

const port = 3001;
app.listen(port, () => {
  console.log(`Listening to port ${3001}.`);
});
