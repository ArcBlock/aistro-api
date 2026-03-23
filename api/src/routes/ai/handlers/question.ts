import { chatQuestion } from '../../../ai/chat';
import { UnauthorizedError } from '../../../libs/auth';
import { getHoroscopeString } from '../../../libs/horoscope';
import { MessageType } from '../../../store/models/message';
import User from '../../../store/models/user';
import { asyncIterableToReadable } from '../sse';
import { ChatHandle } from '../types';
import { handleRequestCompleteProfile } from './profile';

export const handleQuestion: ChatHandle<MessageType.Question> = async ({ userId, input, ...args }) => {
  if (!userId) {
    throw new UnauthorizedError();
  }
  const user = await User.findByPk(userId, { rejectOnEmpty: new Error('User not found') });

  if (!user.birthDate || !user.birthPlace) {
    return handleRequestCompleteProfile({ input, ...args });
  }

  const horoscope = await user.getHoroscopeOrGenerate();
  const userInfo = horoscope?.stars ? getHoroscopeString(horoscope.stars) : '';

  const stream = await chatQuestion({
    question: input.question,
    language: args.language,
    userInfo,
    context: '',
  });

  return {
    type: MessageType.Question,
    data: asyncIterableToReadable(stream),
  };
};
