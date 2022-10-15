import { Router, Response } from 'express';
import { checkJwt } from '~/middlewares';
import { RequestWithAuth, RequestWithUserTasks } from '~/types';
import {
  getTasks,
  createUserTask,
  updateUserTasks,
  deleteUserTask,
} from './service';

const router = Router();
router.use(checkJwt);

router.get('/', async (req: RequestWithAuth, res: Response) => {
  const userId = req.auth.sub;

  try {
    const tasks = await getTasks(userId);
    res.send({ tasks });
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

router.post('/', async (req: RequestWithAuth, res: Response) => {
  const userId = req.auth.sub;

  try {
    const insertedTask = await createUserTask(userId, req.body);
    res.send(insertedTask);
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

router.patch('/', async (req: RequestWithUserTasks, res: Response) => {
  const userId = req.auth.sub;
  const tasks = req.body;

  if (!tasks) {
    return res.status(400).send();
  }

  try {
    await updateUserTasks(userId, tasks);
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

router.delete('/:id', async (req: RequestWithAuth, res: Response) => {
  const taskId = req.params.id;

  try {
    await deleteUserTask(taskId);
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

export const tasksController = router;
