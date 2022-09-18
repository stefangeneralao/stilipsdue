import { Router, Response } from 'express';
import { checkJwt } from '~/middlewares';
import { RequestWithAuth } from '~/types';
import { getTodos, updateUserTodos } from './service';

const router = Router();

router.get('/', checkJwt, async (req: RequestWithAuth, res: Response) => {
  const userId = req.auth.sub;

  try {
    const todos = await getTodos(userId);

    res.send({ todos });
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

router.patch('/', checkJwt, async (req: RequestWithAuth, res: Response) => {
  const userId = req.auth.sub;

  try {
    await updateUserTodos(userId, req.body);
    res.send();
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

export const todosController = router;
