import equal from 'fast-deep-equal';
import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { Worker } from 'snowflake-uuid';

import { sequelize } from '.';
import { authService } from '../../libs/auth';
import env, { configFile } from '../../libs/env';
import getHoroscope, { Sign, Star, getHoroscopeData } from '../../libs/horoscope';
import Message, { MessageRole, MessageType } from './message';

export const DEFAULT_PREDICT_TOPICS: NonNullable<User['predictTopics']> = [
  { topic: 'LOVE', visible: true },
  { topic: 'CREATIVITY', visible: true },
  { topic: 'CAREER', visible: true },
  { topic: 'WEALTH', visible: true },
];

export const DEFAULT_PREDICT_TOPICS_SET = new Set(DEFAULT_PREDICT_TOPICS.map((i) => i.topic.toLowerCase()));

const idGenerator = new Worker();

const nextId = () => idGenerator.nextId().toString();

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

export default class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: string;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;

  declare name?: string;

  declare email?: string;

  declare avatar?: string;

  declare birthDate?: string;

  declare birthPlace?: { longitude: number; latitude: number; address: string };

  declare horoscopeChartData?: HoroscopeChartData | null;

  declare horoscopeStars?: HoroscopeStars | null;

  declare inviteCode?: string | null;

  declare utcOffset?: number;

  declare predictTopics: { topic: string; visible?: boolean; image?: string }[];

  declare language?: string;

  declare longTermMem?: object;

  async updateUserInfo({
    horoscope,
    ...update
  }: Partial<User> & { horoscope?: { stars: HoroscopeStars; chartData: HoroscopeChartData } }) {
    let { birthDate, birthPlace } = update;

    if (
      (birthDate || birthPlace) && // has birthDate or birthPlace
      !(update.horoscopeStars || update.horoscopeChartData) && // without horoscope data
      (birthDate !== this.birthDate || !equal(birthPlace, this.birthPlace)) // birth date or place has changed
    ) {
      birthDate ??= this.birthDate;
      birthPlace ??= this.birthPlace;

      if (birthDate && birthPlace) {
        const { stars, chartData } = horoscope ?? getHoroscopeData(getHoroscope({ birthDate, birthPlace }));
        update.horoscopeStars = stars;
        update.horoscopeChartData = chartData;
      } else {
        update.horoscopeStars = null;
        update.horoscopeChartData = null;
      }
    }

    return this.update(update);
  }

  async getHoroscopeOrGenerate(options: {
    birthDate: string;
    birthPlace: NonNullable<User['birthPlace']>;
    horoscope?: { stars: HoroscopeStars; chartData: HoroscopeChartData };
  }): Promise<{ stars: HoroscopeStars; chartData: HoroscopeChartData }>;
  async getHoroscopeOrGenerate(options?: {
    birthDate: string;
    birthPlace: NonNullable<User['birthPlace']>;
    horoscope?: { stars: HoroscopeStars; chartData: HoroscopeChartData };
  }): Promise<{ stars: HoroscopeStars; chartData: HoroscopeChartData } | undefined>;
  async getHoroscopeOrGenerate(options?: {
    birthDate: string;
    birthPlace: NonNullable<User['birthPlace']>;
    horoscope?: { stars: HoroscopeStars; chartData: HoroscopeChartData };
  }): Promise<{ stars: HoroscopeStars; chartData: HoroscopeChartData } | undefined> {
    const { birthDate, birthPlace } = this;

    if (options) {
      const horoscope = options.horoscope ?? getHoroscopeData(getHoroscope(options));

      if (
        options.birthDate !== birthDate ||
        options.birthPlace.longitude !== birthPlace?.longitude ||
        options.birthPlace.latitude !== birthPlace.latitude
      ) {
        await this.update({
          birthDate: options.birthDate,
          birthPlace: options.birthPlace,
          horoscopeChartData: horoscope.chartData,
          horoscopeStars: horoscope.stars,
        });
      }

      return horoscope;
    }

    if (!birthDate || !birthPlace) {
      return undefined;
    }
    const { horoscopeStars: stars, horoscopeChartData: chartData } = this;
    if (stars && chartData) {
      return { stars, chartData };
    }
    const res = getHoroscopeData(getHoroscope({ birthDate, birthPlace }));
    await this.update({ horoscopeStars: res.stars, horoscopeChartData: res.chartData });
    return res;
  }

  static async getUserDetail(did: string) {
    const [[user], natalMessage, [, isSub], walletUser] = await Promise.all([
      User.findOrCreate({ where: { id: did } }),
      Message.findOne({
        where: { userId: did, role: MessageRole.ai, type: MessageType.NatalReport },
        order: [['createdAt', 'DESC']],
      }),
      Message.remainingQueryCount({ userId: did }),
      (await authService.getUser(did)).user,
    ]);

    const getAvatarUrl = (url?: string) => (url?.startsWith('/') ? `${env.appUrl}${url}` : url);

    // TODO: Phase 4 - restore runAgent call for queryRemainingChatCount
    // Original code used: await runAgent({ ...configFile.config.agents.queryRemainingChatCount, user: { did } })
    const remainingQueryCount = isSub
      ? undefined
      : configFile.config?.agents?.queryRemainingChatCount
        ? undefined // runAgent not yet migrated
        : undefined;

    return {
      ...user.dataValues,
      did: user.id,
      remainingQueryCount,
      natalMessageId: natalMessage?.id,
      subExpirationDate: isSub?.expirationDate,
      name: walletUser.fullName,
      email: walletUser.email,
      avatar: getAvatarUrl(walletUser.avatar),
      predictTopics: user.predictTopics.map((i) => ({
        ...i,
        image: i.image,
      })),
      isVip: !!isSub,
    };
  }
}

User.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      defaultValue: nextId,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    avatar: {
      type: DataTypes.STRING,
    },
    birthDate: {
      type: DataTypes.STRING,
    },
    birthPlace: {
      type: DataTypes.JSON,
    },
    horoscopeChartData: {
      type: DataTypes.JSON,
    },
    horoscopeStars: {
      type: DataTypes.JSON,
    },
    inviteCode: {
      type: DataTypes.STRING,
    },
    utcOffset: {
      type: DataTypes.INTEGER,
    },
    predictTopics: {
      type: DataTypes.JSON,
    },
    language: {
      type: DataTypes.STRING,
    },
    longTermMem: {
      type: DataTypes.JSON,
    },
  },
  { sequelize },
);

User.afterFind('set default value for predictTopics', (data: User | readonly User[] | null) => {
  if (!data) return;
  if (Array.isArray(data)) {
    data.forEach((user) => ((user as User).predictTopics ??= DEFAULT_PREDICT_TOPICS));
  } else {
    (data as User).predictTopics ??= DEFAULT_PREDICT_TOPICS;
  }
});
