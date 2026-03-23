import { user } from '@blocklet/sdk/lib/middlewares';
import compression from 'compression';
import { Router } from 'express';
import Joi from 'joi';

import { invokeStream } from '../ai/invoke';
import { randomFortuneImage } from '../libs/blender';
import getHoroscope, { getHoroscopeData } from '../libs/horoscope';
import { ensureAdmin } from '../libs/security';
import Fortune, { ReportType } from '../store/models/fortune';

const router = Router();

const genReportSchema = Joi.object<{
  birthDate: string;
  birthPlace: {
    longitude: number;
    latitude: number;
  };
  lang?: string;
  type: number;
}>({
  birthDate: Joi.string(),
  birthPlace: Joi.object({
    longitude: Joi.number().min(-180).max(180),
    latitude: Joi.number().min(-90).max(90),
  }),
  lang: Joi.string().empty(['', null]),
  type: Joi.number().default(0),
});

const getBlenderKeyByType = (type: Number): string => {
  if (type === ReportType.ChineseYearOfTheDragon2024) {
    return '2024_dragon_spring_festival';
  }
  if (type === ReportType.ChineseYearOfTheSnake2025) {
    return '2025_snake_spring_festival';
  }
  return '2024_new_year';
};

/**
 * Map fortune report type to the local prompt path used by invokeStream.
 */
const getPromptPathByType = (type: Number): string => {
  if (type === ReportType.ChineseYearOfTheDragon2024) {
    return 'cron/fortune-dragon-year';
  }
  if (type === ReportType.ChineseYearOfTheSnake2025) {
    return 'cron/fortune-snake-year';
  }
  return 'cron/fortune-new-year';
};

router.post('/generate', compression(), user(), async (req, res) => {
  const { birthDate, birthPlace, lang, type } = await genReportSchema.validateAsync(req.body, { stripUnknown: true });

  const horoscope = getHoroscopeData(getHoroscope({ birthDate, birthPlace }));

  res.setHeader('X-Accel-Buffering', 'no');

  const promptPath = getPromptPathByType(type);
  const stream = await invokeStream(promptPath, {
    language: lang || 'en',
    stars: JSON.stringify(
      horoscope.stars.map((item) => {
        return { star: item.star, sign: item.sign, house: item.house };
      }),
    ),
  });

  const userId = req.user?.did || '';
  const cover = randomFortuneImage(getBlenderKeyByType(type));
  const fortune = await Fortune.create({ userId, status: 'generating', type, cover });

  // TODO: wsServer.broadcast('new-fortune-record-added-or-updated', {});
  // WebSocket broadcasting is not yet wired up in the new project.

  // Custom SSE format: <start:fortuneId>content...<end>
  res.write(`<start:${fortune.dataValues.id}>`);
  if (typeof (res as any).flush === 'function') (res as any).flush();

  let content = '';
  for await (const chunk of stream) {
    content += chunk;
    res.write(chunk);
    if (typeof (res as any).flush === 'function') (res as any).flush();
  }

  res.write('<end>');
  if (typeof (res as any).flush === 'function') (res as any).flush();

  res.end();
  await fortune.update({ report: content, status: 'completed' });

  // TODO: wsServer.broadcast('new-fortune-record-added-or-updated', {});
});

// eslint-disable-next-line no-promise-executor-return
const timer = (ms: any) => new Promise((resolve) => setTimeout(resolve, ms));

router.get('/report/:id', user(), async (req, res) => {
  const { id } = req.params;
  const fortune = await Fortune.findOne({
    where: {
      id,
    },
  });
  if (!fortune) {
    return res.json({ code: 1, message: 'No fortune found' });
  }
  if (fortune.status === 'error') {
    return res.json({ code: 1, message: 'No fortune found' });
  }
  let content = '';
  if (fortune.status === 'generating') {
    // 如果一个报告超过 5 分钟还是 generating
    const duration = new Date().getTime() - fortune.updatedAt.getTime();
    if (duration > 5 * 60 * 1000) {
      await Fortune.update(
        { status: 'error' },
        {
          where: {
            id,
          },
        },
      );
      // TODO: wsServer.broadcast('new-fortune-record-added-or-updated', {});
      return res.json({ code: 1, message: 'No fortune found' });
    }
    let count = 1;
    do {
      content =
        (
          await Fortune.findOne({
            where: {
              id,
            },
          })
        )?.report || '';
      if (!content) {
        // eslint-disable-next-line no-await-in-loop
        await timer(5000);
        count++;
      }
    } while (!content && count <= 12);
    if (content) {
      return res.json({ code: 0, report: content, type: fortune.type });
    }
    return res.json({ code: 1, message: 'No fortune found' });
  }
  if (fortune.status === 'completed') {
    return res.json({ code: 0, report: fortune.report, type: fortune.type });
  }
  return res.json({ code: 1, message: 'No fortune found' });
});

router.get('/report_analysis', ensureAdmin, async (_, res) => {
  // TODO: 未来这里可以更具 type，现在只有一个活动，只需要根据 status
  const result: any = {};
  const keys = Object.keys(ReportType);

  for (let index = 0; index < keys.length; index++) {
    const key = keys[index] || '';
    const type = ReportType[key];
    const totalRecords = await Fortune.count({ where: { type } });
    const totalGenerating = await Fortune.count({ where: { status: 'generating', type } });
    const totalCompleted = await Fortune.count({ where: { status: 'completed', type } });
    const totalError = await Fortune.count({ where: { status: 'error', type } });
    result[key] = {
      totalRecords,
      totalGenerating,
      totalCompleted,
      totalError,
    };
  }

  return res.json({
    code: 0,
    message: 'get analysis data success',
    data: result,
  });
});

export default router;
