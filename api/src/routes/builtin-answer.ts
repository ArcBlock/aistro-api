import { Router } from 'express';
import Joi from 'joi';
import { shuffle } from 'lodash';
import Queue from 'queue';

import { invokeText } from '../ai/invoke';
import { summarize, translate } from '../ai/utils';
import { Sign, Signs, Star, Stars, getHoroscopeString } from '../libs/horoscope';
import { ensureAdmin } from '../libs/security';
import BuiltinAnswer from '../store/models/builtin-answer';

const router = Router();

type GenerateType = 'natal';

const generateInputSchema = Joi.object<{
  type: GenerateType;
  concurrency: number;
  force: boolean;
  retryError: boolean;
}>({
  type: Joi.string().valid('natal').required(),
  concurrency: Joi.number().integer().min(1).max(10).default(3),
  force: Joi.boolean().default(false),
  retryError: Joi.boolean().default(false),
});

type Task = { queue: Queue; error: object[]; success: object[] };

const taskMap: { [key: string]: Task } = {};

const handlerMap: { [key in GenerateType]: (arg: any) => Promise<any> } = {
  natal: async ({ star, sign, house }: { star: Star; sign: Sign; house: number }) => {
    const key = `natal-${star}-${sign}-${house}`;

    await BuiltinAnswer.getOrGenerateReport({
      key,
      language: 'zh',
      generate: async ({ language }) =>
        invokeText('report/natal-description', {
          language,
          star: getHoroscopeString([{ star, sign, house }]),
          sign,
          house: String(house),
        }).then((content) => ({ content })),
      translate: async ({ content, language }) => translate(content, language),
      summarize: async ({ content, language }) => summarize(content, language),
    });
  },
};

router.post('/generate', ensureAdmin, async (req, res) => {
  const input = await generateInputSchema.validateAsync(req.query, { stripUnknown: true });

  if (input.force) {
    taskMap[input.type]?.queue.end();
    delete taskMap[input.type];
  }

  const handler = handlerMap[input.type];

  taskMap[input.type] ??= (() => {
    const queue = new Queue({ concurrency: input.concurrency, autostart: true });
    const task: Task = { queue, error: [], success: [] };

    if (input.type === 'natal') {
      const list: { star: Star; sign: Sign; house: number }[] = [];

      for (const star of Stars) {
        for (const sign of Signs) {
          for (let house = 1; house <= 12; house++) {
            list.push({ star, sign, house });
          }
        }
      }

      for (const arg of shuffle(list)) {
        queue.push(async () => {
          try {
            await handler(arg);
            task.success.push(arg);
          } catch (error) {
            task.error.push(arg);
          }
        });
      }
    }

    return task;
  })();

  const task = taskMap[input.type]!;

  if (input.retryError) {
    task.queue.push(
      ...task.error.splice(0).map((arg: object) => async () => {
        try {
          await handler(arg);
          task.success.push(arg);
        } catch (error) {
          task.error.push(arg);
        }
      }),
    );
  }

  res.json({
    errorCount: task.error.length,
    successCount: task.success.length,
    queueLength: task.queue.length,
  });
});

export default router;
