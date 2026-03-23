import { auth, user } from '@blocklet/sdk/lib/middlewares';
import { Router } from 'express';
import Joi from 'joi';

import { parseLanguage } from '../libs/language';
import { ensureAdmin } from '../libs/security';
import { createOrUpdatePlatformEndpoint, sendNotification, subscribeTopic, unsubscribeTopic } from '../libs/sns';
import SNSEndpoint from '../store/models/sns-endpoint';
import SNSSubscription from '../store/models/sns-subscription';
import SNSTopic, { SNSTopicType } from '../store/models/sns-topic';

const router = Router();

export interface RegisterNotificationInput {
  platform: 'ios' | 'ios-sandbox' | 'android';
  deviceToken: string;
  utcOffset: number;
  language: string;
}

const registerNotificationInputSchema = Joi.object<RegisterNotificationInput>({
  platform: Joi.string().valid('ios', 'ios-sandbox', 'android').required(),
  deviceToken: Joi.string().required(),
  utcOffset: Joi.number().integer().required(),
  language: Joi.string().required(),
});

router.post('/register', user(), auth(), async (req, res) => {
  const { did: userId } = req.user!;

  const { platform, deviceToken, utcOffset, ...input } = await registerNotificationInputSchema.validateAsync(req.body, {
    stripUnknown: true,
  });

  const language = parseLanguage(input.language);

  const snsEndpoint = await createOrUpdatePlatformEndpoint({
    platform,
    userId,
    token: deviceToken,
  });
  const [endpoint] = await SNSEndpoint.findOrCreate({ where: { userId, platform, deviceToken, snsEndpoint } });

  // Subscribe the user to the default topic based on their timezone and language.
  const sub = await SNSSubscription.findOne({
    where: { userId, endpoint: endpoint.snsEndpoint, topicType: SNSTopicType.Default },
  });
  if (!sub || sub.utcOffset !== utcOffset || sub.language !== language) {
    if (sub) {
      await Promise.all([unsubscribeTopic({ subscriptionArn: sub.subscription }), sub.destroy()]);
    }

    const topic = await SNSTopic.findOrCreateWithArn({ type: SNSTopicType.Default, utcOffset, language });
    const subscription = await subscribeTopic({ topicArn: topic.arn, endpoint: endpoint.snsEndpoint });
    await SNSSubscription.create({
      userId,
      topicArn: topic.arn,
      topicType: topic.type,
      utcOffset: topic.utcOffset,
      language: topic.language,
      endpoint: endpoint.snsEndpoint,
      subscription,
    });
  }

  res.json({});
});

export interface TestNotificationInput {
  deviceToken: string;
  message: {
    APNS?: object;
    GCM?: object;
  };
}

const testNotificationInputSchema = Joi.object<TestNotificationInput>({
  deviceToken: Joi.string().required(),
  message: Joi.object({
    APNS: Joi.object().pattern(Joi.string(), Joi.any()),
    GCM: Joi.object().pattern(Joi.string(), Joi.any()),
  }),
});

router.post('/test', ensureAdmin, async (req, res) => {
  const input = await testNotificationInputSchema.validateAsync(req.body, { stripUnknown: true });

  const endpoints = await SNSEndpoint.findAll({ where: { deviceToken: input.deviceToken } });

  const result = await Promise.all(
    endpoints.map((endpoint) => sendNotification({ targetArn: endpoint.snsEndpoint, message: input.message })),
  );

  res.json(result);
});

export default router;
