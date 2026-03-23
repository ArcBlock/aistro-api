import { auth, user } from '@blocklet/sdk/lib/middlewares';
import { Router } from 'express';
import equal from 'fast-deep-equal';
import Joi from 'joi';
import { omitBy, uniqBy } from 'lodash';

import { authService } from '../libs/auth';
import { randomPredictImage } from '../libs/blender';
import { config } from '../libs/env';
import { BIRTH_DATE_SCHEMA, BIRTH_PLACE_SCHEMA, HOROSCOPE_DATA_SCHEMA } from '../libs/horoscope';
import { getLanguage } from '../libs/language';
import logger from '../libs/logger';
import { addPointsBadgeWithCatch } from '../libs/points-badge';
import { deletePlatformEndpoint } from '../libs/sns';
import Billing from '../store/models/billing';
import Feedback from '../store/models/feedback';
import Message, { MessageRole, MessageType } from '../store/models/message';
import Report from '../store/models/report';
import ReportDetail from '../store/models/report-detail';
import SNSEndpoint from '../store/models/sns-endpoint';
import SNSSubscription from '../store/models/sns-subscription';
import User, {
  DEFAULT_PREDICT_TOPICS,
  DEFAULT_PREDICT_TOPICS_SET,
  HoroscopeChartData,
  HoroscopeStars,
} from '../store/models/user';
import { handleNatalReport } from './ai/handlers/reports';

const router = Router();

router.get('/', user(), auth(), async (req, res) => {
  const { did: userId } = req.user!;

  res.json(await User.getUserDetail(userId));
});

const patchUserBodySchema = Joi.object<{
  name?: string;
  email?: string;
  avatar?: string;
  birthDate?: string;
  birthPlace?: {
    longitude: number;
    latitude: number;
    address: string;
  };
  horoscope?: { stars: HoroscopeStars; chartData: HoroscopeChartData };
  predictTopics?: { topic: string; visible?: boolean }[];
}>({
  name: Joi.string().max(50).empty(null),
  email: Joi.string().max(100).email().empty(null),
  avatar: Joi.string().max(300).empty(null),
  birthDate: BIRTH_DATE_SCHEMA.empty(''),
  birthPlace: BIRTH_PLACE_SCHEMA,
  horoscope: HOROSCOPE_DATA_SCHEMA,
  predictTopics: Joi.array()
    .items(
      Joi.object({
        topic: Joi.string()
          .pattern(/^[^-/]+$/)
          .message('patchUser.predictTopics.topic.pattern')
          .trim()
          .max(100)
          .truncate()
          .required(),
      }).when(
        Joi.object({ topic: Joi.valid(...[...DEFAULT_PREDICT_TOPICS_SET].map((i) => i.toUpperCase())) }).unknown(),
        {
          then: Joi.object({
            visible: Joi.boolean().default(true),
          }),
        },
      ),
    )
    .min(1)
    .message('patchUser.predictTopics.min')
    .max(10)
    .message('patchUser.predictTopics.max'),
});

router.patch('/', user(), auth(), async (req, res) => {
  const { did: userId } = req.user!;

  const [user] = await User.findOrCreate({ where: { id: userId } });

  const { name, avatar, ...input } = await patchUserBodySchema.validateAsync(req.body, {
    stripUnknown: true,
  });

  const needRegenerateNatalReport =
    (input.birthDate || input.birthPlace || input.horoscope) &&
    (input.birthDate !== user.birthDate || !equal(input.birthPlace, user.birthPlace));

  if (input.predictTopics) {
    input.predictTopics = uniqBy(
      [...input.predictTopics, ...DEFAULT_PREDICT_TOPICS.map((i) => ({ ...i, visible: false }))],
      (v) => v.topic.toLowerCase(),
    ).map((i) => ({
      ...i,
      image:
        user.predictTopics.find((j) => i.topic.toLowerCase() === j.topic.toLowerCase())?.image ||
        randomPredictImage(false, i.topic),
    }));
  }

  await Promise.all([
    user.updateUserInfo(input),
    (name || avatar) &&
      authService.switchProfile(
        userId,
        omitBy({ avatar, fullName: name }, (k) => k === undefined),
      ),
  ]);

  if (config.points.badges.firstTimeCompleteProfile) {
    addPointsBadgeWithCatch({ did: user.id, ruleId: config.points.badges.firstTimeCompleteProfile });
  }

  if (needRegenerateNatalReport) {
    const language = getLanguage(req);
    const { birthDate, birthPlace } = user;
    if (birthDate && birthPlace) {
      const message = await Message.create({ userId: user.id, type: MessageType.NatalReport, role: MessageRole.ai });

      const result = await handleNatalReport({
        language,
        message,
        input: {
          birthDate,
          birthPlace,
          horoscope: await user.getHoroscopeOrGenerate(),
        },
      });

      await message.update({
        type: result.type,
        actions: result.actions,
        input: result.input,
        next: result.next,
        img: result.img,
        title: result.title,
        report: result.report,
        parameters: { language, ...result.parameters },
      });
    }
  }

  res.json(await User.getUserDetail(userId));
});

router.get('/billing', user(), auth(), async (req, res) => {
  const { did: userId } = req.user!;

  const billing = await Billing.getLatestSubscription({ userId });

  res.json(billing);
});

router.delete('/', user(), auth(), async (req, res) => {
  const { did: userId } = req.user!;

  await Promise.all([
    SNSEndpoint.findAll({ where: { userId } })
      .then((endpoints) =>
        Promise.all(endpoints.flatMap((i) => [deletePlatformEndpoint({ endpointArn: i.snsEndpoint }), i.destroy()])),
      )
      .catch((error) => {
        logger.error('delete account: delete sns endpoints error', error);
      }),
    SNSSubscription.destroy({ where: { userId } }),
    Message.destroy({ where: { userId } }),
    User.destroy({ where: { id: userId } }),
    Report.destroy({ where: { userId } }),
    ReportDetail.destroy({ where: { userId } }),
    Feedback.destroy({ where: { userId } }),
  ]);

  res.json({});
});

export interface LogoutInput {
  deviceToken?: string;
}

const logoutInputSchema = Joi.object<LogoutInput>({
  deviceToken: Joi.string().empty(Joi.valid('', null)),
});

router.post('/logout', user(), auth(), async (req, res) => {
  const { did: userId } = req.user!;

  const input = await logoutInputSchema.validateAsync(req.body, { stripUnknown: true });
  if (input.deviceToken) {
    try {
      const endpoints = await SNSEndpoint.findAll({ where: { userId, deviceToken: input.deviceToken } });
      await Promise.all(
        endpoints.flatMap((i) => [deletePlatformEndpoint({ endpointArn: i.snsEndpoint }), i.destroy()]),
      );
    } catch (error) {
      logger.error('logout: delete sns endpoints error', error);
    }
  }

  res.json({});
});

export default router;
