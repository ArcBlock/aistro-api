import type { ChatModelOutput } from '@aigne/core';

import { getModel } from './model';
import { formatHistory, loadPrompt, render } from './prompt';

type Role = 'system' | 'user' | 'agent';

interface ChatMessage {
  role: Role;
  content: string;
}

export interface HistoryMessage {
  role: 'user' | 'assistant' | 'agent';
  content: string;
}

interface InvokeOptions {
  /** Conversation history to embed in the prompt template as formatted text */
  history?: HistoryMessage[];
  /** Current user message — appended as the last user message */
  userMessage?: string;
}

/**
 * Build the messages array for model.invoke().
 * System prompt is the rendered template. History is formatted and injected
 * into the template via $history variable. User message is appended last.
 */
function buildMessages(promptPath: string, vars: Record<string, string>, options?: InvokeOptions): ChatMessage[] {
  const templateVars = { ...vars };

  // Format $history as inline text for prompts that embed it in the system message
  if (options?.history?.length) {
    templateVars.$history = formatHistory(options.history);
  }

  const system = render(loadPrompt(promptPath), templateVars);
  const messages: ChatMessage[] = [{ role: 'system', content: system }];

  if (options?.userMessage) {
    messages.push({ role: 'user', content: options.userMessage });
  }

  return messages;
}

/**
 * Invoke the model and return the full text response.
 * Use for report sub-prompts, translation, summarization, etc.
 */
export async function invokeText(
  promptPath: string,
  vars: Record<string, string>,
  options?: InvokeOptions,
): Promise<string> {
  const messages = buildMessages(promptPath, vars, options);
  const result: ChatModelOutput = await getModel().invoke({ messages });
  return result.text || '';
}

/**
 * Invoke the model and return an async iterable of text chunks.
 * Use for chat streaming scenarios.
 */
export async function invokeStream(
  promptPath: string,
  vars: Record<string, string>,
  options?: InvokeOptions,
): Promise<AsyncIterable<string>> {
  const messages = buildMessages(promptPath, vars, options);
  const stream = await getModel().invoke({ messages }, { streaming: true });

  return textStream(stream);
}

/**
 * Extract text deltas from an AgentResponseStream, yielding only non-empty strings.
 */
async function* textStream(stream: ReadableStream<any>): AsyncIterable<string> {
  const reader = stream.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      // AgentResponseDelta: chunk.delta.text is Partial<{ text: string, ... }>
      const text = value?.delta?.text?.text;
      if (text) yield text;
    }
  } finally {
    reader.releaseLock();
  }
}
