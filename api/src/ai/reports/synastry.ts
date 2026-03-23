import { randomInt } from 'node:crypto';

import { invokeText } from '../invoke';

const SCORE_MIN = 40;
const SCORE_MAX = 101;

export interface SynastrySection {
  topic: string;
  title: string;
  description: string;
  similarity: string;
  different: string;
}

export interface SynastryReport {
  title: string;
  score: number;
  sections: SynastrySection[];
}

const SYNASTRY_TOPICS = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn'];

/**
 * Generate a full synastry (compatibility) report by orchestrating sub-prompt calls.
 *
 * @param params.userStars - User's natal horoscope stars (formatted string)
 * @param params.secondaryUserStars - Friend's natal horoscope stars
 * @param params.language - Output language name
 * @param params.topics - Planet topics (default: sun through saturn)
 */
export async function generateSynastryReport(params: {
  userStars: string;
  secondaryUserStars: string;
  language: string;
  topics?: string[];
}): Promise<SynastryReport> {
  const topics = params.topics || SYNASTRY_TOPICS;
  const baseVars = {
    userStars: params.userStars,
    secondaryUserStars: params.secondaryUserStars,
    language: params.language,
  };

  const [title] = await Promise.all([invokeText('report/synastry-title', baseVars)]);

  const sections = await Promise.all(
    topics.map(async (topic): Promise<SynastrySection> => {
      const vars = { ...baseVars, topic };
      const [sectionTitle, description, similarity, different] = await Promise.all([
        invokeText('report/synastry-section-title', vars),
        invokeText('report/synastry-description', vars),
        invokeText('report/synastry-similarity', vars),
        invokeText('report/synastry-different', vars),
      ]);
      return { topic, title: sectionTitle, description, similarity, different };
    }),
  );

  return {
    title,
    score: randomInt(SCORE_MIN, SCORE_MAX),
    sections,
  };
}
