import { call } from '@blocklet/sdk/lib/component';
import { auth, component, user } from '@blocklet/sdk/lib/middlewares';
import { Router } from 'express';
import Joi from 'joi';
import pick from 'lodash/pick';
import { Op, Sequelize } from 'sequelize';

import { verifyPurchaseOfReport } from '../../libs/app-receipt';
import { componentIds } from '../../libs/constants';
import { config } from '../../libs/env';
import { ErrorCodes } from '../../libs/error';
import { parseLanguage } from '../../libs/language';
import { addPointsBadgeWithCatch } from '../../libs/points-badge';
import Billing from '../../store/models/billing';
import { ReportType } from '../../store/models/report';
import User from '../../store/models/user';
import { getTranslation } from '../ai/translations';

const router = Router();

// ---------------------------------------------------------------------------
// isAIGNEReportId — inline helper (was in open-graph lib)
// ---------------------------------------------------------------------------
function isAIGNEReportId(
  reportId: string,
): { type: 'synastry' | 'natal' | 'predict'; userId: string; id: string; topic?: string } | undefined {
  const m = reportId.match(/^(?<type>synastry|natal|predict)_(?<userId>[^_]+)_(?<id>[^_]+)(_(?<topic>\w+))?$/);
  if (!m) return undefined;
  const { type, userId, id, topic } = m.groups as any;
  return { type, userId, id, topic };
}

function isTopicLock(type: ReportType, topic: string) {
  return !{
    predict: config.publicPredictTopics,
    natal: config.publicNatalTopics,
    synastry: config.publicSynastryTopics,
    phase: [] as string[],
  }[type].includes(topic.toLowerCase());
}

const getSectionStatusQuerySchema = Joi.object<{
  type: ReportType;
  topic: string;
  id: string;
}>({
  type: Joi.string().valid('predict', 'natal', 'synastry', 'phase').required(),
  topic: Joi.string().required(),
  id: Joi.string().required(),
});

router.get('/report-detail-status', user(), component.verifySig, async (req, res) => {
  const userId = (req.query.userId as string) || req.user?.did;
  if (!userId) throw new Error('req.user.did is required');

  const query = await getSectionStatusQuerySchema.validateAsync(req.query, { stripUnknown: true });

  const [, isVip] = await Promise.all([
    User.findByPk(userId, { rejectOnEmpty: new Error('User not found') }),
    !!(await Billing.isUserSubAvailable({ userId })),
  ]);

  const purchased = await Billing.isPurchased({
    userId,
    purchaseTargetId: query.id,
  });

  res.json({
    lock: (isVip ? false : isTopicLock(query.type, query.topic)) && !purchased,
    purchased,
  });
});

const purchaseReportDetailBodySchema = Joi.object<{
  platform: 'ios' | 'android';
  receipt: string;
  transactionId: string;
  id: string;
}>({
  platform: Joi.string().valid('ios', 'android').required(),
  receipt: Joi.string().required(),
  transactionId: Joi.string().required(),
  id: Joi.string().required(),
});

router.post('/report-detail-purchase', user(), auth(), async (req, res) => {
  const { did: userId } = req.user!;

  const input = await purchaseReportDetailBodySchema.validateAsync(req.body, { stripUnknown: true });

  const verification = await verifyPurchaseOfReport({
    platform: input.platform,
    receipt: input.receipt,
    transactionId: input.transactionId,
  });

  const targetId = input.id;

  const billing = await Billing.findOne({
    where: { platform: input.platform, transactionId: input.transactionId },
  });
  if (billing) {
    // NOTE: 多次使用同一个 receipt/transactionId 验证（当作成功）
    if (billing.purchaseTargetId === targetId && billing.userId === userId) {
      res.json({});
      return;
    }

    res.status(500).json({
      error: {
        code: ErrorCodes.ReceiptAlreadyUsed,
        message: 'receipt already used',
      },
    });
    return;
  }

  if (await Billing.findOne({ where: { userId, purchaseTargetId: targetId } })) {
    res.status(500).json({
      error: {
        code: ErrorCodes.ReportAlreadyUnlocked,
        message: 'Report already unlocked',
      },
    });
    return;
  }

  await Billing.create({
    platform: input.platform,
    receipt: input.receipt,
    userId,
    purchaseTargetId: targetId,
    transactionId: input.transactionId,
    verification,
  });

  res.json({});
});

const redeemReportDetailBodySchema = Joi.object<{
  id: string;
}>({
  id: Joi.string().required(),
});

router.post('/report-detail-redeem', user(), auth(), async (req, res) => {
  const { did: userId } = req.user!;

  const input = await redeemReportDetailBodySchema.validateAsync(req.body, { stripUnknown: true });

  if (await Billing.findOne({ where: { userId, purchaseTargetId: input.id } })) {
    res.status(500).json({
      error: {
        code: ErrorCodes.ReportAlreadyUnlocked,
        message: 'Report already unlocked',
      },
    });
    return;
  }

  const { redeemReport } = config.points.consume;
  if (!redeemReport) throw new Error('Missing redeem report configuration');

  try {
    const { data } = await call({
      name: componentIds.pointUp,
      path: '/api/consume-point-cc',
      data: { ruleId: redeemReport.ruleId, userDID: userId },
    });

    await Billing.create({
      platform: 'unknown',
      receipt: data.data.id,
      userId,
      purchaseTargetId: input.id,
      verification: data,
    });
  } catch (error: any) {
    const message = error.response?.data?.message;
    if (message) {
      throw new Error(message);
    }
    throw error;
  }

  if (config.points.badges.firstTimeRedeemReportWithPoints) {
    addPointsBadgeWithCatch({ did: userId, ruleId: config.points.badges.firstTimeRedeemReportWithPoints });
  }

  res.json({});
});

const purchasedQuerySchema = Joi.object<{
  ids?: string[];
  language?: string;
  page: number;
  size: number;
}>({
  ids: Joi.array().items(Joi.string()),
  language: Joi.string().empty([null, '']),
  page: Joi.number().integer().min(0).default(0),
  size: Joi.number().integer().min(1).default(20),
});

router.get('/report-details-purchased', user(), auth(), async (req, res) => {
  const { did: userId } = req.user!;

  const query = await purchasedQuerySchema.validateAsync(
    { ...req.query, ids: typeof req.query.ids === 'string' ? req.query.ids.split(',').filter(Boolean) : [] },
    { stripUnknown: true },
  );

  const language = parseLanguage(query.language);

  let result: { rows: Billing[]; count: number };

  if (query.ids?.length) {
    result = await Billing.findAndCountAll({
      where: {
        userId,
        purchaseTargetId: { [Op.in]: query.ids },
      },
      order: [['id', 'DESC']],
      offset: query.page * query.size,
      limit: query.size,
    });
  } else {
    const purchasedv1 = await Billing.findAndCountAll({
      where: { userId, purchaseTargetId: { [Op.not]: null } },
      order: [['id', 'DESC']],
      offset: query.page * query.size,
      limit: query.size,
      include: [
        {
          association: 'reportDetail',
          right: true,
          required: true,
          include: [
            {
              association: 'report',
              right: true,
              required: true,
            },
          ],
        },
      ],
    });

    const regex = ['synastry_%_%_%', 'natal_%_%_%', 'predict_%_%_%'];

    const purchasedv2 = await Billing.findAndCountAll({
      where: {
        userId,
        [Op.or]: regex.map((i) => {
          const m = `'${i.replace(/_/g, '\\_')}'`;
          return {
            purchaseTargetId: {
              [Op.like]:
                Billing.sequelize?.getDialect() === 'sqlite'
                  ? Sequelize.literal(`${m} ESCAPE '\\'`)
                  : Sequelize.literal(m),
            },
          };
        }),
      },
      order: [['id', 'DESC']],
      offset: Math.max(0, query.page * query.size - purchasedv1.count),
      limit: query.size,
    });

    result = {
      count: purchasedv1.count + purchasedv2.count,
      rows: [
        ...purchasedv1.rows.map((i) => i.toJSON() as any),
        ...(
          await Promise.all(
            purchasedv2.rows.slice(0, query.size - purchasedv1.rows.length).map(async (i) => {
              if (!i.purchaseTargetId) throw new Error('purchaseTargetId is required');

              const reportId = isAIGNEReportId(i.purchaseTargetId);
              if (!reportId?.topic) return null;

              const [t, topic] = await Promise.all([
                getTranslation(`${reportId.type}ReportTitle`, language, config.defaultLanguage),
                getTranslation(reportId.topic, language, config.defaultLanguage),
              ]);

              let title = t.replace('{topic}', topic);

              const reportDetail = {
                id: i.purchaseTargetId,
                reportId: `${reportId.type}_${reportId.id}`,
                meta: {
                  type: reportId.type,
                  topic: reportId.topic,
                },
              };

              if (reportId.type === 'predict') {
                // NOTE: In aistro-ai, AIGNE memory lookup is not available.
                // Date formatting is skipped for legacy predict report titles.
                title = title.replace('{date}', '');
              }

              return {
                ...pick(i, 'id', 'createdAt', 'userId', 'transactionId'),
                reportDetail,
                title,
              };
            }),
          )
        ).filter((i): i is NonNullable<typeof i> => !!i),
      ],
    };
  }

  res.json({
    rows: result.rows,
    count: result.count,
  });
});

export default router;
