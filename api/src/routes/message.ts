import dayjs from 'dayjs';
import { Router } from 'express';
import Joi from 'joi';
import { omit, pick } from 'lodash';

import { getLanguage } from '../libs/language';
import logger from '../libs/logger';
import Billing from '../store/models/billing';
import Message, { MessageType, Report } from '../store/models/message';
import User from '../store/models/user';
import {
  generateNatalReport,
  generatePredictReport,
  generateSynastryReport,
  reportPartN,
  reportPartTotal,
} from './ai/report-generators';

const router = Router();

const messageParamsSchema = Joi.object<{ messageId: string }>({
  messageId: Joi.string().max(50).required(),
});

router.get('/:messageId', async (req, res) => {
  const language = getLanguage(req);

  const { messageId } = await messageParamsSchema.validateAsync(req.params, { stripUnknown: true });

  const message = await Message.findByPk(messageId, { rejectOnEmpty: new Error('Report is not found') });

  const user = message.userId
    ? await User.findByPk(message.userId, { rejectOnEmpty: new Error('User is not found') })
    : undefined;

  const isVip = !!(user && (await Billing.isUserSubAvailable({ userId: user.id })));

  const { parameters } = message;

  if (message.parameters) {
    const { type } = message;
    const parameters = message.parameters as any;

    if (
      // 如果有报告并且请求的语言不一致的话重新生成报告
      (parameters.language !== language && message.report) ||
      // 如果是订阅用户并且报告内容不完整的话重新生成报告
      (isVip && message.report && message.report.details.length < reportPartTotal(type)) ||
      // 如果有错误的话重新生成报告
      message.error
    ) {
      // 重置报告，避免多次请求造成重复生成
      await message.update({ error: null, report: null });

      const regenerate = async () => {
        try {
          if (type === MessageType.NatalReport || type === MessageType.FriendNatalReport) {
            await generateNatalReport({
              ...parameters,
              isVip,
              language,
              message,
            })[1];
          } else if (type === MessageType.SynastryReport) {
            await generateSynastryReport({
              ...parameters,
              isVip,
              language,
              message,
            })[1];
          } else if (type === MessageType.TodaysPredict || type === MessageType.Predict) {
            await generatePredictReport({
              ...parameters,
              isVip,
              language,
              date: dayjs(parameters.date || message.createdAt),
              message,
            })[1];
          }
        } catch (error) {
          logger.error(`Translate natal report from ${parameters.language} to ${language} error`, error);
        }
      };

      await Promise.race([
        regenerate(),
        // NOTE: 3 秒后如果没有生成好的话先返回 report: null，客户端会自动刷新
        new Promise((resolve) => {
          setTimeout(resolve, 3000);
        }),
      ]);
    }
  }

  res.json({
    user: user && {
      ...pick(user, 'id', 'name', 'avatar'),
    },
    ...pick(message, 'title', 'type', 'content', 'img', 'createdAt', 'likeCount', 'error'),
    report: message.report && processReportByVipStatus(message.type, message.report, isVip),
    isVip,
    parameters: parameters && {
      ...omit(parameters, 'birthDate', 'birthPlace'),
      user: (parameters as any).user && omit((parameters as any).user, 'birthDate', 'birthPlace'),
      friend: (parameters as any).friend && omit((parameters as any).friend, 'birthDate', 'birthPlace'),
    },
  });
});

function processReportByVipStatus(type: Message['type'], report: Report, isVip: boolean): typeof report {
  if (!report) return report;

  const result: Report = { ...report };
  if (!isVip) result.details = result.details.slice(0, reportPartN(type));

  return result;
}

export default router;
