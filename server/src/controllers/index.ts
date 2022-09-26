import { Router } from 'express';
import { tasksController } from './tasks';
import { usersController } from './users';

const controllers = Router();
controllers.use('/users', usersController);
controllers.use('/tasks', tasksController);

export default controllers;
