import { AIGNEHubImageModel } from '@aigne/aigne-hub';

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
