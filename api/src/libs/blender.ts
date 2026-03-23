import { getComponentMountPoint } from '@blocklet/sdk/lib/component';
import { randomInt } from 'crypto';

import env, { config } from './env';
import { Sign, Star } from './horoscope';

export function randomFortuneImage(type: string) {
  const { blender } = config;

  const imageTemplate = blender.fortune?.types?.[type];

  return imageTemplate && randomBlenderImage({ ...imageTemplate });
}

export function randomNatalImage(isVip: boolean, sign: Sign, sn?: string) {
  const { blender } = config;

  const imageTemplate = (isVip && blender.vip?.natal?.signs?.[sign]) || blender.natal?.signs?.[sign];

  return imageTemplate && randomBlenderImage({ ...imageTemplate, sn });
}

export function randomSynastryImage(isVip: boolean, star: Star, sn?: string) {
  const { blender } = config;

  const imageTemplate = (isVip && blender.vip?.synastry?.stars?.[star]) || blender.synastry?.stars?.[star];

  return imageTemplate && randomBlenderImage({ ...imageTemplate, sn });
}

export function randomPredictImage(isVip: boolean, dimension: string, sn?: string) {
  const topic = dimension.toLowerCase();

  const { blender } = config;

  const imageTemplate =
    (isVip && (blender.vip?.predict?.dimensions?.[topic] || blender.vip?.predict?.default)) ||
    blender?.predict?.dimensions?.[topic] ||
    blender?.predict?.default;

  return imageTemplate && randomBlenderImage({ ...imageTemplate, sn });
}

export function replacePredictImageByVip(image: string | undefined, topic: string, isVip: boolean) {
  const sn = image?.match(/sn=(?<sn>\d+)/)?.groups?.sn;
  if (!sn) return image;
  return randomPredictImage(isVip, topic, sn);
}

export function randomBackgroundImage(isVip: boolean, sn?: string) {
  const { blender } = config;

  const imageTemplate = (isVip && blender.vip?.background) || blender.background;

  return imageTemplate && randomBlenderImage({ ...imageTemplate, sn });
}

export function randomBlenderImage({
  templateId,
  count,
  sn,
}: {
  templateId: string;
  count: number;
  sn?: number | string;
}) {
  const blender = getComponentMountPoint('nft-blender');

  let s = sn;
  if (typeof s !== 'number' && !s) {
    if (!blender || !count || !templateId) return undefined;
    s = sn ?? randomInt(1, count + 1);
  }

  return `${env.appUrl}${blender}/api/templates/cache-preview/${templateId}.png?sn=${s}&imageFilter=resize&w=750&f=webp`;
}
