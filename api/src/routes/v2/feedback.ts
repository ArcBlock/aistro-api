import { auth, user } from '@blocklet/sdk/lib/middlewares';
import { Router } from 'express';
import Joi from 'joi';
import { groupBy } from 'lodash';

import Feedback from '../../store/models/feedback';

const router = Router();

const feedbackQuerySchema = Joi.object<{
  id: string;
}>({
  id: Joi.string().lowercase().required(),
});

router.get('/feedback/status', user(), auth(), async (req, res) => {
  const { did: userId } = req.user!;

  const query = await feedbackQuerySchema.validateAsync(req.query, { stripUnknown: true });

  const feedbacks = Object.values(
    groupBy(
      await Feedback.findAll({
        where: { userId, key: `report-detail-${query.id}` },
        order: [['id', 'DESC']],
      }),
      (i) => i.key,
    ),
  ).map((i) => i[0]!);

  res.json({
    status: feedbacks.find((i) => !i.sectionId),
    sections: Object.fromEntries(feedbacks.filter((i) => i.sectionId).map((i) => [i.sectionId, i])),
  });
});

const feedbackBodySchema = Joi.object<{
  id: string;
  action: 'like' | 'dislike';
  sectionId?: string;
  content?: string;
}>({
  id: Joi.string().lowercase().required(),
  action: Joi.string().valid('like', 'dislike').required(),
  sectionId: Joi.string().empty(['', null]),
  content: Joi.string().empty(['', null]),
});

router.post('/feedback', user(), auth(), async (req, res) => {
  const { did: userId } = req.user!;

  const input = await feedbackBodySchema.validateAsync(req.body, { stripUnknown: true });

  const key = `report-detail-${input.id}` as const;

  const previous = await Feedback.findOne({
    where: { userId, key, sectionId: input.sectionId || null },
    order: [['id', 'DESC']],
  });

  const current =
    !previous || previous.action === 'cancel'
      ? await Feedback.create({ userId, key, action: input.action, sectionId: input.sectionId, content: input.content })
      : previous.action === input.action
        ? await Feedback.create({ userId, key, action: 'cancel', sectionId: input.sectionId, content: input.content })
        : await Feedback.create({
            userId,
            key,
            action: input.action,
            sectionId: input.sectionId,
            content: input.content,
          });

  res.json({
    feedbackStatus: current.status(),
  });
});

export default router;
