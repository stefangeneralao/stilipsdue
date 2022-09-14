import { Router, Response } from 'express';
import { checkJwt } from '~/middlewares';
import { GetUserAuthInfoRequest } from '~/types';
import { getUser } from './service';

const router = Router();

router.get(
  '/',
  checkJwt,
  async (req: GetUserAuthInfoRequest, res: Response) => {
    const userId = req.auth.sub;

    try {
      const user = await getUser(userId);
      res.send(user);
    } catch (e) {
      console.log(e);
      res.status(500).send();
    }
  }
);

export const usersController = router;
