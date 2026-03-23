import { pick } from 'lodash';
import { Op } from 'sequelize';

import { verifySubscription } from '../../../libs/app-receipt';
import { UnauthorizedError } from '../../../libs/auth';
import { config } from '../../../libs/env';
import logger from '../../../libs/logger';
import { addPointsBadgeWithCatch } from '../../../libs/points-badge';
import Billing from '../../../store/models/billing';
import { MessageType } from '../../../store/models/message';
import { getTranslation } from '../translations';
import { ChatHandle } from '../types';

export const handleCompleteSubscription: ChatHandle<MessageType.CompleteSubscription> = async ({
  message,
  userId,
  input,
  ...args
}) => {
  if (!userId) throw new UnauthorizedError();

  const isFirstSubscribe = !(await Billing.findOne({ where: { userId } }));

  // Check if receipt is already used by another user
  if (await Billing.findOne({ where: { receipt: input.receipt, userId: { [Op.ne]: userId } } })) {
    if (!args.stream) throw new Error(await getTranslation('receiptAlreadyUsed', args.language));
    return {
      type: MessageType.CompleteSubscription,
      data: await getTranslation('receiptAlreadyUsed', args.language),
    };
  }

  // Create a billing record immediately
  const billing = await Billing.create({
    userId,
    platform: input.platform,
    receipt: input.receipt,
  });

  let res: Awaited<ReturnType<typeof verifySubscription>>;
  try {
    res = await verifySubscription(input);
  } catch (error) {
    logger.error('Failed to verify subscription', error);
    if (!args.stream) throw new Error(await getTranslation('verifySubscriptionFailed', args.language));
    return {
      type: MessageType.CompleteSubscription,
      data: await getTranslation('verifySubscriptionFailed', args.language),
    };
  }

  const [verification, expirationDate] = res;

  if (expirationDate < Date.now()) {
    if (!args.stream) throw new Error(await getTranslation('subscriptionExpired', args.language));

    return {
      type: MessageType.CompleteSubscription,
      data: await getTranslation('subscriptionExpired', args.language),
    };
  }

  await billing.update({
    verification,
    expirationDate,
  });

  // Award points badge for first subscription
  if (isFirstSubscribe) {
    const firstSubAction = config.points.actions.firstTimeSubscribe;
    if (firstSubAction) {
      addPointsBadgeWithCatch({ did: userId, ruleId: firstSubAction.ruleId });
    }
  }

  return {
    type: MessageType.CompleteSubscription,
    context: { ...pick(billing, 'id', 'createdAt', 'updatedAt', 'expirationDate') },
    data: await getTranslation('subscribeSuccess', args.language),
    next: undefined,
  };
};
