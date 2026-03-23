import dayjs from 'dayjs';
import { Op } from 'sequelize';

import { chatGuide } from '../../../ai/chat';
import { UnauthorizedError } from '../../../libs/auth';
import { config } from '../../../libs/env';
import BuiltinAnswer, { getStaticAnswer, getStaticQuestions } from '../../../store/models/builtin-answer';
import Invite from '../../../store/models/invite';
import Message, { MessageType } from '../../../store/models/message';
import User from '../../../store/models/user';
import { createReadableFromRedisStream } from '../sse';
import { getTranslation } from '../translations';
import { ChatHandle } from '../types';

export const handleLike: ChatHandle<MessageType.Like> = async ({ userId, input, ...args }) => {
  if (!userId) {
    throw new UnauthorizedError();
  }

  await Message.findByPk(input.messageId, { rejectOnEmpty: new Error('Message is not found') }).then((m) =>
    m?.increment('likeCount'),
  );

  return {
    data: await getTranslation('thanksForLike', args.language),
    type: MessageType.Like,
  };
};

export const handleSuggestion: ChatHandle<MessageType.Suggestion> = async ({ input }) => {
  return {
    type: MessageType.Suggestion,
    data: createReadableFromRedisStream(input.suggestionId, {
      recommendsStreamKey: `${input.suggestionId.split('-')[0]}-recommends`,
    }),
  };
};

export const handleGuide: ChatHandle<MessageType.Guide> = async ({ userId, input, ...args }) => {
  if (!input.question) {
    // No question — return the initial guide greeting
    return {
      type: MessageType.Guide,
      data: await getTranslation('guideInit', args.language),
      suggestions: getStaticQuestions(args.language, 3)?.map((question) => ({
        type: MessageType.Guide,
        question,
      })),
    };
  }

  // Check for a static answer first
  const staticAnswer = getStaticAnswer(input.question);
  if (staticAnswer) {
    return {
      type: MessageType.Guide,
      data: staticAnswer,
      suggestions: getStaticQuestions(args.language, 3)?.map((question) => ({
        type: MessageType.Guide,
        question,
      })),
    };
  }

  // Try cached answer or generate via AI
  const data = await BuiltinAnswer.getOrGenerateQuestion({
    question: input.question,
    language: args.language,
    generate: async ({ language, question }) => {
      const stream = await chatGuide({ question, language });
      // Collect the stream into a single string for caching
      const chunks: string[] = [];
      for await (const chunk of stream) {
        chunks.push(chunk);
      }
      return chunks.join('');
    },
  });

  return {
    type: MessageType.Guide,
    data,
    suggestions: getStaticQuestions(args.language, 3)?.map((question) => ({
      type: MessageType.Guide,
      question,
    })),
  };
};

export const handleAcceptInvitation: ChatHandle<MessageType.AcceptInvitation> = async ({
  stream,
  userId,
  input,
  ...args
}) => {
  if (!userId) throw new UnauthorizedError();

  const user = await User.findByPk(userId, { rejectOnEmpty: new Error('User not found') });

  if (config.limitation.requireInvite && !user.inviteCode) {
    const { invitationCode } = input;
    if ((await Invite.update({ userId }, { where: { code: invitationCode, userId: { [Op.is]: null } } }))[0] === 0) {
      const invitation = await Invite.findOne({ where: { code: invitationCode } });
      const message = await getTranslation(
        invitation ? 'invitationCodeAlreadyUsed' : 'invitationCodeInvalid',
        args.language,
      );

      if (!stream) throw new Error(message);

      return {
        type: MessageType.AcceptInvitation,
        data: message,
      };
    }

    await user.update({ inviteCode: invitationCode });
  }

  return {
    type: MessageType.AcceptInvitation,
    data: await getTranslation('acceptInvitationSuccess', args.language),
  };
};

export const handleAIInstruction: ChatHandle<MessageType.AIInstruction> = async ({ userId, input, ...args }) => {
  if (userId && input.params) {
    const params = JSON.parse(input.params);
    if (params.type === 'updateUserInfo') {
      const isValidDate = params.birthDate && dayjs(params.birthDate, 'YYYY-MM-DD', true).isValid();
      const isValidTime = params.birthTime && dayjs(`1970-01-01 ${params.birthTime}`, 'HH:mm:ss', true).isValid();

      let updateNeeded = false;
      let newBirthDate = '';

      if (isValidDate && isValidTime) {
        newBirthDate = `${params.birthDate} ${params.birthTime}`;
        updateNeeded = true;
      } else if (isValidDate || isValidTime) {
        const user = await User.findByPk(userId, { rejectOnEmpty: new Error('User not found') });
        const currentBirthDate = user.birthDate ? dayjs(user.birthDate) : dayjs();

        if (isValidDate) {
          newBirthDate = `${params.birthDate} ${currentBirthDate.format('HH:mm:ss')}`;
        } else {
          newBirthDate = `${currentBirthDate.format('YYYY-MM-DD')} ${params.birthTime}`;
        }
        updateNeeded = true;
      } else {
        return {
          type: MessageType.SessionChat,
          data: await getTranslation('userInfoFormmatError', args.language),
        };
      }

      if (updateNeeded) {
        await User.findByPk(userId, { rejectOnEmpty: new Error('User not found') }).then((u) =>
          u.update({ birthDate: newBirthDate }),
        );
        return {
          type: MessageType.AIInstruction,
          data: await getTranslation('updateUserInfoSuccess', args.language),
        };
      }
    } else {
      return {
        type: MessageType.SessionChat,
        data: await getTranslation('unSupportAIInstruction', args.language),
      };
    }
  }
  return {
    type: MessageType.SessionChat,
    data: await getTranslation('cantFindUserId', args.language),
  };
};
