import { AIGNEHubImageModel } from '@aigne/aigne-hub';
import { getComponentMountPoint, getComponentWebEndpoint } from '@blocklet/sdk/lib/component';
import { sign } from '@blocklet/sdk/lib/util/verify-sign';
import axios from 'axios';
import { rmSync } from 'fs';
import { joinURL } from 'ufo';

import env from '../libs/env';
import logger from '../libs/logger';

const DEFAULT_IMAGE_MODEL = 'openai/gpt-image-1';

let imageModel: AIGNEHubImageModel;

export function getImageModel(): AIGNEHubImageModel {
  if (!imageModel) {
    imageModel = new AIGNEHubImageModel({
      model: process.env.AI_IMAGE_MODEL || DEFAULT_IMAGE_MODEL,
    });
  }
  return imageModel;
}

/**
 * Upload a local file to the image-bin component and return its persistent URL.
 */
async function uploadToImageBin(filePath: string, filename: string): Promise<string> {
  const data = { type: 'path', filename, data: filePath };
  const sig = await sign(data);

  const { data: image } = await axios({
    url: '/api/sdk/uploads',
    baseURL: getComponentWebEndpoint('image-bin'),
    method: 'POST',
    headers: {
      'x-component-sig': sig,
      'x-component-did': process.env.BLOCKLET_COMPONENT_DID,
    },
    data,
  });

  const url = new URL(env.appUrl);
  const mountPoint = getComponentMountPoint('image-bin');
  url.pathname = joinURL(mountPoint || '/', '/uploads', image.filename);
  return url.toString();
}

/**
 * Generate an image using AI and upload it to image-bin.
 * Returns the persistent image URL.
 */
export async function generateImage(prompt: string): Promise<string> {
  const model = getImageModel();

  const result = await model.invoke({
    prompt,
    outputFileType: 'local',
  });

  const file = result.images?.[0];
  if (!file || file.type !== 'local' || !file.path) {
    throw new Error('AI image generation returned no local file');
  }

  try {
    const url = await uploadToImageBin(file.path, file.filename || `ai-${Date.now()}.png`);
    logger.info('AI image generated and uploaded', { prompt: prompt.slice(0, 80), url });
    return url;
  } finally {
    try {
      rmSync(file.path, { force: true });
    } catch {
      // ignore cleanup errors
    }
  }
}
