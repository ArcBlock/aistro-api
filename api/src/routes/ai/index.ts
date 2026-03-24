import { user } from '@blocklet/sdk/lib/middlewares/user';
import compression from 'compression';
import { Router } from 'express';
import Joi from 'joi';
import { omit, pick } from 'lodash';

import { UnauthorizedError } from '../../libs/auth';
import { config } from '../../libs/env';
import { BIRTH_DATE_SCHEMA, BIRTH_PLACE_SCHEMA, DATE_SCHEMA, HOROSCOPE_DATA_SCHEMA } from '../../libs/horoscope';
import { getLanguage } from '../../libs/language';
import logger from '../../libs/logger';
import Message, { MessageRole, MessageType, nextMessageId } from '../../store/models/message';
import User from '../../store/models/user';
import { handleLogin } from './handlers/auth';
import {
  handleRequestAddFriendProfile,
  handleUpdateFriendBirthDate,
  handleUpdateFriendBirthPlace,
  handleUpdateFriendName,
} from './handlers/friends';
import { handleAppInit, handleDailyInit } from './handlers/init';
import {
  handleAIInstruction,
  handleAcceptInvitation,
  handleGuide,
  handleLike,
  handleSuggestion,
} from './handlers/misc';
import { handleRequestCompleteProfile, handleUpdateBirthDate, handleUpdateBirthPlace } from './handlers/profile';
import { handleQuestion } from './handlers/question';
import {
  handleFriendNatalReport,
  handleNatalReport,
  handlePredict,
  handleSynastryReport,
  handleTodaysPredict,
} from './handlers/reports';
import { handleSessionChat } from './handlers/session-chat';
import { handleCompleteSubscription } from './handlers/subscription';
import { ReadableString, emitChunk } from './sse';
import { getTranslation } from './translations';
import type { ChatHandle, ChatHandleResult, ChatInput } from './types';

// ---------------------------------------------------------------------------
// HANDLERS dispatch table
// Maps MessageType → handler function.
// MessageType.RequestDailyNFT (7) and MessageType.MyMedal (16) are intentionally
// removed in the migration.
// ---------------------------------------------------------------------------

const HANDLERS: Record<number, ChatHandle<any>> = {
  [MessageType.Login]: handleLogin,
  [MessageType.Question]: handleQuestion,
  [MessageType.AppInit]: handleAppInit,
  [MessageType.DailyInit]: handleDailyInit,
  [MessageType.TodaysPredict]: handleTodaysPredict,
  [MessageType.RequestCompleteProfile]: handleRequestCompleteProfile,
  [MessageType.UpdateBirthDate]: handleUpdateBirthDate,
  [MessageType.UpdateBirthPlace]: handleUpdateBirthPlace,
  // MessageType.RequestDailyNFT (7) — REMOVED
  [MessageType.CompleteSubscription]: handleCompleteSubscription,
  [MessageType.RequestAddFriendProfile]: handleRequestAddFriendProfile,
  [MessageType.UpdateFriendBirthDate]: handleUpdateFriendBirthDate,
  [MessageType.UpdateFriendBirthPlace]: handleUpdateFriendBirthPlace,
  [MessageType.NatalReport]: handleNatalReport,
  [MessageType.SynastryReport]: handleSynastryReport,
  [MessageType.UpdateFriendName]: handleUpdateFriendName,
  // MessageType.MyMedal (16) — REMOVED
  [MessageType.Like]: handleLike,
  [MessageType.SessionChat]: handleSessionChat,
  [MessageType.FriendNatalReport]: handleFriendNatalReport,
  [MessageType.Guide]: handleGuide,
  [MessageType.Suggestion]: handleSuggestion,
  [MessageType.AcceptInvitation]: handleAcceptInvitation,
  [MessageType.Predict]: handlePredict,
  [MessageType.AIInstruction]: handleAIInstruction,
};

// ---------------------------------------------------------------------------
// chatBodySchema — Joi validation for POST /chat request body
// Identical to old code except .when() branches for MessageType.RequestDailyNFT
// and MessageType.MyMedal are removed.
// ---------------------------------------------------------------------------

export const chatBodySchema = Joi.object<{ stream?: boolean } & ChatInput>({
  stream: Joi.boolean(),
  utcOffset: Joi.number().integer().empty(Joi.valid('', null)),
  type: Joi.number()
    .valid(...Object.values(MessageType).filter((i) => typeof i === 'number'))
    .default(0),
})
  .when(Joi.object({ type: Joi.valid(MessageType.Login) }).unknown(), {
    then: Joi.object({
      googleIdToken: Joi.string(),
      appleIdToken: Joi.string(),
      name: Joi.string().max(50).empty(null),
      email: Joi.string().max(100).email().empty(null),
      avatar: Joi.string().max(200).empty(null),
      birthDate: BIRTH_DATE_SCHEMA.empty(null),
      birthPlace: BIRTH_PLACE_SCHEMA,
      horoscope: HOROSCOPE_DATA_SCHEMA,
      natalReportMessageId: Joi.string().max(50).empty(null),
    }).xor('googleIdToken', 'appleIdToken'),
  })
  .when(Joi.object({ type: Joi.valid(MessageType.TodaysPredict) }).unknown(), {
    then: Joi.object({
      birthDate: BIRTH_DATE_SCHEMA.required(),
      birthPlace: BIRTH_PLACE_SCHEMA.required(),
      horoscope: HOROSCOPE_DATA_SCHEMA,
      todayHoroscope: HOROSCOPE_DATA_SCHEMA,
    }),
  })
  .when(Joi.object({ type: Joi.valid(MessageType.Question) }).unknown(), {
    then: Joi.object({
      question: Joi.string().max(400).truncate().required(),
    }),
  })
  .when(Joi.object({ type: Joi.valid(MessageType.AppInit) }).unknown(), {
    then: Joi.object({
      num: Joi.number().integer().min(0).default(0),
    }),
  })
  .when(Joi.object({ type: Joi.valid(MessageType.CompleteSubscription) }).unknown(), {
    then: Joi.object({
      platform: Joi.string().valid('ios', 'android').required(),
      receipt: Joi.string().required(),
    }).when(Joi.object({ platform: Joi.valid('android') }).unknown(), {
      then: Joi.object({
        developerPayload: Joi.string().allow('').required(),
      }),
    }),
  })
  .when(Joi.object({ type: Joi.valid(MessageType.UpdateBirthDate) }).unknown(), {
    then: Joi.object({
      birthDate: BIRTH_DATE_SCHEMA.required(),
    }),
  })
  .when(Joi.object({ type: Joi.valid(MessageType.UpdateBirthPlace) }).unknown(), {
    then: Joi.object({
      birthDate: BIRTH_DATE_SCHEMA.required(),
      birthPlace: BIRTH_PLACE_SCHEMA.required(),
    }),
  })
  .when(Joi.object({ type: Joi.valid(MessageType.NatalReport) }).unknown(), {
    then: Joi.object({
      birthDate: BIRTH_DATE_SCHEMA.required(),
      birthPlace: BIRTH_PLACE_SCHEMA.required(),
      horoscope: HOROSCOPE_DATA_SCHEMA,
    }),
  })
  .when(Joi.object({ type: Joi.valid(MessageType.UpdateFriendName) }).unknown(), {
    then: Joi.object({
      name: Joi.string().max(50).required(),
    }),
  })
  .when(Joi.object({ type: Joi.valid(MessageType.UpdateFriendBirthDate) }).unknown(), {
    then: Joi.object({
      birthDate: BIRTH_DATE_SCHEMA.required(),
    }),
  })
  .when(Joi.object({ type: Joi.valid(MessageType.UpdateFriendBirthPlace) }).unknown(), {
    then: Joi.object({
      birthPlace: BIRTH_PLACE_SCHEMA.required(),
    }),
  })
  .when(Joi.object({ type: Joi.valid(MessageType.SynastryReport) }).unknown(), {
    then: Joi.object({
      birthDate: BIRTH_DATE_SCHEMA.required(),
      birthPlace: BIRTH_PLACE_SCHEMA.required(),
      horoscope: HOROSCOPE_DATA_SCHEMA,
      friend: Joi.object({
        name: Joi.string().max(50).truncate().empty(Joi.valid('', null)),
        birthDate: BIRTH_DATE_SCHEMA.required(),
        birthPlace: BIRTH_PLACE_SCHEMA.required(),
        horoscope: HOROSCOPE_DATA_SCHEMA,
      }).required(),
    }),
  })
  // MessageType.MyMedal (16) .when() — REMOVED
  .when(Joi.object({ type: Joi.valid(MessageType.Like) }).unknown(), {
    then: Joi.object({
      messageId: Joi.string().max(50).required(),
    }),
  })
  .when(Joi.object({ type: Joi.valid(MessageType.SessionChat) }).unknown(), {
    then: Joi.object({
      context: Joi.string().max(30000).truncate().empty(null).allow(''),
      user: Joi.object({
        name: Joi.string().max(50).empty(Joi.valid(null, '')),
        birthDate: BIRTH_DATE_SCHEMA.empty(Joi.valid(null, '')),
        birthPlace: BIRTH_PLACE_SCHEMA,
        horoscope: HOROSCOPE_DATA_SCHEMA,
      }),
      friend: Joi.object({
        name: Joi.string().max(50).empty(Joi.valid(null, '')),
        birthDate: BIRTH_DATE_SCHEMA.empty(Joi.valid(null, '')),
        birthPlace: BIRTH_PLACE_SCHEMA,
        horoscope: HOROSCOPE_DATA_SCHEMA,
      }),
      history: Joi.array()
        .items(
          Joi.object({
            role: Joi.string().valid('assistant', 'user').required(),
            content: Joi.string().max(1000).truncate().empty(''),
          }),
        )
        .max(50),
      question: Joi.string().max(400).truncate().required(),
    }),
  })
  .when(Joi.object({ type: Joi.valid(MessageType.FriendNatalReport) }).unknown(), {
    then: Joi.object({
      name: Joi.string().max(50).empty(null),
      birthDate: BIRTH_DATE_SCHEMA.required(),
      birthPlace: BIRTH_PLACE_SCHEMA.required(),
      horoscope: HOROSCOPE_DATA_SCHEMA,
    }),
  })
  .when(Joi.object({ type: Joi.valid(MessageType.Guide) }).unknown(), {
    then: Joi.object({
      question: Joi.string().max(400).truncate().empty(Joi.valid('', null)),
    }),
  })
  .when(Joi.object({ type: Joi.valid(MessageType.Suggestion) }).unknown(), {
    then: Joi.object({
      suggestionId: Joi.string().max(50).required(),
    }),
  })
  .when(Joi.object({ type: Joi.valid(MessageType.AcceptInvitation) }).unknown(), {
    then: Joi.object({
      invitationCode: Joi.string().max(20).required(),
    }),
  })
  .when(Joi.object({ type: Joi.valid(MessageType.Predict) }).unknown(), {
    then: Joi.object({
      birthDate: BIRTH_DATE_SCHEMA.required(),
      birthPlace: BIRTH_PLACE_SCHEMA.required(),
      horoscope: HOROSCOPE_DATA_SCHEMA,
      date: DATE_SCHEMA.required(),
      dateHoroscope: HOROSCOPE_DATA_SCHEMA,
    }),
  })
  .when(Joi.object({ type: Joi.valid(MessageType.AIInstruction) }).unknown(), {
    then: Joi.object({
      params: Joi.string().required(),
    }),
  });

// ---------------------------------------------------------------------------
// Message types that require authentication
// (all except Login, AppInit, Guide, SessionChat in some cases)
// ---------------------------------------------------------------------------

const AUTH_REQUIRED_TYPES: MessageType[] = [
  MessageType.CompleteSubscription,
  MessageType.Like,
  MessageType.Question,
  MessageType.DailyInit,
  MessageType.TodaysPredict,
  MessageType.RequestCompleteProfile,
  MessageType.UpdateBirthDate,
  MessageType.UpdateBirthPlace,
  MessageType.RequestAddFriendProfile,
  MessageType.SynastryReport,
  MessageType.UpdateFriendBirthDate,
  MessageType.UpdateFriendBirthPlace,
  MessageType.UpdateFriendName,
  MessageType.FriendNatalReport,
  MessageType.NatalReport,
  MessageType.AcceptInvitation,
  MessageType.Predict,
  MessageType.Suggestion,
  MessageType.AIInstruction,
];

// ---------------------------------------------------------------------------
// Router
// ---------------------------------------------------------------------------

const router = Router();

router.post('/chat', compression(), user(), async (req, res) => {
  const { did: userId } = req.user ?? {};
  const language = getLanguage(req);

  // 1. Validate input ----------------------------------------------------------
  const body = chatBodySchema.validate(req.body, { stripUnknown: true });
  if (body.error) {
    const message = await getTranslation(
      /question.*length/.test(body.error.message) ? 'questionOverLengthLimit' : 'error',
      language,
      config.defaultLanguage,
    );

    if (req.body.stream === true) {
      const [count, isSub] = userId ? await Message.remainingQueryCount({ userId }) : [undefined, false];
      res.write(
        `data:${JSON.stringify({
          content: message,
          context: { id: nextMessageId(), remainingQueryCount: isSub ? undefined : count },
        })}\r\n\r\n`,
      );
      res.write('[DONE]');
      res.end();
    } else {
      res.status(400).json({ error: { message } });
    }

    return;
  }

  const { stream, ...input } = body.value;

  // 2. Auth check — certain message types require userId -----------------------
  if ((AUTH_REQUIRED_TYPES as number[]).includes(input.type)) {
    if (!userId) {
      throw new UnauthorizedError();
    }
  }

  // 3. Query limit check -------------------------------------------------------
  let remainingQueryCount: number | undefined;

  const endResponse = (
    content: string,
    options: {
      context?: object;
      next?: ChatInput;
      actions?: ChatHandleResult['actions'];
      input?: ChatHandleResult['input'];
    } = {},
  ) => {
    if (stream) {
      res.write(
        `data:${JSON.stringify({ content, ...options, context: { ...options.context, remainingQueryCount } })}\r\n\r\n`,
      );
      res.write('[DONE]');
      res.end();
    } else {
      res.json({ content, ...options, context: { ...options.context, remainingQueryCount } });
    }
  };

  if (userId) {
    const [count, isSub] = await Message.remainingQueryCount({ userId });
    remainingQueryCount = count;

    if (typeof remainingQueryCount === 'number') {
      if (config.limitation.countMessageType.includes(input.type) && input.type !== MessageType.CompleteSubscription) {
        if (remainingQueryCount <= 0) {
          endResponse(await getTranslation('queryLimitReached', language));
          return;
        }
      }

      // do not return `remainingQueryCount` if the user is subscribed
      if (isSub) {
        remainingQueryCount = undefined;
      }
    }
  }

  // 4. Update user language / utcOffset ----------------------------------------
  const userRecord = userId ? await User.findByPk(userId) : null;
  if (userRecord?.language !== language) {
    await userRecord?.update({ language });
  }

  if (typeof input.utcOffset === 'number' && userRecord) {
    await userRecord.update({ utcOffset: input.utcOffset });
  }

  // 5. Invite code gate --------------------------------------------------------
  if (
    config.limitation.requireInvite &&
    ![MessageType.AppInit, MessageType.Login, MessageType.Guide, MessageType.AcceptInvitation].includes(input.type) &&
    userRecord &&
    !userRecord.inviteCode
  ) {
    endResponse(await getTranslation('requireInvite', language));
    return;
  }

  // 6. Create message pair (user + ai) -----------------------------------------
  const [, message] = (await Message.bulkCreate([
    {
      userId,
      type: input.type,
      role: MessageRole.user,
      content:
        input.type === MessageType.Question || input.type === MessageType.SessionChat ? input.question : undefined,
      parameters: { ...omit(input, 'type'), language },
    },
    {
      userId,
      type: input.type,
      role: MessageRole.ai,
    },
  ])) as [Message, Message];

  // 7. emitChunk helper — writes a single SSE data frame -----------------------
  const emitChunkFn = (chunk: any) => {
    if (!res.headersSent) {
      // NOTE: For compatibility with mobile clients — some Android/iOS versions
      // require Content-Type: text/event-stream, others do not.
      const accept = req.get('Accept');
      if (accept) {
        res.set('Content-Type', accept);
        res.flushHeaders();
      }
    }

    emitChunk(res, chunk);
  };

  // 8. Dispatch to handler -----------------------------------------------------
  logger.info('[chat] request', { type: input.type, stream, userId, language });
  const handler: ChatHandle<typeof input.type> = HANDLERS[input.type] as any;
  const { data, ...response } = await handler({
    stream,
    language,
    userId,
    input,
    message,
    emitChunk: emitChunkFn,
    req,
  });

  // 9. Calculate remaining query count -----------------------------------------
  if (
    typeof remainingQueryCount === 'number' &&
    config.limitation.countMessageType.includes(response.type) &&
    input.type !== MessageType.CompleteSubscription
  ) {
    remainingQueryCount -= 1;
  }

  if (response.type === MessageType.CompleteSubscription) {
    remainingQueryCount = undefined;
  } else if (response.type === MessageType.Login && response.context) {
    const { userId: loginUserId } = response.context as any;
    if (!loginUserId) {
      throw new Error('Unexpected: userId does not exist');
    }
    const r = await Message.remainingQueryCount({ userId: loginUserId });
    remainingQueryCount = r[1] ? undefined : r[0];
  }

  // 10. Update message record --------------------------------------------------
  await message.update({
    type: response.type,
    actions: response.actions,
    input: response.input,
    next: response.next,
    img: response.img,
    title: response.title,
    report: response.report,
    parameters: { language, ...response.parameters },
    suggestions: response.suggestions,
  });

  const context = {
    ...pick(message, 'id', 'userId', 'type', 'role', 'img'),
    ...response.context,
    remainingQueryCount,
  };

  // 11. Response handling ------------------------------------------------------
  // Non-stream + string data -> JSON response
  if (!stream && typeof data === 'string') {
    res.json({ ...response, content: data, context });
    await message.update({ content: data });
    return;
  }

  // Stream mode -> SSE pipeline
  const decoder = new TextDecoder();
  let isFirstResponse = true;

  const readable = !data || typeof data === 'string' ? new ReadableString(data || ' ') : data;

  // In non-stream mode, store sseDirective contents (e.g. next/suggestions)
  const sseDirectives = {};

  let content = '';

  for await (const chunk of readable) {
    // Handle sseDirective objects
    if (typeof chunk.sseDirective === 'object') {
      if (stream) emitChunkFn({ content: '', ...chunk.sseDirective });
      else Object.assign(sseDirectives, chunk.sseDirective);
    }

    // Accumulate content from various chunk shapes
    content += typeof chunk === 'string' ? chunk : Buffer.isBuffer(chunk) ? decoder.decode(chunk) : chunk.content || '';

    if (!content.trim()) {
      continue;
    }

    if (stream && content) {
      const t = content.trimEnd();
      content = content.slice(t.length);

      const json: Record<string, any> = { content: t };
      if (isFirstResponse) {
        isFirstResponse = false;
        json.content = json.content.trimStart();
        Object.assign(json, omit(response, 'report'), { context });
      }
      emitChunkFn(json);
    }
  }

  logger.info('[chat] stream complete', { type: response.type, contentLength: content.length });

  if (stream) {
    res.write('[DONE]');
    res.end();
  } else {
    res.json({
      ...response,
      content,
      context: { ...sseDirectives, ...context },
    });
  }

  await message.update({ content });
});

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export { HANDLERS, getTranslation };
export default router;
