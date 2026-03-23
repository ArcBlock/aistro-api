import dayjs from 'dayjs';
import { pick } from 'lodash';

import { UnauthorizedError } from '../../../libs/auth';
import { randomBackgroundImage } from '../../../libs/blender';
import getHoroscope, { getHoroscopeData } from '../../../libs/horoscope';
import Billing from '../../../store/models/billing';
import { MessageType } from '../../../store/models/message';
import User from '../../../store/models/user';
import { generateNatalReport, generatePredictReport, generateSynastryReport } from '../report-generators';
import { getTranslation } from '../translations';
import type { ChatHandle } from '../types';
import { ELLIPSIS_COUNT } from '../types';

// ---------------------------------------------------------------------------
// handleTodaysPredict
// ---------------------------------------------------------------------------

export const handleTodaysPredict: ChatHandle<MessageType.TodaysPredict> = async ({ userId, input, ...args }) => {
  if (!userId) throw new UnauthorizedError();

  const user = await User.findByPk(userId, { rejectOnEmpty: new Error('User does not found') });

  const today = dayjs();

  const horoscope = await user.getHoroscopeOrGenerate(input);
  const todayHoroscope =
    input.todayHoroscope ??
    getHoroscopeData(getHoroscope({ birthDate: today.format('YYYY-MM-DD 12:00:00'), birthPlace: input.birthPlace }));

  const isVip = !!(await Billing.isUserSubAvailable({ userId }));

  const [details] = generatePredictReport({
    isVip,
    date: today,
    language: args.language,
    horoscope,
    dateHoroscope: todayHoroscope,
    message: args.message,
  });

  return {
    type: MessageType.TodaysPredict,
    data: await Promise.race([
      details[0]?.then((res) => res?.content.slice(0, ELLIPSIS_COUNT)),
      new Promise<string>((resolve) => {
        setTimeout(() => {
          resolve(getTranslation('todaysPredictReportGenerating', args.language));
        }, 2000);
      }),
    ]),
    img: randomBackgroundImage(isVip),
    parameters: { ...input, horoscope, date: today.format('YYYY-MM-DD') },
  };
};

// ---------------------------------------------------------------------------
// handleNatalReport
// ---------------------------------------------------------------------------

export const handleNatalReport: ChatHandle<MessageType.NatalReport> = async ({ userId, input, ...args }) => {
  let { horoscope } = input;

  if (userId) {
    const user = await User.findByPk(userId, { rejectOnEmpty: new Error('User not found') });
    horoscope = await user.getHoroscopeOrGenerate(input);
  } else {
    horoscope = input.horoscope ?? getHoroscopeData(getHoroscope(input));
  }

  const isVip = !!(userId && (await Billing.isUserSubAvailable({ userId })));

  const [details] = generateNatalReport({ isVip, language: args.language, horoscope, message: args.message });

  return {
    context: { ...pick(input, 'birthDate', 'birthPlace', 'horoscope') },
    type: MessageType.NatalReport,
    data: await Promise.race([
      details[0]?.then((res) => res?.content.slice(0, ELLIPSIS_COUNT)),
      new Promise<string>((resolve) => {
        setTimeout(() => resolve(getTranslation('natalReportGenerating', args.language)), 2000);
      }),
    ]),
    img: randomBackgroundImage(isVip),
    next: { type: MessageType.TodaysPredict, birthDate: input.birthDate, birthPlace: input.birthPlace },
    parameters: { ...input, horoscope },
  };
};

// ---------------------------------------------------------------------------
// handleFriendNatalReport
// ---------------------------------------------------------------------------

export const handleFriendNatalReport: ChatHandle<MessageType.FriendNatalReport> = async ({
  userId,
  input,
  ...args
}) => {
  if (!userId) {
    throw new UnauthorizedError();
  }

  const horoscope = input.horoscope ?? getHoroscopeData(getHoroscope(input));

  const isVip = !!(userId && (await Billing.isUserSubAvailable({ userId })));

  const [details] = generateNatalReport({
    isVip,
    language: args.language,
    horoscope,
    message: args.message,
  });

  return {
    context: { ...pick(input, 'name', 'birthDate', 'birthPlace') },
    type: MessageType.FriendNatalReport,
    data: await Promise.race([
      details[0]?.then((res) => res?.content.slice(0, ELLIPSIS_COUNT)),
      new Promise<string>((resolve) => {
        setTimeout(() => resolve(getTranslation('natalReportGenerating', args.language)), 2000);
      }),
    ]),
    img: randomBackgroundImage(isVip),
    parameters: { ...input, horoscope },
  };
};

// ---------------------------------------------------------------------------
// handlePredict
// ---------------------------------------------------------------------------

export const handlePredict: ChatHandle<MessageType.Predict> = async ({ userId, input, ...args }) => {
  if (!userId) throw new UnauthorizedError();

  const user = await User.findByPk(userId, { rejectOnEmpty: new Error('User does not found') });

  const horoscope = await user.getHoroscopeOrGenerate(input);

  const dateHoroscope =
    input.dateHoroscope ??
    getHoroscopeData(
      getHoroscope({ birthDate: dayjs(input.date).format('YYYY-MM-DD 12:00:00'), birthPlace: input.birthPlace }),
    );

  const isVip = !!(await Billing.isUserSubAvailable({ userId }));

  const [details] = generatePredictReport({
    isVip,
    date: dayjs(input.date),
    language: args.language,
    horoscope,
    dateHoroscope,
    message: args.message,
  });

  return {
    type: MessageType.Predict,
    data: await Promise.race([
      details[0]?.then((res) => res.content.slice(0, ELLIPSIS_COUNT)),
      new Promise<string>((resolve) => {
        setTimeout(() => {
          resolve(getTranslation('todaysPredictReportGenerating', args.language));
        }, 2000);
      }),
    ]),
    img: randomBackgroundImage(isVip),
    parameters: { ...input, horoscope },
  };
};

// ---------------------------------------------------------------------------
// handleSynastryReport
// ---------------------------------------------------------------------------

export const handleSynastryReport: ChatHandle<MessageType.SynastryReport> = async ({ userId, input, ...args }) => {
  if (!userId) {
    throw new UnauthorizedError();
  }

  const horoscope = input.horoscope ?? getHoroscopeData(getHoroscope(input));
  const friendHoroscope = input.friend.horoscope ?? getHoroscopeData(getHoroscope(input.friend));

  const isVip = !!(userId && (await Billing.isUserSubAvailable({ userId })));

  const [details] = generateSynastryReport({
    isVip,
    language: args.language,
    horoscope,
    friend: { ...input.friend, horoscope: friendHoroscope },
    message: args.message,
  });

  return {
    type: MessageType.SynastryReport,
    data: await Promise.race([
      details[0]?.then((res) => res?.content.slice(0, ELLIPSIS_COUNT)),
      new Promise<string>((resolve) => {
        setTimeout(() => {
          resolve(
            getTranslation('synastryReportGenerating', args.language).then((res) =>
              res.replace('{{friend}}', input.friend.name || 'Friend'),
            ),
          );
        }, 2000);
      }),
    ]),
    img: randomBackgroundImage(isVip),
    parameters: { ...input, horoscope, friend: { ...input.friend, horoscope: friendHoroscope } },
  };
};
