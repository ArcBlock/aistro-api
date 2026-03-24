import Joi from 'joi';
import { Readable } from 'stream';

import { suggestQuestions } from '../../ai/utils';
import { config } from '../../libs/env';
import logger from '../../libs/logger';
import { MessageType } from '../../store/models/message';

// ---------------------------------------------------------------------------
// ReadableString — simulates "typing" by chunking text word-by-word
// ---------------------------------------------------------------------------

export class ReadableString extends Readable {
  constructor(content: string) {
    super();
    // Split on word boundaries: keep sequences of word chars together, and
    // treat every non-word character (including whitespace) as its own segment.
    this.segments = content.match(/\w+|\S|\s/g) ?? [];
  }

  private segments: string[];

  override _read(): void {
    setTimeout(() => {
      const seg = this.segments.shift();
      this.push(seg !== undefined ? seg : null);
    }, config.outputSpeed);
  }
}

// ---------------------------------------------------------------------------
// emitChunk — write a single SSE data frame
// NOTE: NO space after "data:" — mobile clients parse this exact format.
// ---------------------------------------------------------------------------

export function emitChunk(res: any, chunk: any) {
  res.write(`data:${JSON.stringify(chunk)}\r\n\r\n`);
  if (typeof res.flush === 'function') res.flush();
}

// ---------------------------------------------------------------------------
// asyncIterableToReadable — wraps AsyncIterable<string> into an object-mode
// Readable that produces { content: string } chunks (matching the SSE shape
// expected by emitChunk consumers).
// ---------------------------------------------------------------------------

export function asyncIterableToReadable(source: AsyncIterable<string>): Readable {
  let started = false;

  return new Readable({
    objectMode: true,
    read() {
      if (started) return;
      started = true;

      (async () => {
        try {
          for await (const text of source) {
            if (!this.push({ content: text })) {
              await new Promise<void>((resolve) => {
                this.once('drain', resolve);
              });
            }
          }
        } catch (error) {
          logger.error('asyncIterableToReadable error', error);
        }
        this.push(null);
      })();
    },
  });
}

// ---------------------------------------------------------------------------
// asyncIterableToReadableWithRecommendations — wraps AsyncIterable<string>
// into an object-mode Readable, then appends contentEnd and recommendation
// suggestions after the stream finishes.
// ---------------------------------------------------------------------------

export function asyncIterableToReadableWithRecommendations(
  source: AsyncIterable<string>,
  { language }: { language: string },
): Readable {
  let started = false;

  return new Readable({
    objectMode: true,
    read() {
      if (started) return;
      started = true;

      (async () => {
        const chunks: string[] = [];
        try {
          for await (const text of source) {
            this.push({ content: text });
            chunks.push(text);
          }
        } catch (error) {
          logger.error('asyncIterableToReadableWithRecommendations stream error', error);
        }

        logger.info('[sse] stream ended', { chunksCount: chunks.length, totalLength: chunks.join('').length });
        this.push({ sseDirective: { contentEnd: true } });

        try {
          const answer = chunks.join('');
          if (answer) {
            logger.info('[sse] generating recommendations...');
            const recommends = await generateRecommendsOfAnswer({ language, answer });
            if (recommends && recommends.length > 0) {
              const suggestions = recommends
                .filter((q): q is string => typeof q === 'string' && !!q)
                .map((question) => ({ type: MessageType.SessionChat, question }) as const);
              if (suggestions.length > 0) {
                logger.info('[sse] sending recommendations', { count: suggestions.length });
                this.push({ sseDirective: { suggestions } });
              }
            }
          }
        } catch (error) {
          logger.error('Failed to generate recommendations inline', error);
        }

        this.push(null);
      })();
    },
  });
}

// ---------------------------------------------------------------------------
// generateRecommendsOfAnswer — suggest follow-up questions for an AI answer
// ---------------------------------------------------------------------------

export async function generateRecommendsOfAnswer({
  language,
  answer,
}: {
  language: string;
  answer: string;
}): Promise<string[] | undefined> {
  try {
    const arr = await suggestQuestions({ question: answer, context: language });
    return await Joi.array().items(Joi.string()).validateAsync(arr);
  } catch {
    logger.error('Failed to generate recommends of answer');
  }
  return undefined;
}
