import dayjs from 'dayjs';
import { pick } from 'lodash';
import { Readable } from 'stream';

import { chatSession } from '../../../ai/chat';
import { invokeText } from '../../../ai/invoke';
import { config } from '../../../libs/env';
import getHoroscope, { getHoroscopeData } from '../../../libs/horoscope';
import logger from '../../../libs/logger';
import { addPointsBadgeWithCatch } from '../../../libs/points-badge';
import { MessageType } from '../../../store/models/message';
import User, { type HoroscopeStars } from '../../../store/models/user';
import { asyncIterableToReadableWithRecommendations } from '../sse';
import { getTranslation } from '../translations';
import type { ChatHandle } from '../types';
import { DebugCommand } from '../types';

export const handleSessionChat: ChatHandle<MessageType.SessionChat> = async ({ userId, language, input }) => {
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
    if (input.question === DebugCommand.LongTermMem && longTermMem) {
      const result = new Readable({ read: () => {} });
      const jsonString = JSON.stringify(longTermMem);
      result.push(jsonString);
      result.push(null);
      return {
        data: result,
        type: MessageType.SessionChat,
      };
    }

    // ----- Call session chat agent -----
    const context = [userContext, friendContext, timeContext, input.context || ''].join('\n\n');
    const history = input.history?.filter((i): i is typeof i & { content: string } => !!i.content);

    logger.info('[session-chat] invoking AI', { question: input.question.slice(0, 80), language });

    const stream = await chatSession({
      question: input.question,
      language,
      userInfo: userContext,
      context,
      history,
    });

    logger.info('[session-chat] AI stream created, returning readable with recommendations');

    return {
      data: asyncIterableToReadableWithRecommendations(stream, { language }),
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
