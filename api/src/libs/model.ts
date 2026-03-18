import { AIGNEHubChatModel } from '@aigne/aigne-hub';

const DEFAULT_MODEL = 'google/gemini-3-flash-preview';

export default function createModel(options?: { model?: string; temperature?: number; maxOutputTokens?: number }) {
  const model = options?.model || process.env.DIVINATION_MODEL || DEFAULT_MODEL;

  return new AIGNEHubChatModel({
    model,
    modelOptions: {
      temperature: options?.temperature,
    },
  });
}
