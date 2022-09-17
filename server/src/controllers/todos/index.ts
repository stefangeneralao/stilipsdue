import { Router, Response } from 'express';
import { checkJwt } from '~/middlewares';
import { RequestWithAuth } from '~/types';
import { getTodos, setTodos } from './service';

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

router.post('/', checkJwt, async (req: RequestWithAuth, res: Response) => {
  const userId = req.auth.sub;

  setTodos(userId, req.body);
  res.send();
});

export const todosController = router;
