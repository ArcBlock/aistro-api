import { randomInt } from 'node:crypto';

import { invokeText } from '../invoke';

const SCORE_MIN = 40;
const SCORE_MAX = 101; // exclusive upper bound for randomInt

export interface PredictSection {
  topic: string;
  overview: string;
  houses: string;
  strengths: string;
  challenges: string;
  score: number;
}

export interface PredictReport {
  title: string;
  summary: string;
  sections: PredictSection[];
}

/**
 * Generate a full predict (horoscope) report by orchestrating multiple sub-prompt calls.
 *
 * @param params.stars - User's natal horoscope stars (formatted string)
 * @param params.dateStars - Horoscope stars for the target date
 * @param params.date - Target date string
 * @param params.language - Output language name (e.g., "English", "Chinese")
 * @param params.topics - Dimensions to generate (default: love, career, wealth, creativity)
 */
export async function generatePredictReport(params: {
  stars: string;
  dateStars: string;
  date: string;
  language: string;
  topics?: string[];
}): Promise<PredictReport> {
  const topics = params.topics || ['love', 'career', 'wealth', 'creativity'];
  const baseVars = {
    stars: params.stars,
    dateStars: params.dateStars,
    date: params.date,
    language: params.language,
  };

  // Phase 1: title + summary in parallel
  const [title, summary] = await Promise.all([
    invokeText('report/predict-title', baseVars),
    invokeText('report/predict-summary', baseVars),
  ]);

  // Phase 2: all topic sections in parallel
  const sections = await Promise.all(
    topics.map(async (topic): Promise<PredictSection> => {
      const vars = { ...baseVars, topic };
      const [overview, houses, strengths, challenges] = await Promise.all([
        invokeText('report/predict-overview', vars),
        invokeText('report/predict-houses', vars),
        invokeText('report/predict-strengths', vars),
        invokeText('report/predict-challenges', vars),
      ]);
      return {
        topic,
        overview,
        houses,
        strengths,
        challenges,
        score: randomInt(SCORE_MIN, SCORE_MAX),
      };
    }),
  );

  return { title, summary, sections };
}
