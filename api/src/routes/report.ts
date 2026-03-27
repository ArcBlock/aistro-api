import { call } from '@blocklet/sdk/lib/component';
import { auth, user } from '@blocklet/sdk/lib/middlewares';
import { createHash, randomInt } from 'crypto';
import dayjs from 'dayjs';
import 'dayjs/locale/ja';
import 'dayjs/locale/zh';
import { Router } from 'express';
import equal from 'fast-deep-equal';
import Joi from 'joi';
import { cloneDeep, differenceBy, get, isNil, merge, omit, pick, set } from 'lodash';
import { Op } from 'sequelize';

import { selectReportImage } from '../ai/image';
import { invokeText } from '../ai/invoke';
import { summarize, translate } from '../ai/utils';
import { verifyPurchaseOfReport } from '../libs/app-receipt';
import { authService } from '../libs/auth';
import { componentIds } from '../libs/constants';
import env, { Runtime, config } from '../libs/env';
import { ErrorCodes } from '../libs/error';
import getHoroscope, {
  BIRTH_DATE_SCHEMA,
  BIRTH_PLACE_SCHEMA,
  DATE_SCHEMA,
  HOROSCOPE_DATA_SCHEMA,
  Stars,
  getHoroscopeData,
  getHoroscopeRetrogradeStars,
  getHoroscopeString,
  phase,
} from '../libs/horoscope';
import { parseLanguage } from '../libs/language';
import logger from '../libs/logger';
import { addPointsBadgeWithCatch } from '../libs/points-badge';
import { sequelize } from '../store/models';
import Billing from '../store/models/billing';
import BuiltinAnswer from '../store/models/builtin-answer';
import Feedback from '../store/models/feedback';
import InviteFriend from '../store/models/invite-friend';
import PredictTopic from '../store/models/predict-topic';
import Report, { PredictReportDateType, ReportType, UserHoroscopeInfo } from '../store/models/report';
import ReportDetail, { nextReportDetailId } from '../store/models/report-detail';
import User, { HoroscopeChartData, HoroscopeStars } from '../store/models/user';
import { getTranslation } from './ai/translations';
import { PREDICT_SCORE_MAX, PREDICT_SCORE_MIN, SYNASTRY_STARS } from './ai/types';

const getPredictScoreCategory = (score: number) => {
  if (score >= 65) {
    return {
      name: 'powerIn' as const,
      icon: get(config.reportIcons, 'predict.powerIn'),
    };
  }

  if (score >= 40) {
    return {
      name: 'pressureIn' as const,
      icon: get(config.reportIcons, 'predict.pressureIn'),
    };
  }

  return {
    name: 'troubleIn' as const,
    icon: get(config.reportIcons, 'predict.troubleIn'),
  };
};

const router = Router();

const purchasedQuerySchema = Joi.object<{
  language?: string;
  page: number;
  size: number;
}>({
  language: Joi.string().empty([null, '']),
  page: Joi.number().integer().min(0).default(0),
  size: Joi.number().integer().min(1).default(20),
});

router.get('/purchased', user(), auth(), async (req, res) => {
  const { did: userId } = req.user!;

  const query = await purchasedQuerySchema.validateAsync(req.query, { stripUnknown: true });
  const language = parseLanguage(query.language);

  const { rows, count } = await Billing.findAndCountAll({
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

  res.json({
    rows: await Promise.all(
      rows.map(async (i) => {
        const reportDetail = (i as any).reportDetail as ReportDetail;
        const report = (reportDetail as any).report as Report;

        const [t, topic] = await Promise.all([
          getTranslation(`${report.meta.type}ReportTitle`, language, config.defaultLanguage),
          getTranslation(reportDetail.meta.topic, language, config.defaultLanguage),
        ]);

        let title = t.replace('{topic}', topic);

        if (report.meta.type === 'predict') {
          title = title.replace('{date}', dayjs(report.meta.date).locale(language).format('MMMM,D'));
        }

        return {
          ...pick(
            i,
            'id',
            'createdAt',
            'userId',
            'transactionId',
            'reportDetail.id',
            'reportDetail.reportId',
            'reportDetail.meta',
          ),
          title,
        };
      }),
    ),
    count,
  });
});

const getRandomTopicsQuerySchema = Joi.object<{ language?: string }>({
  language: Joi.string().empty(['', null]),
});

router.get('/predict/topics/suggestions/random', async (req, res) => {
  const query = await getRandomTopicsQuerySchema.validateAsync(req.query, { stripUnknown: true });
  const language = parseLanguage(query.language);

  const topics = await PredictTopic.findAll({
    where: { language },
    order: sequelize.random(),
    limit: 10,
  });
  res.json({ topics });
});

export const HOROSCOPE_DATA_SCHEMA_WITH_DEFAULT_HOROSCOPE = HOROSCOPE_DATA_SCHEMA.default((parent: any) => {
  return getHoroscopeData(getHoroscope(parent));
});

type GenerateReportInput = { language?: string } & (
  | {
      type: 'predict';
      user: {
        birthDate: string;
        birthPlace: { address: string; longitude: number; latitude: number };
        horoscope: { stars: HoroscopeStars; chartData: HoroscopeChartData };
      };
      date: string;
      dateHoroscope: { stars: HoroscopeStars; chartData: HoroscopeChartData };
      dateType: PredictReportDateType;
    }
  | {
      type: 'natal';
      user: {
        birthDate: string;
        birthPlace: { address: string; longitude: number; latitude: number };
        horoscope: { stars: HoroscopeStars; chartData: HoroscopeChartData };
      };
    }
  | {
      type: 'synastry';
      user: {
        birthDate: string;
        birthPlace: { address: string; longitude: number; latitude: number };
        horoscope: { stars: HoroscopeStars; chartData: HoroscopeChartData };
      };
      secondaryUser: {
        birthDate: string;
        birthPlace: { address: string; longitude: number; latitude: number };
        horoscope: { stars: HoroscopeStars; chartData: HoroscopeChartData };
      };
    }
  | {
      type: 'phase';
      date: string;
      user: {
        birthDate: string;
        birthPlace: { address: string; longitude: number; latitude: number };
        horoscope: { stars: HoroscopeStars; chartData: HoroscopeChartData };
      };
    }
);

export const getReportInputSchema = Joi.object<GenerateReportInput>({
  type: Joi.string().valid('predict', 'natal', 'synastry', 'phase').required(),
  language: Joi.string().empty(['', null]),
})
  .when(Joi.object({ type: 'predict' }).unknown(), {
    then: Joi.object({
      user: Joi.object({
        birthDate: BIRTH_DATE_SCHEMA.required(),
        birthPlace: BIRTH_PLACE_SCHEMA.required(),
        horoscope: HOROSCOPE_DATA_SCHEMA_WITH_DEFAULT_HOROSCOPE,
      }).required(),
      date: DATE_SCHEMA.required(),
      dateHoroscope: HOROSCOPE_DATA_SCHEMA.default((parent: any) => {
        return getHoroscopeData(getHoroscope({ birthDate: parent.date, birthPlace: parent.user.birthPlace }));
      }),
      dateType: Joi.string().empty([null, '']).valid('date', 'week', 'year').default('date'),
    }),
  })
  .when(Joi.object({ type: 'natal' }).unknown(), {
    then: Joi.object({
      user: Joi.object({
        birthDate: BIRTH_DATE_SCHEMA.required(),
        birthPlace: BIRTH_PLACE_SCHEMA.required(),
        horoscope: HOROSCOPE_DATA_SCHEMA_WITH_DEFAULT_HOROSCOPE,
      }).required(),
    }),
  })
  .when(Joi.object({ type: 'synastry' }).unknown(), {
    then: Joi.object({
      user: Joi.object({
        birthDate: BIRTH_DATE_SCHEMA.required(),
        birthPlace: BIRTH_PLACE_SCHEMA.required(),
        horoscope: HOROSCOPE_DATA_SCHEMA_WITH_DEFAULT_HOROSCOPE,
      }).required(),
      secondaryUser: Joi.object({
        birthDate: BIRTH_DATE_SCHEMA.required(),
        birthPlace: BIRTH_PLACE_SCHEMA.required(),
        horoscope: HOROSCOPE_DATA_SCHEMA_WITH_DEFAULT_HOROSCOPE,
      }).required(),
    }),
  })
  .when(Joi.object({ type: 'phase' }).unknown(), {
    then: Joi.object({
      date: DATE_SCHEMA.required(),
      user: Joi.object({
        birthDate: BIRTH_DATE_SCHEMA.required(),
        birthPlace: BIRTH_PLACE_SCHEMA.required(),
        horoscope: HOROSCOPE_DATA_SCHEMA_WITH_DEFAULT_HOROSCOPE,
      }).required(),
    }),
  });

router.post('/:type(predict|natal|synastry|phase)', user(), auth(), async (req, res) => {
  // NOTE: 有一个版本的客户端传过来的 `user.horoscope` 传错了（实际传了 dateHoroscope` 的数据），
  // 所以这里把错误的值去掉，自动重新计算
  if (req.params.type === 'predict' && !req.body.dateHoroscope && req.body.user) {
    req.body.user.horoscope = undefined;
  }

  const input = await getReportInputSchema.validateAsync(
    { ...req.body, language: req.query.language || req.body.language, type: req.params.type },
    { stripUnknown: true },
  );

  const { did: userId } = req.user!;

  const language = parseLanguage(input.language);

  logger.debug('report time usage: before generateReport', {
    userId,
  });
  const { context, report, details, template, isVip, purchased } = await generateReport({ ...input, userId, language });
  logger.debug('report time usage: after generateReport', {
    userId,
  });

  const detailMap = Object.fromEntries(details?.map((i) => [i.id, i]) ?? []);

  const obj = await mergeResult(
    context,
    language,
    template._runtime?.fields ?? [],
    report.meta._runtime?.fields ?? [],
    isVip,
  );

  logger.debug('report time usage: before res.json', { userId });

  res.json(
    merge(
      {
        id: report.id,
        error: report.error,
        scores:
          report.type === 'predict'
            ? [
                {
                  icon: get(config.reportIcons, 'predict.powerIn'),
                  title: await getTranslation('powerIn', language, config.defaultLanguage),
                  topics: report.sections
                    .filter((i) => getPredictScoreCategory(i.score).name === 'powerIn')
                    .map((i) => ({ id: i.id, title: i.topic })),
                },
                {
                  icon: get(config.reportIcons, 'predict.pressureIn'),
                  title: await getTranslation('pressureIn', language, config.defaultLanguage),
                  topics: report.sections
                    .filter((i) => getPredictScoreCategory(i.score).name === 'pressureIn')
                    .map((i) => ({ id: i.id, title: i.topic })),
                },
                {
                  icon: get(config.reportIcons, 'predict.troubleIn'),
                  title: await getTranslation('troubleIn', language, config.defaultLanguage),
                  topics: report.sections
                    .filter((i) => getPredictScoreCategory(i.score).name === 'troubleIn')
                    .map((i) => ({ id: i.id, title: i.topic })),
                },
              ].filter((i) => i.topics.length > 0)
            : undefined,
        sections: report.sections.map((i) => {
          const detail = detailMap[i.id];

          return {
            id: i.id,
            content: 'Generating...',
            lock: (isVip ? false : isTopicLock(report!.type, i.topic)) && !purchased[i.id],
            purchased: purchased[i.id],
            inapp: {
              android: { productId: config.billing.android.reportDetailProductId },
              ios: { productId: config.billing.ios.reportDetailProductId },
            },
            generateStatus: isVip && detail?.generateStatus !== 'finished' ? 'generating' : detail?.generateStatus,
          };
        }),
        generateStatus: report.generateStatus,
      },
      obj,
    ),
  );

  logger.debug('report time usage: after res.json', { userId });
});

router.get('/:reportId', user(), async (req, res) => {
  const { reportId } = req.params;
  if (!reportId) throw new Error('Missing required params `reportId`');

  const inviteFriend = await InviteFriend.findOne({
    where: { reportId },
    rejectOnEmpty: new Error('Invite not found'),
  });

  const getAvatarUrl = (url?: string) => (url?.startsWith('/') ? `${env.appUrl}${url}` : url);
  const { fromUserId, toUserId, status, friendBirthDate, friendBirthPlace } = inviteFriend;
  // if report is invited by other, only two person can watch it
  // if invite friend is delete by user, from or to may be empty, but status is 'linked'
  if (status === 'linked' && (!req.user?.did || (req.user?.did !== fromUserId && req.user?.did !== toUserId))) {
    res.json({ code: 403, message: 'no permission' });
    return;
  }

  const authUser = (await authService.getUser(fromUserId)).user;
  const language = parseLanguage((req.query.language as string) || 'en');

  // If reportId has no matching Report record (e.g. legacy synastry-invite-* format), create one now
  let report = await Report.findByPk(reportId);
  if (!report) {
    const fromUser = await User.findByPk(fromUserId, {
      rejectOnEmpty: new Error(`User not found ${fromUserId}`),
    });
    const userHoroscope = getHoroscopeData(
      getHoroscope({ birthDate: fromUser.birthDate!, birthPlace: fromUser.birthPlace! }),
    );
    const friendHoroscope = getHoroscopeData(
      getHoroscope({ birthDate: friendBirthDate!, birthPlace: friendBirthPlace! }),
    );
    const { report: newReport } = await generateReport({
      userId: fromUserId,
      language,
      type: 'synastry' as const,
      user: {
        birthDate: fromUser.birthDate!,
        birthPlace: fromUser.birthPlace!,
        horoscope: userHoroscope,
      },
      secondaryUser: {
        birthDate: friendBirthDate!,
        birthPlace: friendBirthPlace!,
        horoscope: friendHoroscope,
      },
      inviteId: inviteFriend.id,
    });
    await InviteFriend.update({ reportId: newReport.id }, { where: { id: inviteFriend.id } });
    report = newReport;
  }

  const input = await getReportInputSchema.validateAsync(
    {
      user: report.meta.user,
      secondaryUser: (report.meta as any).secondaryUser,
      language,
      type: report.type,
    },
    { stripUnknown: true },
  );

  const {
    context,
    report: updatedReport,
    details,
    template,
    isVip,
    purchased,
  } = await generateReport({
    ...input,
    userId: fromUserId,
    language,
    inviteId: inviteFriend.id,
  });

  const detailMap = Object.fromEntries(details?.map((i) => [i.id, i]) ?? []);

  const obj = await mergeResult(
    context,
    language,
    template._runtime?.fields ?? [],
    updatedReport.meta._runtime?.fields ?? [],
    isVip,
  );

  res.json(
    merge(
      {
        id: updatedReport.id,
        error: updatedReport.error,
        user: {
          name: authUser?.fullName,
          avatar: getAvatarUrl(authUser?.avatar),
        },
        friend: {
          name: inviteFriend?.friendName,
          avatar: sample(config.avatars.pool),
        },
        parameters: {
          userId: fromUserId,
          user: report.meta.user,
          secondaryUser: (report.meta as any).secondaryUser,
        },
        type: 13,
        sections: updatedReport.sections.map((i) => {
          const detail = detailMap[i.id];
          return {
            id: i.id,
            content: 'Generating...',
            lock: (isVip ? false : isTopicLock(updatedReport.type, i.topic)) && !purchased[i.id],
            purchased: purchased[i.id],
            inapp: {
              android: { productId: config.billing.android.reportDetailProductId },
              ios: { productId: config.billing.ios.reportDetailProductId },
            },
            generateStatus: isVip && detail?.generateStatus !== 'finished' ? 'generating' : detail?.generateStatus,
          };
        }),
        generateStatus: updatedReport.generateStatus,
      },
      obj,
    ),
  );
});

router.get('/:reportId/details/status', user(), auth(), async (req, res) => {
  const { did: userId } = req.user!;

  const { reportId } = req.params;
  if (!reportId) throw new Error('Missing required params `reportId`');

  const report = await Report.findByPk(reportId, { rejectOnEmpty: new Error(`Report not found ${reportId}`) });
  const detailIds = report.sections.map((i) => i.id);

  const isVip = !!(await Billing.isUserSubAvailable({ userId }));

  const details = detailIds.length ? await ReportDetail.findAll({ where: { id: { [Op.in]: detailIds } } }) : [];

  const purchased = await Billing.isPurchased({ userId, purchaseTargetId: report.sections.map((i) => i.id) });

  res.json({
    sections: details.map((i) => ({
      id: i.id,
      generateStatus: i.generateStatus,
      lock: (isVip ? false : isTopicLock(report!.type, i.meta.topic)) && !purchased[i.id],
      purchased: purchased[i.id],
    })),
  });
});

const getReportDetailQuerySchema = Joi.object<{ language?: string }>({
  language: Joi.string().empty(['', null]),
});

router.get('/details/:reportDetailId', user(), async (req, res) => {
  const { reportDetailId } = req.params;
  logger.info('[report-details] request', { reportDetailId, userId: req.user?.did, query: req.query });
  if (!reportDetailId) throw new Error('Missing required params `reportDetailId`');

  const query = await getReportDetailQuerySchema.validateAsync(req.query, {
    stripUnknown: true,
  });

  const language = parseLanguage(query.language);

  const reportDetail = await ReportDetail.findByPk(reportDetailId, {
    rejectOnEmpty: new Error(`Report detail not found ${reportDetailId}`),
  });
  const report = await Report.findByPk(reportDetail.reportId, {
    rejectOnEmpty: new Error(`Predict report not found ${reportDetail.reportId}`),
  });

  const [, isVip] = await Promise.all([
    User.findByPk(reportDetail.userId, { rejectOnEmpty: new Error('User not found') }),
    !!(await Billing.isUserSubAvailable({ userId: reportDetail.userId })),
  ]);

  const purchased = await Billing.isPurchased({
    userId: reportDetail.userId,
    purchaseTargetId: report.sections.map((i) => i.id),
  });

  const lock = (isVip ? false : isTopicLock(report.type, reportDetail.meta.topic)) && !purchased[reportDetailId];

  const template =
    {
      predict: () => config.predictReportTemplate,
      natal: () => config.natalReportTemplate,
      synastry: () => config.synastryReportTemplate,
      phase: () => config.phaseReportTemplate,
    }[report.type]() ?? {};

  const context = new Context({
    language,
    report,
    reportDetail,
    user: report.meta.user,
    secondaryUser: report.meta.type === 'synastry' ? report.meta.secondaryUser : undefined,
  });

  logger.info('[report-details] loaded', {
    reportDetailId,
    reportId: report.id,
    reportType: report.type,
    topic: reportDetail.meta.topic,
    generateStatus: reportDetail.generateStatus,
    isVip,
    lock,
  });

  if (!lock) {
    generateDetailIfNeeded({ report, reportDetail, context, template, language, sendNotification: true });
  }

  const sections = Object.fromEntries(
    await Promise.all(
      template._details_?.sections.map(async (section: any) => {
        const sec = reportDetail.data?.sections.find((i: any) => i.sectionId === section._id);

        return [
          section._id,
          {
            id: sec?.id,
            ...(await mergeResult(context, language, section._runtime?.fields ?? [], sec?.result ?? [], isVip)),
            feedbackStatus: req.user
              ? await Feedback.reportDetailStatus(req.user.did, reportDetail.id, sec?.id)
              : undefined,
          },
        ];
      }) ?? [],
    ),
  );

  const reportDetails = await ReportDetail.findAll({ where: { id: { [Op.in]: report.sections.map((i) => i.id) } } });

  const detailMap = Object.fromEntries(reportDetails.map((i) => [i.id, i]));

  const detailsRuntime = await mergeResult(
    context,
    language,
    template._runtime?.fields ?? [],
    report.meta._runtime?.fields ?? [],
    isVip,
  );

  const detailsMerged = merge(
    {
      sections: report.sections.map((i) => {
        const detail = detailMap[i.id];

        return {
          id: i.id,
          content: 'Generating...',
          lock: (isVip ? false : isTopicLock(report!.type, i.topic)) && !purchased[i.id],
          purchased: purchased[i.id],
          inapp: {
            android: { productId: config.billing.android.reportDetailProductId },
            ios: { productId: config.billing.ios.reportDetailProductId },
          },
          generateStatus: detail?.generateStatus,
        };
      }),
    },
    detailsRuntime,
  ).sections;

  const result = await mergeResult(
    context,
    language,
    template._details_?._runtime?.fields ?? [],
    reportDetail.data?._runtime?.fields ?? [],
    isVip,
  );

  logger.info('[report-details] responding', {
    reportDetailId,
    generateStatus: reportDetail.generateStatus,
    sectionsCount: template._details_?.sections?.length ?? 0,
  });

  res.json(
    merge(
      {
        id: reportDetail.id,
        error: reportDetail.error,
        generateStatus: reportDetail.generateStatus,
        feedbackStatus: req.user?.did ? await Feedback.reportDetailStatus(req.user.did, reportDetail.id) : undefined,
        lock,
        purchased: purchased[reportDetail.id],
        sections: template._details_?.sections.map((section: any) => {
          return merge(
            {
              ...omit(section, '_id', '_runtime'),
            },
            sections[section._id] ?? {},
          );
        }),

        details: detailsMerged,
      },
      result,
    ),
  );
});

const purchaseReportDetailBodySchema = Joi.object<{
  platform: 'ios' | 'android';
  receipt: string;
  transactionId: string;
  language?: string;
}>({
  platform: Joi.string().valid('ios', 'android').required(),
  receipt: Joi.string().required(),
  transactionId: Joi.string().required(),
  language: Joi.string().empty(['', null]),
});

router.post('/details/:reportDetailId/purchase', user(), auth(), async (req, res) => {
  const { did: userId } = req.user!;

  const { reportDetailId } = req.params;
  if (!reportDetailId) throw new Error('Missing required params `reportDetailId`');

  const input = await purchaseReportDetailBodySchema.validateAsync(
    { ...req.body, language: req.query.language },
    { stripUnknown: true },
  );

  const language = parseLanguage(input.language);

  const reportDetail = await ReportDetail.findByPk(reportDetailId, {
    rejectOnEmpty: new Error(`Report detail not found ${reportDetailId}`),
  });
  const report = await Report.findByPk(reportDetail.reportId, {
    rejectOnEmpty: new Error(`Predict report not found ${reportDetail.reportId}`),
  });
  if (report.userId !== userId) throw new Error('You are not authorized to access this report');

  const verification = await verifyPurchaseOfReport({
    platform: input.platform,
    receipt: input.receipt,
    transactionId: input.transactionId,
  });

  const billing = await Billing.findOne({ where: { platform: input.platform, transactionId: input.transactionId } });
  if (billing) {
    // NOTE: 多次使用同一个 receipt/transactionId 验证（当作成功）
    if (billing.purchaseTargetId === reportDetailId) {
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

  if (await Billing.findOne({ where: { userId, purchaseTargetId: reportDetail.id } })) {
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
    purchaseTargetId: reportDetailId,
    transactionId: input.transactionId,
    verification,
  });

  const template =
    {
      predict: () => config.predictReportTemplate,
      natal: () => config.natalReportTemplate,
      synastry: () => config.synastryReportTemplate,
      phase: () => config.phaseReportTemplate,
    }[report.type]() ?? {};

  const context = new Context({
    language,
    report,
    reportDetail,
    user: report.meta.user,
    secondaryUser: report.meta.type === 'synastry' ? report.meta.secondaryUser : undefined,
  });

  generateDetailIfNeeded({ report, reportDetail, context, template, language, sendNotification: true });

  res.json({});
});

router.post('/details/:reportDetailId/redeem', user(), auth(), async (req, res) => {
  const { did: userId } = req.user!;

  const { reportDetailId } = req.params;
  if (!reportDetailId) throw new Error('Missing required params `reportDetailId`');

  const language = parseLanguage(req.query.language as any);

  const reportDetail = await ReportDetail.findByPk(reportDetailId, {
    rejectOnEmpty: new Error(`Report detail not found ${reportDetailId}`),
  });
  const report = await Report.findByPk(reportDetail.reportId, {
    rejectOnEmpty: new Error(`Predict report not found ${reportDetail.reportId}`),
  });
  if (report.userId !== userId) throw new Error('You are not authorized to access this report');

  if (await Billing.findOne({ where: { userId, purchaseTargetId: reportDetail.id } })) {
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
      purchaseTargetId: reportDetailId,
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

  const template =
    {
      predict: () => config.predictReportTemplate,
      natal: () => config.natalReportTemplate,
      synastry: () => config.synastryReportTemplate,
      phase: () => config.phaseReportTemplate,
    }[report.type]() ?? {};

  const context = new Context({
    language,
    report,
    reportDetail,
    user: report.meta.user,
    secondaryUser: report.meta.type === 'synastry' ? report.meta.secondaryUser : undefined,
  });

  generateDetailIfNeeded({ report, reportDetail, context, template, language, sendNotification: true });

  res.json({});
});

const feedbackBodySchema = Joi.object<{
  sectionId?: string;
  content?: string;
}>({
  sectionId: Joi.string().empty(['', null]),
  content: Joi.string().empty(['', null]),
});

router.post('/details/:reportDetailId/:action(like|dislike)', user(), auth(), async (req, res) => {
  const { did: userId } = req.user!;

  const { reportDetailId, action } = await Joi.object<{
    reportDetailId: string;
    action: 'like' | 'dislike';
  }>({
    reportDetailId: Joi.string().required(),
    action: Joi.string().valid('like', 'dislike').required(),
  }).validateAsync(req.params, { stripUnknown: true });

  const body = await feedbackBodySchema.validateAsync(req.body, { stripUnknown: true });

  const key = `report-detail-${reportDetailId}` as const;

  const previous = await Feedback.findOne({
    where: { userId, key, sectionId: body.sectionId || null },
    order: [['id', 'DESC']],
  });

  const current =
    !previous || previous.action === 'cancel'
      ? await Feedback.create({ userId, key, action, sectionId: body.sectionId, content: body.content })
      : previous.action === action
        ? await Feedback.create({ userId, key, action: 'cancel', sectionId: body.sectionId, content: body.content })
        : await Feedback.create({ userId, key, action, sectionId: body.sectionId, content: body.content });

  res.json({
    feedbackStatus: current.status(),
  });
});

export default router;

const SortedStars = [...Stars].sort();

function starsKey(stars: HoroscopeStars) {
  const map = Object.fromEntries(stars.map((i) => [i.star, i]));
  return SortedStars.flatMap((star) => {
    const s = map[star];
    if (!s) return [];
    return [s.star, s.sign, s.house].join('-');
  }).join('-');
}

export type RuntimeResult = {
  field: string;
  ai?: {
    template: string;
    builtinAnswerOriginalId: string;
  };
  variable?: {
    variable: string;
    result: any;
  };
  map?: {
    iterator: string;
    result: (RuntimeResult[] | undefined)[];
  };
  translate?: {
    original: string;
    translation: string;
  };
};

async function runRuntime({
  context,
  fields,
  language,
  cacheKey: cacheKeyFn,
  result,
}: {
  context: Context;
  fields: Runtime['fields'];
  language: string;
  cacheKey: (field: NonNullable<Runtime['fields']>[number], topic?: string) => string;
  result?: (RuntimeResult | undefined)[];
}): Promise<RuntimeResult[]> {
  if (!fields) return [];

  return (
    await Promise.all(
      fields.map(async (field) => {
        const prevResult = result?.find((i) => i?.field === field.field);

        if (field.map) {
          const iterator = await context.get(field.map.iterator);
          if (!Array.isArray(iterator)) throw new Error(`Invalid iterator of map ${iterator}`);

          try {
            logger.debug('report time usage, generateReport: before field.map', {
              field: field.field,
              userId: context.report.userId,
            });

            return {
              field: field.field,
              map: {
                iterator: field.map.iterator,
                result: await Promise.all(
                  iterator.map((item: any, index: number) => {
                    return runRuntime({
                      context: context.with({ $item: item }),
                      fields: field.map?.fields,
                      language,
                      cacheKey: cacheKeyFn,
                      result: prevResult?.map?.result[index],
                    });
                  }),
                ),
              },
            };
          } finally {
            logger.debug('report time usage, generateReport: after field.map', {
              field: field.field,
              userId: context.report.userId,
            });
          }
        }

        // 除了上面的 map 之外，其它字段如果之前有 result 直接返回
        if (prevResult) return prevResult;

        if (field.variable) {
          return {
            field: field.field,
            variable: {
              variable: field.variable,
              result: await context.get(field.variable),
            },
          };
        }

        if (field.ai) {
          const parameters = Object.fromEntries(
            (
              await Promise.all(
                (field.ai.parameters ?? []).map(async (param) => {
                  if (param.variable) {
                    return [param.field, await context.get(param.variable)] as const;
                  }

                  throw new Error('Unsupported to call ai in parameters yet');
                }),
              )
            )
              .map(([key, val]) => [key, typeof val === 'object' ? JSON.stringify(val) : val] as const)
              .sort((a, b) => a[0].localeCompare(b[0])),
          );

          // NOTE: 为了让用户星盘顺序无关，避免两个人看到的合盘报告不一致
          if (parameters.userStars && parameters.secondaryUserStars) {
            const [s1, s2] = [parameters.secondaryUserStars, parameters.userStars].sort();
            parameters.userStars = s1;
            parameters.secondaryUserStars = s2;
          }

          const hash = createHash('md5');
          hash.update(JSON.stringify(parameters));
          const key = cacheKeyFn(field, hash.digest('hex'));

          const answer = await BuiltinAnswer.getOrGenerateReport({
            key,
            language,
            generate: async ({ language: lang }) =>
              invokeText(field.ai!.template, {
                ...parameters,
                language: lang,
              }).then((content) => ({ content: content.replace(/^"+/, '').replace(/"+$/, '') })),
            translate: async ({ content, language: lang }) => translate(content, lang),
            summarize: async ({ content, language: lang }) => summarize(content, lang),
          });

          return {
            field: field.field,
            ai: {
              template: field.ai.template,
              builtinAnswerOriginalId: (answer.originalAnswerId || answer.id).toString(),
            },
          };
        }

        if (field.translate) {
          return {
            field: field.field,
            translate: {
              original: field.translate,
              translation: await getTranslation(field.translate, language, config.defaultLanguage),
            },
          };
        }

        throw new Error(`Unsupported field: ${field.field}`);
      }),
    )
  ).flat();
}

export async function mergeResult(
  context: Context,
  language: string,
  fields: NonNullable<Runtime['fields']>,
  result: RuntimeResult[],
  isVip: boolean,
) {
  const obj: Record<string, any> = {};

  await Promise.all(
    fields.map(async (f) => {
      logger.debug('report time usage, mergeResult: before field', {
        field: f.field,
        userId: context.report.userId,
      });
      try {
        if (f.variable) {
          set(
            obj,
            [f.field],
            await context.get(
              f.variable.replace(/\[[^\]]+\]/g, (i) => {
                const v = get(context, i.slice(1, -1));
                return `[${JSON.stringify(v)}]`;
              }),
            ),
          );
        } else if (f.ai) {
          const v = result.find((i) => !!i.ai && i.field === f.field);
          const originalAnswerId = v?.ai?.builtinAnswerOriginalId;
          const answer = originalAnswerId
            ? await BuiltinAnswer.getOrTranslateByOriginalId({
                originalAnswerId,
                language,
                translate: async ({ content, language: lang }) => translate(content, lang),
              })
            : undefined;
          set(obj, [f.field], answer?.content);
        } else if (f.map?.fields) {
          const old = get(obj, [f.field]);
          if (!Array.isArray(old)) set(obj, [f.field], []);

          const iterator = await context.get(f.map.iterator);

          if (Array.isArray(iterator)) {
            const res = result.find((i) => i.map && i.field === f.field)?.map?.result;

            await Promise.all(
              iterator.map(async (item: any, index: number) => {
                set(
                  obj,
                  [f.field, index],
                  await mergeResult(context.with({ $item: item }), language, f.map!.fields!, res?.[index] ?? [], isVip),
                );
              }),
            );
          }
        } else if (f.translate) {
          const translation = await getTranslation(f.translate, language, config.defaultLanguage);
          set(obj, [f.field], translation);
        }
      } finally {
        logger.debug('report time usage, mergeResult: after field', {
          field: f.field,
          userId: context.report.userId,
        });
      }
    }),
  );

  return obj;
}

function isTopicLock(type: ReportType, topic: string) {
  return !{
    predict: config.publicPredictTopics,
    natal: config.publicNatalTopics,
    synastry: config.publicSynastryTopics,
    phase: [] as string[],
  }[type].includes(topic.toLowerCase());
}

function reportCacheKey(field: NonNullable<Runtime['fields']>[number], report: Report, topic?: string) {
  const factors: string[] = ['report'];

  if (topic) factors.push(topic);

  switch (report?.meta.type) {
    case 'predict': {
      factors.push(report.meta.date, report.meta.dateType);
      factors.push(starsKey(report.meta.user.horoscope.stars), starsKey(report.meta.dateHoroscope.stars));
      break;
    }
    case 'natal': {
      factors.push(starsKey(report.meta.user.horoscope.stars));
      break;
    }
    case 'synastry': {
      factors.push(
        ...[starsKey(report.meta.user.horoscope.stars), starsKey(report.meta.secondaryUser.horoscope.stars)].sort(),
      );
      break;
    }
    case 'phase': {
      factors.push(report.meta.date, starsKey(report.meta.user.horoscope.stars));
      break;
    }
    default:
      throw new Error(`Unsupported type ${report?.meta}`);
  }

  if (field.ai) factors.push(field.ai.template);

  return factors.join('-');
}

class Context {
  constructor(
    private options: {
      language: string;
      $item?: { [key: string]: any };
      report: Report;
      reportDetail?: ReportDetail;
      user: UserHoroscopeInfo;
      secondaryUser?: UserHoroscopeInfo;
    },
  ) {}

  get icons() {
    return config.reportIcons;
  }

  get $item() {
    const { report, $item } = this.options;

    const sign = report.meta.user.horoscope.stars.find((s: any) => s.star === $item?.topic)?.sign;

    return {
      ...$item,
      sign,
      get image() {
        return (report.sections as any[]).find((s) => s.topic === $item?.topic)?.image;
      },
    };
  }

  get report() {
    const { report, language } = this.options;
    return {
      ...report.dataValues,

      meta: {
        ...report.dataValues.meta,

        get dateStarsJsonString() {
          if (report.meta.type === 'predict') {
            return getHoroscopeString(report.meta.dateHoroscope.stars);
          }

          return '';
        },

        get phase() {
          if (report.meta.type !== 'phase') return null;
          const date = dayjs(report.meta.date).toDate();
          const { phaseText } = phase({ date });
          return phaseText;
        },

        get retrogradeStars() {
          if (report.meta.type !== 'phase') return null;
          const { user: u } = report.meta;
          const retrogradeStars = getHoroscopeRetrogradeStars(getHoroscope(u));

          return Promise.all(
            retrogradeStars.map((star: any) => {
              return Promise.all([
                getTranslation('retrogradeTitle', language, config.defaultLanguage),
                getTranslation(star.star, language, config.defaultLanguage),
              ]).then(([t, planet]) => {
                const title = t.replace('{planet}', planet).toUpperCase();
                return { star: star.star, title };
              });
            }),
          );
        },
      },

      get sections() {
        return report.sections.map((section: any) => ({
          ...section,
          get icon() {
            return report.type === 'predict'
              ? getPredictScoreCategory(section.score).icon
              : get(config.reportIcons, `stars.${section.topic}`);
          },
          get iconTitle() {
            return getTranslation(section.topic, language, config.defaultLanguage).then((res: string) =>
              res.toUpperCase(),
            );
          },
          get title() {
            if (report.type === 'predict') return section.topic.toUpperCase();

            const star = report.meta.user.horoscope.stars.find((i: any) => i.star === section.topic);

            if (report.type === 'natal' && star) {
              return getTranslation(star.sign, language, config.defaultLanguage).then(
                (res: string) =>
                  `${res[0]?.toUpperCase() || ''}${res.slice(1)} ${star.arcDegreesFormatted30
                    .replace(/\d+'{2,}$/, '')
                    .replace(/\s+/g, '')}`,
              );
            }

            if (report.type === 'synastry' && star) {
              return getTranslation(`synastry_${star.star}`, language, config.defaultLanguage).then((res: string) =>
                res.toUpperCase(),
              );
            }

            return '';
          },
          get subtitle() {
            if (report.type === 'natal') {
              const star = report.meta.user.horoscope.stars.find((i: any) => i.star === section.topic);
              if (star) {
                return getTranslation('houseFormatter', language, config.defaultLanguage).then((res: string) =>
                  res.replace('{house}', star.house.toString()),
                );
              }
            }

            return '';
          },
        }));
      },
    };
  }

  get reportDetail() {
    const { language, report, reportDetail } = this.options;
    if (!reportDetail) return reportDetail;

    return {
      ...reportDetail.dataValues,
      get sign() {
        return report.meta.user.horoscope.stars.find((s: any) => s.star === reportDetail.meta.topic)?.sign;
      },
      get image() {
        return (report.sections as any[]).find((s) => s.topic === reportDetail.meta.topic)?.image;
      },
      get icon() {
        if (reportDetail.meta.type === 'predict') {
          return get(config.reportIcons, `predict.${getPredictScoreCategory(reportDetail.meta.score).name}`);
        }
        return get(config.reportIcons, `stars.${reportDetail.meta.topic}`);
      },
      get iconTitle() {
        return getTranslation(
          reportDetail.meta.type === 'predict'
            ? getPredictScoreCategory(reportDetail.meta.score).name
            : reportDetail.meta.topic,
          language,
          config.defaultLanguage,
        ).then((res: string) => `${res[0]?.toUpperCase() || ''}${res.slice(1)}`);
      },
      get title() {
        if (reportDetail.meta.type === 'predict') {
          return reportDetail.meta.topic.toUpperCase();
        }

        const star = report.meta.user.horoscope.stars.find((s: any) => s.star === reportDetail.meta.topic);

        if (reportDetail.meta.type === 'natal' && star) {
          return getTranslation(star.sign, language, config.defaultLanguage).then(
            (res: string) =>
              `${res[0]?.toUpperCase() || ''}${res.slice(1)} ${star.arcDegreesFormatted30
                .replace(/\d+'{2,}$/, '')
                .replace(/\s+/g, '')}`,
          );
        }

        if (reportDetail.meta.type === 'synastry' && star) {
          return getTranslation(`synastry_${star.star}`, language, config.defaultLanguage).then((res: string) =>
            res.toUpperCase(),
          );
        }

        return '';
      },
      get subtitle() {
        if (report.meta.type === 'predict') {
          return dayjs(report.meta.date).locale(language).format('MMMM,D');
        }
        if (reportDetail.meta.type === 'natal') {
          const house = report.meta.user.horoscope.stars.find((s: any) => s.star === reportDetail.meta.topic)?.house;
          if (house) {
            return getTranslation('houseFormatter', language, config.defaultLanguage).then((res: string) =>
              res.replace('{house}', house.toString()),
            );
          }
        }
        if (reportDetail.meta.type === 'synastry') {
          if (report.meta.type === 'synastry') {
            const u = report.meta.user.horoscope.stars.find((s: any) => s.star === reportDetail.meta.topic);
            const secondary = report.meta.secondaryUser.horoscope.stars.find(
              (s: any) => s.star === reportDetail.meta.topic,
            );
            if (u && secondary) {
              return Promise.all([
                getTranslation('you', language, config.defaultLanguage),
                getTranslation(u.sign, language, config.defaultLanguage),
                getTranslation('friend', language, config.defaultLanguage),
                getTranslation(secondary.sign, language, config.defaultLanguage),
              ]).then(([you, sign, friend, friendSign]) => `${you}\t${sign}\n${friend}\t${friendSign}`);
            }
          }
        }

        return '';
      },
    };
  }

  get user() {
    const { user: u } = this.options;

    return {
      ...u,
      horoscope: {
        ...u.horoscope,
        get starsJsonString() {
          return getHoroscopeString(u.horoscope.stars);
        },
      },
    };
  }

  get secondaryUser() {
    const { secondaryUser } = this.options;
    if (!secondaryUser) return secondaryUser;

    return {
      ...secondaryUser,
      horoscope: {
        ...secondaryUser.horoscope,
        get starsJsonString() {
          return getHoroscopeString(secondaryUser.horoscope.stars);
        },
      },
    };
  }

  with(options: Partial<typeof this.options>) {
    return new Context({ ...this.options, ...options });
  }

  async get(path: string) {
    const s = path.split('.');
    if (s.at(-1) === '$i18n') {
      const res = get(this, s.slice(0, -1).join('.'));
      if (typeof res === 'string') {
        return getTranslation(res, this.options.language, config.defaultLanguage);
      }
    }

    return get(this, path);
  }
}

async function generateDetailIfNeeded({
  report,
  reportDetail,
  context,
  template,
  language,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  sendNotification: _sendNotification,
}: {
  report: Report;
  reportDetail: ReportDetail;
  context: Context;
  template: typeof config.predictReportTemplate;
  language: string;
  sendNotification?: boolean;
}) {
  if (reportDetail.generateStatus === 'generating' || reportDetail.generateStatus === 'finished') {
    return;
  }

  await reportDetail.update({ generateStatus: 'generating' });

  Promise.all([
    runRuntime({
      context,
      fields: template._details_?._runtime?.fields ?? [],
      language,
      cacheKey: (field, topic) => reportCacheKey(field, report, topic),
    }),
    ...(template._details_?.sections.map(async (section: any) => {
      return {
        id: nextReportDetailId(),
        sectionId: section._id,
        result: await runRuntime({
          context,
          fields: section._runtime?.fields ?? [],
          language,
          cacheKey: (field, topic) => reportCacheKey(field, report!, topic),
        }),
      };
    }) ?? []),
  ])
    .then(async ([fields, ...sections]) => {
      await reportDetail!.update({
        data: { _runtime: { fields }, sections },
        generateStatus: 'finished',
        error: undefined,
      });

      // Select pre-generated image for this report section
      const sectionIndex = report.sections.findIndex((s: any) => s.id === reportDetail.id);
      if (sectionIndex >= 0) {
        const { topic } = reportDetail.meta;
        const image = selectReportImage(report.type, topic);
        if (image) {
          await report.reload();
          const updatedSections = report.sections.map((s: any, i: number) =>
            i === sectionIndex ? { ...s, image } : s,
          );
          await report.update({ sections: updatedSections });
        }
      }
    })
    .catch(async (error) => {
      await reportDetail!.update({ generateStatus: 'error', error: error?.message });
    })
    .catch((error) => {
      logger.error('update report detail error status error', error);
    });
}

/**
 * Generates a report based on the given input.
 */
export async function generateReport({
  userId,
  inviteId,
  ...input
}: { userId: string; inviteId?: string } & GenerateReportInput) {
  if (input.type === 'predict' && config.points.badges.firstTimeGenerateFortuneReport) {
    addPointsBadgeWithCatch({ did: userId, ruleId: config.points.badges.firstTimeGenerateFortuneReport });
  } else if (input.type === 'natal' && config.points.badges.firstTimeGenerateNatalReport) {
    addPointsBadgeWithCatch({ did: userId, ruleId: config.points.badges.firstTimeGenerateNatalReport });
  } else if (input.type === 'synastry' && config.points.badges.firstTimeGenerateSynastryReport) {
    addPointsBadgeWithCatch({ did: userId, ruleId: config.points.badges.firstTimeGenerateSynastryReport });
  }

  const language = parseLanguage(input.language);

  logger.debug('report time usage, generateReport: before check sub ', {
    userId,
  });
  const [user, isVip] = await Promise.all([
    User.findByPk(userId, { rejectOnEmpty: new Error('User not found') }),
    !!(await Billing.isUserSubAvailable({ userId })),
  ]);
  logger.debug('report time usage, generateReport: after check sub ', {
    userId,
  });

  // NOTE: important, recalculate date by date type
  if (input.type === 'predict') {
    input.date = dayjs(input.date).startOf(input.dateType).format('YYYY-MM-DD');
  }

  const template =
    {
      predict: () => config.predictReportTemplate,
      natal: () => config.natalReportTemplate,
      synastry: () => config.synastryReportTemplate,
      phase: () => config.phaseReportTemplate,
    }[input.type]() ?? {};

  const topics =
    input.type === 'predict'
      ? user.predictTopics.filter((i: any) => i.visible !== false).map((i: any) => i.topic)
      : input.type === 'natal'
        ? Stars
        : input.type === 'synastry'
          ? SYNASTRY_STARS
          : input.type === 'phase'
            ? []
            : undefined;
  if (!topics) throw new Error('Invalid topics');

  const key =
    input.type === 'predict'
      ? `${input.type}-${input.date}-${input.dateType}-${starsKey(input.user.horoscope.stars)}`
      : input.type === 'natal'
        ? `${input.type}-${starsKey(input.user.horoscope.stars)}`
        : input.type === 'synastry'
          ? `${input.type}-${[starsKey(input.user.horoscope.stars), starsKey(input.secondaryUser.horoscope.stars)]
              .sort()
              .join('-')}${inviteId ? `-${inviteId}` : ''}`
          : input.type === 'phase'
            ? `${input.type}-${input.date}-${starsKey(input.user.horoscope.stars)}`
            : '';

  logger.debug('report time usage, generateReport: before find report', {
    userId,
  });
  let report = await Report.findOne({ where: { userId, key } });
  let details: ReportDetail[] | undefined;
  logger.debug('report time usage, generateReport: after find report', {
    userId,
  });

  if (!report) {
    const sections = topics.map((topic: string) => ({
      id: nextReportDetailId(),
      topic,
      score: randomInt(PREDICT_SCORE_MIN, PREDICT_SCORE_MAX + 1),
    }));

    report = await Report.create({
      userId,
      type: input.type,
      key,
      meta:
        input.type === 'predict'
          ? {
              type: input.type,
              date: input.date,
              dateHoroscope: input.dateHoroscope,
              dateType: input.dateType,
              user: input.user,
            }
          : input.type === 'natal'
            ? {
                type: input.type,
                user: input.user,
              }
            : input.type === 'synastry'
              ? {
                  type: input.type,
                  user: input.user,
                  secondaryUser: input.secondaryUser,
                }
              : {
                  type: input.type,
                  user: input.user,
                  date: input.date,
                },
      sections,
      generateStatus: 'notstart',
    });

    if (input.type !== 'phase') {
      details = await ReportDetail.bulkCreate(
        sections.map((i: any) => {
          return {
            id: i.id,
            reportId: report!.id,
            userId,
            meta: {
              type: report!.type,
              topic: i.topic,
              score: i.score,
            },
            generateStatus: 'notstart' as const,
          };
        }),
      );
    }
  } else if (
    !equal(
      topics,
      report.sections.map((i: any) => i.topic),
    )
  ) {
    // 如果 topics 变动了，需要把 _runtime.fields 中的 sections 的 result 做相应变更
    // 把新增的 section 位置的 result 变为 undefined，之后会在 runFields 中生成该 topic
    const meta = cloneDeep(report.meta);
    const oldSectionField = meta._runtime?.fields.find((i: any) => i.field === 'sections');

    const oldSectionFieldCopy = cloneDeep(oldSectionField);
    if (oldSectionField?.map) oldSectionField.map.result = [];

    const sections = topics.map((topic: string) => {
      const old = report?.sections.find((j: any) => j.topic === topic);

      if (!old && oldSectionField?.map && oldSectionFieldCopy?.map) {
        oldSectionField.map.result.push(
          oldSectionFieldCopy.map.result.find((i: any) =>
            i?.find((j: any) => j.field === 'topic' && j.variable?.result === topic),
          ),
        );
      }

      return {
        ...old,
        id: old?.id || nextReportDetailId(),
        topic,
        score: old?.score || randomInt(PREDICT_SCORE_MIN, PREDICT_SCORE_MAX + 1),
        title: topic,
      };
    });

    const diff = differenceBy(sections, report.sections, 'id');

    await report.update({ sections, meta, generateStatus: 'notstart' });

    if (input.type !== 'phase') {
      details = await ReportDetail.bulkCreate(
        diff.map((i: any) => {
          return {
            id: i.id,
            reportId: report!.id,
            userId,
            meta: {
              type: report!.type,
              topic: i.topic,
              score: i.score,
            },
            generateStatus: 'notstart' as const,
          };
        }),
      );
    }
  }

  const context = new Context({
    language,
    report,
    user: input.user,
    secondaryUser: input.type === 'synastry' ? input.secondaryUser : undefined,
  });

  const runFields = async (
    fields: NonNullable<NonNullable<typeof template._runtime>['fields']>,
    result?: (RuntimeResult | undefined)[],
  ) => {
    return runRuntime({
      language,
      context,
      fields,
      cacheKey: (field, topic) => reportCacheKey(field, report!, topic),
      result,
    }).then(async (partial) => {
      await report?.reload().then((r: Report) =>
        r.update({
          meta: {
            ...r.meta,
            _runtime: {
              ...r.meta._runtime,
              fields: [
                ...(r.meta._runtime?.fields.filter((i: any) => !partial.some((j) => j.field === i.field)) ?? []),
                ...partial,
              ],
            },
          },
        }),
      );
    });
  };

  const newFields = template._runtime?.fields?.filter((i: any) => {
    const generated = report?.meta._runtime?.fields.find((j: any) => j.field === i.field);
    if (!generated) return true;
    if (i.map && generated.map) {
      if (!generated.map.result.length) return false;

      if (generated.map.result.some((item: any) => isNil(item))) return true;

      const generatedFields = new Set(generated.map.result[0]?.map((item: any) => item.field));
      if (i.map.fields?.some((j: any) => !generatedFields.has(j.field))) return true;
    }

    return false;
  });

  logger.debug('report time usage, generateReport: before generate', {
    userId,
  });

  if (report.generateStatus !== 'generating' && (report.generateStatus !== 'finished' || newFields?.length)) {
    await report.update({ generateStatus: 'generating' });

    const aiFields = newFields?.filter((i: any) => i.ai) ?? [];
    const otherFields = newFields?.filter((i: any) => !i.ai) ?? [];

    Promise.all(
      aiFields.map(async (field: any) => {
        const prevResult = (await report?.reload())?.meta._runtime?.fields.find((i: any) => i.field === field.field);
        return runFields([field], prevResult && [prevResult]);
      }),
    )
      .then(async () => {
        const meta = (await report?.reload())?.meta;
        const prevResults = otherFields.map((i: any) => meta?._runtime?.fields.find((j: any) => i.field === j.field));

        return runFields(otherFields, prevResults);
      })
      .then(async () => {
        await report?.update({
          generateStatus: 'finished',
        });
      })
      .catch(async (error) => {
        await report?.update({ generateStatus: 'error', error: error?.message });
      })
      .catch((error) => {
        logger.error('update report error status error', error);
      });
  }

  logger.debug('report time usage, generateReport: after generate', {
    userId,
  });

  const purchased = await Billing.isPurchased({ userId, purchaseTargetId: report.sections.map((i: any) => i.id) });

  logger.debug('report time usage, generateReport: after check purchase', {
    userId,
  });

  if (input.type !== 'phase') {
    logger.debug('report time usage, generateReport: before find all details', {
      userId,
    });
    details ??= await ReportDetail.findAll({ where: { id: { [Op.in]: report.sections.map((i: any) => i.id) } } });
    logger.debug('report time usage, generateReport: after find all details', {
      userId,
    });

    // generate details
    details.forEach((reportDetail) => {
      if (isVip || purchased[reportDetail.id]) {
        generateDetailIfNeeded({
          report: report!,
          reportDetail,
          context: context.with({ reportDetail }),
          template,
          language,
        });
      }
    });
  }

  return { isVip, details, report, context, template, purchased };
}

function sample<T>(arr: T[]): T | undefined {
  if (!arr?.length) return undefined;
  return arr[randomInt(0, arr.length)];
}
