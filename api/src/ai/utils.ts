import type { HistoryMessage } from './invoke';
import { invokeText } from './invoke';

/**
 * Translate content to the specified language.
 */
export async function translate(content: string, language: string): Promise<string> {
  return invokeText('util/translate', { question: content, language });
}

/**
 * Summarize content in the specified language.
 */
export async function summarize(content: string, language: string): Promise<string> {
  return invokeText('util/summary', { content, language });
}

/**
 * Generate 3 follow-up question suggestions based on the user's question.
 * Returns a JSON array of strings.
 */
export async function suggestQuestions(params: {
  question: string;
  context?: string;
  history?: HistoryMessage[];
}): Promise<string[]> {
  const text = await invokeText(
    'util/suggest-questions',
    { question: params.question, context: params.context || '' },
    { history: params.history },
  );
  return parseJsonArray(text);
}

/**
 * Generate 3 follow-up question suggestions for the guide scenario.
 */
export async function guideSuggestQuestions(params: {
  question: string;
  history?: HistoryMessage[];
}): Promise<string[]> {
  const text = await invokeText(
    'util/guide-suggest-questions',
    { question: params.question },
    { history: params.history },
  );
  return parseJsonArray(text);
}

function parseJsonArray(text: string): string[] {
  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) return parsed as string[];
  } catch {
    // Fallback: split by newlines if not valid JSON
  }
  return text
    .split('\n')
    .map((line) =>
      line
        .replace(/^\d+\.\s*/, '')
        .replace(/^["']|["']$/g, '')
        .trim(),
    )
    .filter(Boolean);
}
