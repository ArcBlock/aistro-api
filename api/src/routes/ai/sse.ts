import Joi from 'joi';
import { Readable } from 'stream';

import { suggestQuestions } from '../../ai/utils';
import { config } from '../../libs/env';
import logger from '../../libs/logger';
import { xRead } from '../../libs/redis';
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
              // back-pressure — wait until _read is called again
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
// createReadableFromRedisStream — reads from Redis streams using xRead
// ---------------------------------------------------------------------------

export function createReadableFromRedisStream(
  key: string,
  { recommendsStreamKey }: { recommendsStreamKey?: string } = {},
) {
  const readable = new Readable({ read: () => {}, objectMode: true });

  (async () => {
    try {
      let id = '0-0';
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const res = await xRead({ key, id }, { BLOCK: 60000 });
        if (!res) break;
        for (const i of (res as any[]).flatMap((i: any) => i.messages)) {
          if (readable.closed) return;

          const { content, done, next } = i.message;

          if (content) readable.push({ content });

          if (done === 'true') {
            readable.push({ sseDirective: { contentEnd: true } });

            if (next) {
              readable.push({ sseDirective: { next: { type: MessageType.Suggestion, suggestionId: next } } });
            } else if (recommendsStreamKey) {
              const res = await xRead({ key: recommendsStreamKey, id: '0-0' }, { COUNT: 1, BLOCK: 30000 });
              const msg = (res as any[])?.flatMap((i: any) => i.messages)[0]?.message.recommends;
              if (msg) {
                const recommends = JSON.parse(msg);
                if (Array.isArray(recommends)) {
                  const suggestions = recommends
                    .map((question) =>
                      typeof question === 'string' && question
                        ? ({ type: MessageType.SessionChat, question } as const)
                        : undefined,
                    )
                    .filter((i): i is NonNullable<typeof i> => !!i);

                  readable.push({ sseDirective: { suggestions } });
                }
              }
            }
            readable.push(null);
            return;
          }

          id = i.id;
        }
      }
    } catch (error) {
      logger.error('read message from redis error', error);
    }
    if (!readable.closed) readable.push(null);
  })();

  return readable;
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
