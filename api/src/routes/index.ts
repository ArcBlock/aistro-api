import { sessionMiddleware } from '@blocklet/sdk/lib/middlewares/session';
import { Router } from 'express';

import divination from './divination';

const router = Router();

router.use('/divination', divination);
router.use('/user', sessionMiddleware(), (req, res) => res.json(req.user || {}));

router.use('/data', (_, res) =>
  res.json({
    message: 'Hello Blocklet!',
  }),
);

export default router;
