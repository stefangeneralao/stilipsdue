import { Router, Response } from 'express';
import { checkJwt } from '~/middlewares';
import { RequestWithAuth } from '~/types';
import { getTasks, createUserTask, updateUserTasks } from './service';

const router = Router();

router.get('/', checkJwt, async (req: RequestWithAuth, res: Response) => {
  const userId = req.auth.sub;

  try {
    const tasks = await getTasks(userId);

    res.send({ tasks });
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

router.post('/', checkJwt, async (req: RequestWithAuth, res: Response) => {
  const userId = req.auth.sub;

  try {
    const insertedTask = await createUserTask(userId, req.body);
    res.send(insertedTask);
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

router.patch('/', checkJwt, async (req: RequestWithAuth, res: Response) => {
  const userId = req.auth.sub;

  try {
    await updateUserTasks(userId, req.body);

    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

export const tasksController = router;
