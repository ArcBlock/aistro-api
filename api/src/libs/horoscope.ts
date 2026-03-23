import { Horoscope, Origin } from 'circular-natal-horoscope-js/dist';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import Joi from 'joi';
import { pick } from 'lodash';
import lunarCalc from 'lunarphase-calculator';

import type { HoroscopeChartData, HoroscopeStars } from './types';

dayjs.extend(utc);
dayjs.extend(timezone);

const BIRTH_DATE_REGEX = /^\d{4}-\d{2}-\d{2}( \d{2}:\d{2}(:\d{2})?)?$/;

export const Stars = [
  'sun',
  'moon',
  'ascendant',
  'mercury',
  'venus',
  'mars',
  'jupiter',
  'saturn',
  'uranus',
  'neptune',
] as const;

export type Star = (typeof Stars)[number];

export const Signs = [
  'aries',
  'taurus',
  'gemini',
  'cancer',
  'leo',
  'virgo',
  'libra',
  'scorpio',
  'sagittarius',
  'capricorn',
  'aquarius',
  'pisces',
] as const;

export type Sign = (typeof Signs)[number];

export const PredictTopics = ['love', 'creativity', 'career', 'wealth'] as const;

export const FortuneTypes = ['2024_new_year', '', '2024_dragon_spring_festival', '2025_snake_spring_festival'] as const;

export type PredictTopic = (typeof PredictTopics)[number];

export const BIRTH_DATE_SCHEMA = Joi.string()
  .regex(BIRTH_DATE_REGEX)
  .custom((value) => {
    if (!value) {
      return value;
    }
    const d = dayjs(value);
    if (!d.isValid()) {
      throw new Error('Invalid date');
    }
    return d.format('YYYY-MM-DD HH:mm:ss');
  });

export const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export const DATE_SCHEMA = Joi.string()
  .regex(DATE_REGEX)
  .custom((value) => {
    if (!value) {
      return value;
    }
    const d = dayjs(value);
    if (!d.isValid()) {
      throw new Error('Invalid date');
    }
    return d.format('YYYY-MM-DD');
  });

export const BIRTH_PLACE_SCHEMA = Joi.object({
  longitude: Joi.number().required(),
  latitude: Joi.number().required(),
  address: Joi.string().max(200).required(),
});

export const HOROSCOPE_DATA_SCHEMA = Joi.object({
  stars: Joi.array()
    .items(
      Joi.object({
        star: Joi.string()
          .valid(...Stars)
          .required(),
        sign: Joi.string()
          .valid(...Signs)
          .required(),
        house: Joi.number().integer().min(1).max(12).required(),
        decimalDegrees: Joi.number().required(),
        arcDegreesFormatted30: Joi.string().max(100).required(),
      }),
    )
    .required(),
  chartData: Joi.object({
    planets: Joi.object()
      .pattern(Joi.string().max(100), Joi.array().items(Joi.number()).max(100).required())
      .required(),
    cusps: Joi.array().items(Joi.number()).max(100).required(),
  }).required(),
});

export default function getHoroscope({
  birthDate,
  birthPlace,
}: {
  birthDate: string;
  birthPlace: { longitude: number; latitude: number };
}) {
  const d = dayjs(birthDate);

  return new Horoscope({
    origin: new Origin({
      year: d.year(),
      month: d.month(),
      date: d.date(),
      hour: d.hour(),
      minute: d.minute(),
      second: d.second(),
      latitude: birthPlace.latitude,
      longitude: birthPlace.longitude,
    }),
  });
}

export function getHoroscopeString(stars: Pick<HoroscopeStars[number], 'star' | 'sign' | 'house'>[]): string {
  return JSON.stringify(stars.map((i) => pick(i, 'star', 'sign', 'house')));
}

export function getHoroscopeData(horoscope: Horoscope): { stars: HoroscopeStars; chartData: HoroscopeChartData } {
  const STARS = ['ascendant', 'sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];

  const all: {
    key: string;
    Sign?: { key: string };
    House?: { id: number; Sign: { key: string } };
    ChartPosition: any;
    isRetrograde?: true;
  }[] = horoscope.CelestialBodies.all.concat([horoscope.Ascendant]);

  const m = Object.fromEntries(all.map((i) => [i.key, i]));
  const bodies = STARS.map((star) => m[star]!);
  const stars = bodies.map((i) => ({
    star: i.key as Star,
    sign: i.Sign?.key as Sign,
    house: i.House?.id ?? 1,
    decimalDegrees: i.ChartPosition?.Ecliptic?.DecimalDegrees!,
    arcDegreesFormatted30: i.ChartPosition?.Ecliptic?.ArcDegreesFormatted30!,
  }));

  return {
    stars,
    chartData: {
      planets: Object.assign(
        {},
        ...bodies.map((body) => {
          const key = body.key.charAt(0).toUpperCase() + body.key.slice(1);
          return { [key]: [body.ChartPosition.Ecliptic.DecimalDegrees] };
        }),
      ),
      cusps: horoscope.Houses.map((i: any) => i.ChartPosition.StartPosition.Ecliptic.DecimalDegrees),
    },
  };
}

export function getHoroscopeRetrogradeStars(horoscope: Horoscope): { star: Star }[] {
  const STARS = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn'];

  const all: {
    key: string;
    Sign?: { key: string };
    House?: { id: number; Sign: { key: string } };
    ChartPosition: any;
    isRetrograde?: true;
  }[] = horoscope.CelestialBodies.all.concat([horoscope.Ascendant]);

  const m = Object.fromEntries(all.map((i) => [i.key, i]));
  const bodies = STARS.map((star) => m[star]!);
  return bodies.filter((i) => i.isRetrograde).map((i) => ({ star: i.key as Star }));
}

export function phase({ date }: { date: Date }) {
  const phase: string = lunarCalc.getLunarPhase(lunarCalc.getLunarDay(date)).toLowerCase();

  return { phaseText: phase.endsWith('_moon') ? phase : phase.concat('_moon') };
}
