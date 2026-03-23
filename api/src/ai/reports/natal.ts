import { invokeText } from '../invoke';

export interface NatalSection {
  topic: string;
  description: string;
  gift: string;
  challenge: string;
}

export interface NatalReport {
  title: string;
  sections: NatalSection[];
}

const NATAL_STARS = [
  'sun',
  'moon',
  'mercury',
  'venus',
  'mars',
  'jupiter',
  'saturn',
  'uranus',
  'neptune',
  'pluto',
  'ascendant',
  'midheaven',
];

/**
 * Generate a full natal chart report by orchestrating sub-prompt calls for each star.
 *
 * @param params.birthDate - User's birth date string
 * @param params.stars - User's natal horoscope stars (formatted string)
 * @param params.language - Output language name
 * @param params.topics - Stars to generate (default: all 12)
 */
export async function generateNatalReport(params: {
  birthDate: string;
  stars: string;
  language: string;
  topics?: string[];
}): Promise<NatalReport> {
  const topics = params.topics || NATAL_STARS;
  const baseVars = {
    birthDate: params.birthDate,
    stars: params.stars,
    language: params.language,
  };

  const title = await invokeText('report/natal-title', baseVars);

  const sections = await Promise.all(
    topics.map(async (topic): Promise<NatalSection> => {
      const vars = { ...baseVars, topic };
      const [description, gift, challenge] = await Promise.all([
        invokeText('report/natal-description', vars),
        invokeText('report/natal-gift', vars),
        invokeText('report/natal-challenge', vars),
      ]);
      return { topic, description, gift, challenge };
    }),
  );

  return { title, sections };
}
