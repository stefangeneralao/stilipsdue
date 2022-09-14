import { Router } from 'express';
import { todosController } from './todos';
import { usersController } from './users';

const controllers = Router();
controllers.use('/todos', todosController);
controllers.use('/users', usersController);

export default controllers;
