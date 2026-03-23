import { AIGNEHubChatModel } from '@aigne/aigne-hub';

const DEFAULT_MODEL = 'google/gemini-3-flash-preview';

let model: AIGNEHubChatModel;

export function getModel(): AIGNEHubChatModel {
  if (!model) {
    model = new AIGNEHubChatModel({
      model: process.env.AI_MODEL || DEFAULT_MODEL,
    });
  }
  return model;
}
