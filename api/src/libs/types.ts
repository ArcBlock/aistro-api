import type { Sign, Star } from './horoscope';

export interface HoroscopeChartData {
  planets: {
    [key: string]: number[];
  };
  cusps: number[];
}

export type HoroscopeStars = {
  star: Star;
  sign: Sign;
  house: number;
  decimalDegrees: number;
  arcDegreesFormatted30: string;
}[];
