import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import controllers from '~/controllers';

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(controllers);

const port = 3001;
app.listen(port, () => {
  console.log(`Listening to port ${3001}.`);
});
