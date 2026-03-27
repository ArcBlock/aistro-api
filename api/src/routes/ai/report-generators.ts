import dayjs from 'dayjs';
import { random } from 'lodash';

import { selectReportImage } from '../../ai/image';
import { invokeText } from '../../ai/invoke';
import { summarize, translate } from '../../ai/utils';
import { PredictTopics, Stars, getHoroscopeString } from '../../libs/horoscope';
import type { Star } from '../../libs/horoscope';
import type { HoroscopeStars } from '../../libs/types';
import BuiltinAnswer from '../../store/models/builtin-answer';
import Message, { MessageType } from '../../store/models/message';

export const PREDICT_SCORE_MIN = 40;
export const PREDICT_SCORE_MAX = 100;
export const PREDICT_SCORE_DEFAULT = 80;

export const SYNASTRY_STARS: Star[] = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn'];

// Number of report sections visible to non-subscribers
export const reportPartN = (type: MessageType) =>
  type === MessageType.NatalReport || type === MessageType.FriendNatalReport
    ? 3
    : type === MessageType.SynastryReport
      ? 2
      : 1;

// Total number of report sections available for subscribers
export const reportPartTotal = (type: MessageType) =>
  type === MessageType.NatalReport || type === MessageType.FriendNatalReport
    ? Stars.length
    : type === MessageType.SynastryReport
      ? SYNASTRY_STARS.length
      : PredictTopics.length;

// ---------------------------------------------------------------------------
// generateNatalReport
// ---------------------------------------------------------------------------

export function generateNatalReport({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isVip: _isVip,
  language,
  horoscope,
  message,
}: {
  isVip: boolean;
  language: string;
  horoscope: {
    stars: HoroscopeStars;
  };
  message: Message;
}) {
  const starsMap = Object.fromEntries(horoscope.stars.map((i) => [i.star, i]));

  const details = Stars.map(async (star) => {
    const { sign, house } = starsMap[star]!;

    const key = `natal-${star}-${sign}-${house}`;

    const { content, summary } = await BuiltinAnswer.getOrGenerateReport({
      key,
      language,
      generate: async ({ language }) =>
        invokeText('report/natal-description', {
          language,
          star: getHoroscopeString([{ star, sign, house }]),
          sign,
          house: String(house),
        }).then((content) => ({ content })),
      translate: async ({ content, language }) => translate(content, language),
      summarize: async ({ content, language }) => summarize(content, language),
    });

    const image = selectReportImage('natal', star);

    return {
      star,
      sign,
      house,
      content,
      summary,
      image,
    };
  });

  return [
    details,
    Promise.all(details)
      .then(async (details) => {
        await message.update({
          error: null,
          report: { type: message.type as any, details },
          parameters: { ...message.parameters, language },
        });
      })
      .catch(async (error) => {
        await message.update({ error: error.message });
      }),
  ] as const;
}

// ---------------------------------------------------------------------------
// generateSynastryReport
// ---------------------------------------------------------------------------

export function generateSynastryReport({
  isVip,
  language,
  horoscope,
  friend,
  message,
}: {
  isVip: boolean;
  language: string;
  horoscope: { stars: HoroscopeStars };
  friend: { horoscope: { stars: HoroscopeStars } };
  message: Message;
}) {
  const details = (isVip ? SYNASTRY_STARS : SYNASTRY_STARS.slice(0, reportPartN(MessageType.SynastryReport)))
    .map((star) => {
      const star1 = horoscope.stars.find((i) => i.star === star);
      const star2 = friend.horoscope.stars.find((i) => i.star === star);
      if (!star1 || !star2) {
        return undefined;
      }

      return (async () => {
        const key = `synastry-${star}-${star1.sign}-${star1.house}-${star2.sign}-${star2.house}`;

        const { content, summary } = await BuiltinAnswer.getOrGenerateReport({
          key,
          language,
          generate: async ({ language }) =>
            invokeText('report/synastry-description', {
              language,
              star,
              userStars: getHoroscopeString([star1]),
              secondaryUserStars: getHoroscopeString([star2]),
            }).then((content) => ({ content })),
          translate: async ({ content, language }) => translate(content, language),
          summarize: async ({ content, language }) => summarize(content, language),
        });

        const image = selectReportImage('synastry', star);

        return {
          star,
          sign: star1.sign,
          house: star1.house,
          friendSign: star2.sign,
          friendHouse: star2.house,
          content,
          summary,
          image,
        };
      })();
    })
    .filter((i): i is NonNullable<typeof i> => !!i);

  return [
    details,
    Promise.all(details)
      .then(async (details) => {
        const friendName = (message.parameters as any)?.friend?.name;

        if (friendName) {
          for (const detail of details) {
            detail.content = detail.content.replace(/#other#/g, friendName);
            detail.summary = detail.summary?.replace(/#other#/g, friendName);
          }
        }

        await message.update({
          error: null,
          report: { type: MessageType.SynastryReport, details },
          parameters: { ...message.parameters, language },
        });
      })
      .catch(async (error) => {
        await message.update({ error: error.message });
      }),
  ] as const;
}

// ---------------------------------------------------------------------------
// generatePredictReport
// ---------------------------------------------------------------------------

export function generatePredictReport({
  isVip,
  date,
  language,
  horoscope,
  dateHoroscope,
  message,
}: {
  isVip: boolean;
  date: dayjs.Dayjs;
  language: string;
  horoscope: {
    stars: HoroscopeStars;
  };
  dateHoroscope: {
    stars: HoroscopeStars;
  };
  message: Message;
}) {
  const today = date.format('YYYY-MM-DD');
  const starsKey = horoscope.stars.map(({ star, sign, house }) => `${star}-${sign}-${house}`).join('-');

  const details = (isVip ? PredictTopics : PredictTopics.slice(0, reportPartN(MessageType.Predict))).map(
    async (topic) => {
      const key = `predict-${today}-${topic}-${starsKey}`;

      const { content, summary, score } = await BuiltinAnswer.getOrGenerateReport({
        key,
        language,
        generate: async ({ language }) =>
          invokeText('report/predict-overview', {
            language,
            topic,
            date: today,
            stars: getHoroscopeString(horoscope.stars),
            dateStars: getHoroscopeString(dateHoroscope.stars),
          }).then((content) => ({
            content,
            score: random(PREDICT_SCORE_MIN, PREDICT_SCORE_MAX, false),
          })),
        translate: async ({ content, language }) => translate(content, language),
        summarize: async ({ content, language }) => summarize(content, language),
      });

      const image = selectReportImage('predict', topic);

      return {
        dimension: topic,
        content,
        summary,
        image,
        score: score || PREDICT_SCORE_DEFAULT,
      };
    },
  );

  return [
    details,
    Promise.all(details)
      .then(async (details) => {
        await message.update({
          error: null,
          report: { type: message.type as any, details },
          parameters: { ...message.parameters, language },
        });
      })
      .catch(async (error) => {
        await message.update({ error: error.message });
      }),
  ] as const;
}
