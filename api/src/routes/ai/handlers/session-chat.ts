import dayjs from 'dayjs';
import { pick } from 'lodash';
import { Readable } from 'stream';

import { chatSession } from '../../../ai/chat';
import { invokeText } from '../../../ai/invoke';
import { config } from '../../../libs/env';
import getHoroscope, { getHoroscopeData } from '../../../libs/horoscope';
import logger from '../../../libs/logger';
import { addPointsBadgeWithCatch } from '../../../libs/points-badge';
import { withRedis } from '../../../libs/redis';
import { MessageType } from '../../../store/models/message';
import User, { type HoroscopeStars } from '../../../store/models/user';
import { asyncIterableToReadable, createReadableFromRedisStream, generateRecommendsOfAnswer } from '../sse';
import { getTranslation } from '../translations';
import type { ChatHandle } from '../types';
import { DebugCommand } from '../types';

export const handleSessionChat: ChatHandle<MessageType.SessionChat> = async ({ userId, language, input, message }) => {
  if (!userId) {
    return {
      type: MessageType.SessionChat,
      data: await getTranslation('requireLogin', language),
      actions: [{ action: 'login' }],
    };
  }

  // Award first-chat points (badge removed in migration)
  const firstChatAction = config.points.actions.firstTimeChatWithAI;
  if (firstChatAction) {
    addPointsBadgeWithCatch({ did: userId, ruleId: firstChatAction.ruleId });
  }

  const { friend } = input;

  const user = userId ? await User.findByPk(userId) : null;
  const longTermMem = user?.longTermMem;

  if (!input.user?.birthDate || !input.user?.birthPlace) {
    return {
      type: MessageType.SessionChat,
      data: await getTranslation('noBirthInfo', language),
      input: { type: 'datetime', chatInputType: MessageType.UpdateBirthDate },
    };
  }

  // ----- Build user/friend context -----

  const userStars =
    input.user.horoscope?.stars ??
    getHoroscopeData(getHoroscope({ birthDate: input.user.birthDate, birthPlace: input.user.birthPlace })).stars;

  const friendStars =
    friend?.horoscope?.stars ??
    (friend?.birthDate && friend.birthPlace
      ? getHoroscopeData(getHoroscope({ birthDate: friend.birthDate, birthPlace: friend.birthPlace })).stars
      : undefined);

  const getStarsContext = (stars: HoroscopeStars) => stars.map((i) => pick(i, 'star', 'sign', 'house'));

  let userAttributes = {};
  if (longTermMem) {
    userAttributes = longTermMem;
  }

  const userContext = user
    ? [
        "The following is the user's information:",
        JSON.stringify({
          ...pick(user, 'name', 'birthDate', 'birthPlace'),
          horoscope: { stars: getStarsContext(userStars) },
          ...userAttributes,
        }),
        '-------',
      ].join('\n')
    : '';

  const friendContext = friend
    ? [
        "The following is the friend's information:",
        JSON.stringify({
          ...pick(friend, 'name', 'birthDate', 'birthPlace'),
          horoscope: { stars: friendStars && getStarsContext(friendStars) },
        }),
        '-------',
      ].join('\n')
    : '';

  // ----- Time context -----

  const time = dayjs()
    .utcOffset(user?.utcOffset ?? 0)
    .format('YYYY-MM-DD HH:mm:ss');

  const timeContext = `The current time is: ${time}`;

  try {
    // ----- Long-term memory update (fire-and-forget) -----
    if (user && input.question !== DebugCommand.LongTermMem) {
      (async () => {
        try {
          const res = await invokeText('util/long-term-memory', {
            question: input.question,
            originUserAttributes: JSON.stringify(longTermMem ?? {}),
          });
          const newLongTermJSON = JSON.parse(res);
          await user.update({ longTermMem: newLongTermJSON });
        } catch (error) {
          // Prompt file may not exist yet — silently skip
          logger.error('Error updating longTermMem:', error);
        }
      })();
    }

    // ----- Handle debug command -----
    let result: Readable;
    if (input.question === DebugCommand.LongTermMem && longTermMem) {
      result = new Readable({ read: () => {} });
      const jsonString = JSON.stringify(longTermMem);
      result.push(jsonString);
      result.push(null);
    } else {
      // ----- Call session chat agent -----
      const context = [userContext, friendContext, timeContext, input.context || ''].join('\n\n');
      const history = input.history?.filter((i): i is typeof i & { content: string } => !!i.content);

      const stream = await chatSession({
        question: input.question,
        language,
        userInfo: userContext,
        context,
        history,
      });

      result = asyncIterableToReadable(stream);
    }

    // ----- Redis streaming pipeline -----
    // Clone the readable so we can pipe to Redis and also consume for recommendations
    const chunks: string[] = [];

    // Split AI response by \n and write into Redis
    (async () => {
      let index = 0;
      let previousEnded = false;
      let writed = false;

      const write = async ({ content, lineBreak, end }: { content?: string; lineBreak?: boolean; end?: boolean }) => {
        const key = `${message.id}-${index}`;
        await withRedis(async (redis) => {
          if (content && previousEnded) {
            await redis.xAdd(`${message.id}-${index - 1}`, '*', {
              done: 'true',
              next: `${message.id}-${index}`,
            });
            previousEnded = false;
          }

          if (content) {
            await redis.xAdd(key, '*', { content });
            writed = true;
          }

          if (end) {
            await redis.xAdd(key, '*', { done: 'true' });
          }

          if (writed && lineBreak) {
            writed = false;
            previousEnded = true;
            index += 1;
          }
        });
      };

      for await (const chunk of result) {
        // chunk may be a Buffer or { content: string } depending on the Readable mode
        const content = typeof chunk === 'string' ? chunk : (chunk?.content ?? '');
        if (content) chunks.push(content);

        if (!content.includes('\n')) {
          await write({ content });
        } else {
          const msgs = content.split('\n');
          for (let i = 0; i < msgs.length; i++) {
            await write({ content: msgs[i], lineBreak: i < msgs.length - 1 });
          }
        }
      }
      await write({ end: true });
    })();

    // Generate follow-up recommendations from the full answer
    (async () => {
      try {
        // Wait a bit for chunks to accumulate, then join
        await new Promise((resolve) => {
          setTimeout(resolve, 500);
        });
        const answer = chunks.join('');
        if (answer) {
          const recommends = await generateRecommendsOfAnswer({ language, answer });
          await withRedis(async (redis) => {
            await redis.xAdd(`${message.id}-recommends`, '*', {
              recommends: (recommends && JSON.stringify(recommends)) || '',
            });
          });
        }
      } catch (error) {
        logger.error('generate recommends error', error);
      }
    })();

    return {
      data: createReadableFromRedisStream(`${message.id}-0`, { recommendsStreamKey: `${message.id}-recommends` }),
      type: MessageType.SessionChat,
    };
  } catch (error) {
    logger.error('SessionChat error', error);
    return {
      data: await getTranslation('error', language, 'en'),
      type: MessageType.SessionChat,
    };
  }
};
