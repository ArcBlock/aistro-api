import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const PROMPT_DIR = process.env.BLOCKLET_APP_DIR
  ? join(process.env.BLOCKLET_APP_DIR, 'prompts')
  : join(__dirname, '../prompts');
const cache = new Map<string, string>();

/**
 * Load a prompt template by path (relative to prompts/ directory, without .md extension).
 * Example: loadPrompt('chat/question'), loadPrompt('report/predict-title')
 */
export function loadPrompt(path: string): string {
  if (!cache.has(path)) {
    cache.set(path, readFileSync(join(PROMPT_DIR, `${path}.md`), 'utf-8'));
  }
  return cache.get(path)!;
}

/**
 * Render template variables in a prompt string.
 * Replaces {{ variableName }} with corresponding values from vars.
 * The special variable `$history` is handled separately — see formatHistory().
 */
export function render(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{\s*([\w.$]+)\s*\}\}/g, (_, key) => {
    if (key === '$history') return vars.$history ?? '';
    return vars[key] ?? '';
  });
}

/**
 * Format conversation history as a readable string for embedding in system prompts.
 * Used when prompts contain `{{ $history }}` in the system message body.
 */
export function formatHistory(history: { role: string; content: string }[]): string {
  return history
    .map((msg) => {
      const role = msg.role === 'assistant' || msg.role === 'agent' ? 'Assistant' : 'User';
      return `${role}: ${msg.content}`;
    })
    .join('\n');
}
