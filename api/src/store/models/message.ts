import dayjs from 'dayjs';
import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Op } from 'sequelize';
import { Worker } from 'snowflake-uuid';

import { sequelize } from '.';
import { config } from '../../libs/env';
import { PredictTopic, Sign, Star } from '../../libs/horoscope';
import Billing from './billing';

const idGenerator = new Worker();

export const nextMessageId = () => idGenerator.nextId().toString();

export enum MessageType {
  Question = 0,
  AppInit = 1,
  DailyInit = 2,
  TodaysPredict = 3,
  RequestCompleteProfile = 4,
  UpdateBirthDate = 5,
  UpdateBirthPlace = 6,
  RequestDailyNFT = 7,
  CompleteSubscription = 8,
  RequestAddFriendProfile = 9,
  UpdateFriendBirthDate = 10,
  UpdateFriendBirthPlace = 11,
  NatalReport = 12,
  SynastryReport = 13,
  Login = 14,
  UpdateFriendName = 15,
  MyMedal = 16,
  Like = 17,
  SessionChat = 18,
  FriendNatalReport = 19,
  Guide = 20,
  Suggestion = 21,
  AcceptInvitation = 22,
  Predict = 23,
  AIInstruction = 24, // 通过AI指令来做一下操作, eg: update user info
}

export enum MessageRole {
  user = 0,
  ai = 1,
}

export type Report =
  | {
      type: MessageType.NatalReport | MessageType.FriendNatalReport;
      details: {
        star: Star;
        sign: Sign;
        friendSign?: undefined;
        dimension?: undefined;
        content: string;
        image?: string;
        summary?: string | null;
      }[];
    }
  | {
      type: MessageType.SynastryReport;
      details: {
        star: Star;
        sign: Sign;
        friendSign: Sign;
        dimension?: undefined;
        content: string;
        image?: string;
        summary?: string | null;
      }[];
    }
  | {
      type: MessageType.TodaysPredict | MessageType.Predict;
      details: {
        star?: undefined;
        sign?: undefined;
        friendSign?: undefined;
        dimension: PredictTopic;
        content: string;
        image?: string;
        summary?: string | null;
        score?: number;
      }[];
    };

export default class Message extends Model<InferAttributes<Message>, InferCreationAttributes<Message>> {
  declare id: CreationOptional<string>;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;

  declare userId?: string | null;

  declare objectId?: string;

  declare type: MessageType;

  declare role: MessageRole;

  declare content?: string | null;

  declare report?: Report | null;

  declare error?: string | null;

  declare parameters?: object;

  declare title?: string;

  declare img?: string;

  declare next?: object;

  declare actions?: object[];

  declare input?: object;

  declare likeCount: CreationOptional<number>;

  declare suggestions?: object[];

  static async usedCount({
    userId,
    types,
    duration,
  }: {
    userId: string;
    types: MessageType[];
    duration: 'day' | 'month';
  }) {
    const startDate = (duration === 'day' ? dayjs().startOf(duration) : dayjs().subtract(1, duration)).toDate();
    return this.count({
      where: {
        userId,
        role: MessageRole.ai,
        type: types.length ? { [Op.in]: types } : ({ [Op.not]: null } as any),
        createdAt: { [Op.gt]: startDate },
      },
    });
  }

  static async remainingQueryCount({ userId }: { userId: string }) {
    const isSub = await Billing.isUserSubAvailable({ userId });
    const limit = isSub ? config.limitation.everyMonthCountForSub : config.limitation.everyDayCountForFree;

    let remainingQueryCount: number | undefined;

    if (limit && config.limitation.countMessageType.length) {
      const usedCount = await Message.usedCount({
        userId,
        types: config.limitation.countMessageType,
        duration: isSub ? 'month' : 'day',
      });

      remainingQueryCount = Math.max(limit - usedCount, 0);
    }

    return [remainingQueryCount, isSub] as const;
  }
}

Message.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      defaultValue: nextMessageId,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    objectId: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
    },
    report: {
      type: DataTypes.JSON,
    },
    error: {
      type: DataTypes.TEXT,
    },
    parameters: {
      type: DataTypes.JSON,
    },
    title: {
      type: DataTypes.TEXT,
    },
    img: {
      type: DataTypes.STRING,
    },
    next: {
      type: DataTypes.JSON,
    },
    actions: {
      type: DataTypes.JSON,
    },
    input: {
      type: DataTypes.JSON,
    },
    likeCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    suggestions: {
      type: DataTypes.JSON,
    },
  },
  { sequelize },
);
