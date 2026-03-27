import { call } from '@blocklet/sdk/lib/component';
import { auth, user } from '@blocklet/sdk/lib/middlewares';
import { Router } from 'express';
import Joi from 'joi';
import { joinURL } from 'ufo';

import { componentIds } from '../libs/constants';
import { config } from '../libs/env';

const router = Router();

export interface PointActionInput {
  action: string;
}

const pointActionInputSchema = Joi.object<PointActionInput>({
  action: Joi.string().required(),
});

router.post('/action', user(), auth(), async (req, res) => {
  const { did } = req.user!;

  const input = await pointActionInputSchema.validateAsync(req.body, { stripUnknown: true });

  const action = config.points.actions[input.action];
  if (!action) throw new Error(`Unsupported action ${input.action}`);

  try {
    const { data } = await call({
      name: componentIds.pointUp,
      path: '/api/add-point-cc',
      method: 'POST',
      data: {
        ruleId: action.ruleId,
        userDID: did,
      },
    });

    return res.json(data);
  } catch (error: any) {
    const status = error?.response?.status || error?.status || 500;
    const message = error?.response?.data?.message || error?.message || 'Failed to add points';

    return res.status(status).json({ error: message });
  }
});

router.get('/status', user(), auth(), async (req, res) => {
  const { did } = req.user!;

  const [{ data: user }, { data: redeemReport } = { data: undefined }] = await Promise.all([
    call({
      name: componentIds.pointUp,
      path: joinURL('/api/get-user-points-info-cc', did),
      method: 'GET',
      data: {},
    }),
    config.points.consume.redeemReport &&
      call({
        name: componentIds.pointUp,
        path: joinURL('/api/get-consume-point-rule-info-cc', config.points.consume.redeemReport.ruleId),
        method: 'GET',
        data: {},
      }),
  ]);

  return res.json({
    user: user.info,
    redeemReport: redeemReport?.rule,
  });
});

export default router;
