import type { HistoryMessage } from './invoke';
import { invokeStream } from './invoke';

/**
 * General astrology Q&A chat (Susan Miller persona). Returns a text stream.
 */
export async function chatQuestion(params: {
  question: string;
  language: string;
  userInfo: string;
  context: string;
  report?: string;
  history?: HistoryMessage[];
}): Promise<AsyncIterable<string>> {
  return invokeStream(
    'chat/question',
    {
      language: params.language,
      userInfo: params.userInfo,
      context: params.context,
      report: params.report || '',
    },
    { history: params.history, userMessage: params.question },
  );
}

/**
 * New user guide chat. Returns a text stream.
 */
export async function chatGuide(params: {
  question: string;
  language: string;
  history?: HistoryMessage[];
}): Promise<AsyncIterable<string>> {
  return invokeStream(
    'chat/guide',
    { language: params.language },
    { history: params.history, userMessage: params.question },
  );
}

/**
 * Multi-turn session chat. Reuses the question prompt with full context injection.
 * In the old project this was a separate `sessionChat` agent; here we reuse `chat/question`
 * with richer context (friend info, time context, long-term memory).
 */
export async function chatSession(params: {
  question: string;
  language: string;
  userInfo: string;
  context: string;
  report?: string;
  history?: HistoryMessage[];
}): Promise<AsyncIterable<string>> {
  return invokeStream(
    'chat/question',
    {
      language: params.language,
      userInfo: params.userInfo,
      context: params.context,
      report: params.report || '',
    },
    { history: params.history, userMessage: params.question },
  );
}

type QuestionCategory = 'natal' | 'predict' | 'moon-phase' | 'general';

/**
 * Classify a user question to determine which report context to fetch.
 * Replaces the old LLM-based chat-context-router agent with keyword matching.
 */
export function classifyQuestion(question: string): QuestionCategory {
  const q = question.toLowerCase();

  const moonKeywords = ['moon', 'planet', 'retrograde', 'lunar', 'phase', '月相', '逆行', '行星'];
  if (moonKeywords.some((k) => q.includes(k))) return 'moon-phase';

  const predictKeywords = [
    'horoscope',
    'predict',
    'today',
    'tomorrow',
    'this week',
    'daily',
    'weekly',
    'yearly',
    '运势',
    '今天',
    '明天',
    '本周',
    '每日',
  ];
  if (predictKeywords.some((k) => q.includes(k))) return 'predict';

  const natalKeywords = [
    'natal',
    'birth',
    'career',
    'fortune',
    'love',
    'zodiac',
    'sign',
    'birthday',
    'birth place',
    '本命',
    '星盘',
    '事业',
    '爱情',
    '星座',
  ];
  if (natalKeywords.some((k) => q.includes(k))) return 'natal';

  return 'general';
}
