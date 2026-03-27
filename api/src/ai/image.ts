import { AIGNEHubImageModel } from '@aigne/aigne-hub';
import path from 'path';

import imageMap from '../assets/report-images/image-map.json';

const IMAGE_MODEL = 'google/gemini-2.5-flash-image';

let imageModel: AIGNEHubImageModel;

export function getImageModel(): AIGNEHubImageModel {
  if (!imageModel) {
    imageModel = new AIGNEHubImageModel({ model: IMAGE_MODEL });
  }
  return imageModel;
}

/**
 * Generate an image from a text prompt. Returns the image URL.
 */
export async function generateImage(prompt: string): Promise<string> {
  const result = await getImageModel().invoke({
    prompt,
    outputFileType: 'url',
  });

  const image = result.images?.[0];
  if (!image || image.type !== 'url') {
    throw new Error('Image generation failed: no URL returned');
  }
  return image.url;
}

// ---------------------------------------------------------------------------
// Pre-generated report image pool
// ---------------------------------------------------------------------------

export const REPORT_IMAGES_DIR = path.resolve(__dirname, '../assets/report-images');
export const REPORT_IMAGES_URL_PREFIX = '/api/report-images';

/**
 * Select a pre-generated report image by report type and topic/star.
 * Returns a URL path that can be used directly in <img src>, or undefined if no match.
 */
export function selectReportImage(type: string, topic: string): string | undefined {
  const pool = (imageMap as Record<string, Record<string, string[]>>)[type];
  const images = pool?.[topic.toLowerCase()];
  if (!images?.length) return undefined;
  const file = images[Math.floor(Math.random() * images.length)];
  return `${REPORT_IMAGES_URL_PREFIX}/${file}`;
}
