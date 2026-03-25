/**
 * Image functions for report illustrations.
 *
 * Image preheating / AI generation has been removed.
 * These functions are kept for backward compatibility but always return undefined.
 */

/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Sign, Star } from './horoscope';

export function randomFortuneImage(_type: string): string | undefined {
  return undefined;
}

export function randomNatalImage(_isVip: boolean, _sign: Sign, _sn?: string): string | undefined {
  return undefined;
}

export function randomSynastryImage(_isVip: boolean, _star: Star, _sn?: string): string | undefined {
  return undefined;
}

export function randomPredictImage(_isVip: boolean, _dimension: string, _sn?: string): string | undefined {
  return undefined;
}

export function replacePredictImageByVip(
  image: string | undefined,
  _topic: string,
  _isVip: boolean,
): string | undefined {
  return image;
}

export function randomBackgroundImage(_isVip?: boolean, _sn?: string): string | undefined {
  return undefined;
}
