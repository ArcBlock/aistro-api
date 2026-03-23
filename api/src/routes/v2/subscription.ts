import { component, user } from '@blocklet/sdk/lib/middlewares';
import { Router } from 'express';
import Joi from 'joi';
import { Op } from 'sequelize';

import { verifySubscription } from '../../libs/app-receipt';
import { UnauthorizedError } from '../../libs/auth';
import { TEST_IOS_PURCHASE_RECEIPT } from '../../libs/env';
import logger from '../../libs/logger';
import Billing from '../../store/models/billing';

const router = Router();

const subscriptionInputSchema = Joi.object<{
  platform: 'ios' | 'android';
  receipt: string;
  developerPayload?: string;
  language: string;
}>({
  platform: Joi.string().allow('ios', 'android').required(),
  receipt: Joi.string().required(),
  developerPayload: Joi.string().empty(['', null]),
  language: Joi.string().required(),
});

router.post('/subscriptions', user(), component.verifySig, async (req, res) => {
  const userId = req.user?.did;
  if (!userId) throw new UnauthorizedError();

  const input = await subscriptionInputSchema.validateAsync(req.body, { stripUnknown: true });

  const isFirstSubscribe = !(await Billing.findOne({ where: { userId } }));

  if (TEST_IOS_PURCHASE_RECEIPT !== input.receipt) {
    if (await Billing.findOne({ where: { receipt: input.receipt, userId: { [Op.ne]: userId } } })) {
      res.json({ error: { code: 'receiptAlreadyUsed' } });
      return;
    }
  }

  // Create a billing immediately
  const billing = await Billing.create({
    userId,
    platform: input.platform,
    receipt: input.receipt,
  });

  let result: Awaited<ReturnType<typeof verifySubscription>>;
  try {
    result = await verifySubscription(input);
  } catch (error) {
    logger.error('Failed to verify subscription', error);
    res.json({ error: { code: 'verifySubscriptionFailed' } });
    return;
  }

  const [verification, expirationDate] = result;

  if (expirationDate < Date.now()) {
    res.json({ error: { code: 'subscriptionExpired' } });
    return;
  }

  await billing.update({
    verification,
    expirationDate,
  });

  res.json({ isFirstSubscribe, expirationDate });
});

export default router;
