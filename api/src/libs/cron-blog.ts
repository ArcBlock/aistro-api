import { call } from '@blocklet/sdk/lib/component';
import Config from '@blocklet/sdk/lib/config';
import dayjs from 'dayjs';
import cron, { type ScheduledTask } from 'node-cron';

import { invokeText } from '../ai/invoke';
import CronHistory from '../store/models/cron-history';
import { componentIds } from './constants';
import { config } from './env';
import logger from './logger';

const BLOG_TOPICS = [
  { type: '占星&人际关系', label: 'relationship' },
  { type: '占星&自我发现', label: 'self_discovery' },
  { type: '占星', label: 'astrology' },
  { type: '占星&AI', label: 'ai_llm' },
] as const;

const TARGET_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'ja', name: 'Japanese' },
  { code: 'zh-TW', name: 'Traditional Chinese' },
] as const;

let blogCronTask: ScheduledTask | undefined;
let listenEnvUpdate = false;

export default function startBlogCron() {
  if (!listenEnvUpdate) {
    listenEnvUpdate = true;
    Config.events.on('envUpdate', startBlogCron);
  }

  if (config.notification.blog.enable) {
    blogCronTask ??= cron.schedule('0 8 * * *', runBlogGeneration);
    blogCronTask.start();
    logger.info('Blog cron started (daily at 08:00)');
  } else {
    blogCronTask?.stop();
  }
}

async function runBlogGeneration() {
  logger.info('Blog generation started');

  for (const topic of BLOG_TOPICS) {
    const date = dayjs().format('YYYY-MM-DD');
    const key = `Blog-${topic.label}-${date}`;

    try {
      const [, created] = await CronHistory.findOrCreate({ where: { key } });
      if (!created) {
        logger.info(`Blog for ${topic.label} already generated on ${date}, skipping`);
        continue;
      }

      const result = await generateBlogForTopic(topic);
      await CronHistory.update({ result }, { where: { key } });
      logger.info(`Blog for ${topic.label} published successfully`, { id: result.id, slug: result.slug });
    } catch (error) {
      logger.error(`Blog generation failed for ${topic.label}`, error);
      await CronHistory.update({ error: { message: (error as Error).message } }, { where: { key } }).catch(() => {});
    }
  }

  logger.info('Blog generation completed');
}

async function generateBlogForTopic(topic: (typeof BLOG_TOPICS)[number]) {
  // Step 1: Generate title
  const title = (await invokeText('cron/blog-title', { topic: topic.type })).trim();
  logger.info(`Generated title for ${topic.label}: ${title}`);

  // Step 2: Generate Chinese content
  const zhContent = await invokeText('cron/blog-content', { title });
  logger.info(`Generated content for ${topic.label} (${zhContent.length} chars)`);

  // Step 3: Translate to other languages in parallel
  const translated = await Promise.all(
    TARGET_LANGUAGES.map(async (lang) => {
      const [translatedTitle, translatedContent] = await Promise.all([
        invokeText('util/translate', { language: lang.name, question: title }),
        invokeText('util/translate', { language: lang.name, question: zhContent }),
      ]);
      return { title: translatedTitle.trim(), content: translatedContent, locale: lang.code };
    }),
  );

  // Step 4: Build translations array
  const translations = [{ title, content: zhContent, locale: 'zh' }, ...translated];

  // Step 5: Publish to did-comments
  const response = await call({
    name: componentIds.didComments,
    path: '/api/call/blog/publish',
    method: 'POST',
    data: {
      translations,
      publishTime: new Date(),
      boardId: 'blog-default',
      labels: [topic.label],
      needReview: false,
    },
  });

  return { id: (response as any).data?.id, slug: (response as any).data?.slug };
}
