import { invokeText } from '../invoke';

export interface RetrogradeReport {
  planet: string;
  report: string;
}

export interface MoonPhaseReport {
  moonPhase: string;
  summary: string;
  retrogrades: RetrogradeReport[];
}

/**
 * Generate a moon phase report with retrograde planet analysis.
 *
 * @param params.userStars - User's natal horoscope stars (formatted string)
 * @param params.moonPhase - Current moon phase text
 * @param params.retrogradeStars - Array of retrograde planet names
 * @param params.language - Output language name
 */
export async function generateMoonPhaseReport(params: {
  userStars: string;
  moonPhase: string;
  retrogradeStars: string[];
  language: string;
}): Promise<MoonPhaseReport> {
  const summary = await invokeText('report/moon-phase-summary', {
    userStars: params.userStars,
    moonPhase: params.moonPhase,
    language: params.language,
  });

  const retrogrades = await Promise.all(
    params.retrogradeStars.map(async (planet): Promise<RetrogradeReport> => {
      const report = await invokeText('report/moon-phase-retrograde', {
        userStars: params.userStars,
        planets: planet,
        language: params.language,
      });
      return { planet, report };
    }),
  );

  return { moonPhase: params.moonPhase, summary, retrogrades };
}
