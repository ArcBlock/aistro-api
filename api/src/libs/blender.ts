/**
 * Image functions for report illustrations.
 *
 * Replaces the old nft-blender URL construction with AI-generated image cache lookups.
 * Function signatures are kept backward-compatible: isVip and sn parameters are accepted
 * but ignored (VIP image differentiation is removed; AI images are always high quality).
 */

/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Sign, Star } from './horoscope';
import { getImage } from './image-cache';

export function randomFortuneImage(type: string): string | undefined {
  return getImage(`fortune-${type}`);
}

export function randomNatalImage(_isVip: boolean, sign: Sign, _sn?: string): string | undefined {
  return getImage(`natal-${sign}`);
}

export function randomSynastryImage(_isVip: boolean, star: Star, _sn?: string): string | undefined {
  return getImage(`synastry-${star}`);
}

export function randomPredictImage(_isVip: boolean, dimension: string, _sn?: string): string | undefined {
  return getImage(`predict-${dimension.toLowerCase()}`);
}

export function replacePredictImageByVip(
  image: string | undefined,
  _topic: string,
  _isVip: boolean,
): string | undefined {
  return image;
}

export function randomBackgroundImage(_isVip?: boolean, _sn?: string): string | undefined {
  return getImage('background');
}
