import { Router } from 'express';

import ai from './ai';
import auth from './auth';
import builtinAnswer from './builtin-answer';
import fortune from './fortune';
import functionCall from './function-call';
import invite from './invite';
import message from './message';
import phase from './phase';
import points from './points';
import report from './report';
import setting from './setting';
import sns from './sns';
import upload from './upload';
import user from './user';

const router = Router();

router.use('/auth', auth);
router.use('/user', user);
router.use('/ai', ai);
router.use('/setting', setting);
router.use('/upload', upload);
router.use('/message', message);
router.use('/invites', invite);
router.use('/fortune', fortune);
router.use('/builtinAnswers', builtinAnswer);
router.use('/sns', sns);
router.use('/report', report);
router.use('/points', points);
router.use('/phase', phase);
router.use('/fc', functionCall);

export default router;
