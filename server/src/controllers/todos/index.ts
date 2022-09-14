import { Router, Response } from 'express';
import { checkJwt } from '~/middlewares';
import { GetUserAuthInfoRequest } from '~/types';
import { getTodos, resetUserTodos } from './service';

const router = Router();

router.get(
  '/',
  checkJwt,
  async (req: GetUserAuthInfoRequest, res: Response) => {
    const userId = req.auth.sub;

    try {
      const todos =
        (await getTodos(userId)) ||
        (await resetUserTodos(userId)).user_metadata.todos;

      res.send({ todos });
    } catch (e) {
      console.log(e);
      res.status(500).send();
    }
  }
);

export const todosController = router;
