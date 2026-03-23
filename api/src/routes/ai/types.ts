import { Request } from 'express';
import { Readable } from 'stream';

import { PredictTopics, Star, Stars } from '../../libs/horoscope';
import Message, { MessageRole, MessageType } from '../../store/models/message';
import { HoroscopeChartData, HoroscopeStars } from '../../store/models/user';

export { MessageRole, MessageType };

export const PREDICT_SCORE_MIN = 40;
export const PREDICT_SCORE_MAX = 100;
export const PREDICT_SCORE_DEFAULT = 80;

export const TEST_GOOGLE_ID_TOKEN = 'CTWr2cCYaIEDxyh9ddtqFrmgNXakJaPGJuE7TfyKAUA=';

export const SYNASTRY_STARS: Star[] = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn'];

export const ELLIPSIS_COUNT = 60;

// 非订阅用户可以看到的报告解读数量
export const reportPartN = (type: MessageType) =>
  type === MessageType.NatalReport || type === MessageType.FriendNatalReport
    ? 3
    : type === MessageType.SynastryReport
      ? 2
      : 1;

// 订阅用户可以看到的报告解读数量
export const reportPartTotal = (type: MessageType) =>
  type === MessageType.NatalReport || type === MessageType.FriendNatalReport
    ? Stars.length
    : type === MessageType.SynastryReport
      ? SYNASTRY_STARS.length
      : PredictTopics.length;

export enum LinkActionType {
  PredictReport = 0, // 运势报告
  SynastryReport = 1, // 合盘报告
  NatalReport = 2, // 星盘报告
  ViewInChian = 3, // 去链上查看
}

export enum MessageActionType {
  CompleteProfile = 0, // 完善资料
  // LuckyNFT = 1 — removed in migration
  EditProfile = 2, // 修改资料
  CallChat = 3, // 调用chat接口，使用其去做下一步操作
}

export enum DebugCommand {
  LongTermMem = '/LongTermMem',
}

export type Action =
  | { action: 'link'; type: LinkActionType; url: string }
  | { action: 'login' }
  | { action: 'message'; type: MessageActionType; params: ChatInput; actionTitle?: string };

export type Input =
  | { type: 'string'; chatInputType: MessageType.UpdateFriendName; next?: object }
  | { type: 'datetime'; chatInputType: MessageType.UpdateBirthDate | MessageType.UpdateFriendBirthDate; next?: object }
  | {
      type: 'location';
      chatInputType: MessageType.UpdateBirthPlace | MessageType.UpdateFriendBirthPlace;
      next?: object;
    };

export type ChatInput = {
  utcOffset?: number;
} & (
  | ({
      type: MessageType.Login;
      name?: string;
      email?: string;
      avatar?: string;
      birthDate?: string;
      birthPlace?: { address: string; longitude: number; latitude: number };
      horoscope?: { stars: HoroscopeStars; chartData: HoroscopeChartData };
      natalReportMessageId?: string;
    } & ({ googleIdToken: string } | { appleIdToken: string })) // 用户登录
  | { type: MessageType.Question; question: string } // 用户输入问题
  | { type: MessageType.AppInit; num: number } // 首次打开应用的时候发起的 chat
  | { type: MessageType.DailyInit } // 每日首次打开发起的 chat
  | {
      type: MessageType.TodaysPredict;
      birthDate: string;
      birthPlace: { address: string; longitude: number; latitude: number };
      horoscope?: { stars: HoroscopeStars; chartData: HoroscopeChartData };
      todayHoroscope?: { stars: HoroscopeStars; chartData: HoroscopeChartData };
    } // 发起今日运势的 chat
  | { type: MessageType.RequestCompleteProfile } // 发起完善资料
  | { type: MessageType.UpdateBirthDate; birthDate: string } // 提交出生日期
  | { type: MessageType.AIInstruction; params?: string } // 通过AI指令来做操作
  | {
      type: MessageType.UpdateBirthPlace;
      birthDate: string;
      birthPlace: { address: string; longitude: number; latitude: number };
    } // 提交出生地点
  | { type: MessageType.RequestDailyNFT } // 发起抽每日 NFT
  | ({ type: MessageType.CompleteSubscription; platform: 'ios' | 'android'; receipt: string } & {
      platform: 'android';
      developerPayload: string;
    }) // 订阅完成，客户端发起一个领取订阅
  | { type: MessageType.RequestAddFriendProfile } // 发起合盘
  | { type: MessageType.UpdateFriendName; name: string } // 提交合盘对方姓名
  | { type: MessageType.UpdateFriendBirthDate; birthDate: string } // 提交合盘出生日期
  | { type: MessageType.UpdateFriendBirthPlace; birthPlace: { address: string; longitude: number; latitude: number } } // 提交合盘出生地点
  | {
      type: MessageType.NatalReport;
      birthDate: string;
      birthPlace: { address: string; longitude: number; latitude: number };
      horoscope?: { stars: HoroscopeStars; chartData: HoroscopeChartData };
    } // 本命盘报告
  | {
      type: MessageType.SynastryReport;
      birthDate: string;
      birthPlace: { address: string; longitude: number; latitude: number };
      horoscope?: { stars: HoroscopeStars; chartData: HoroscopeChartData };
      friend: {
        name?: string;
        birthDate: string;
        birthPlace: { address: string; longitude: number; latitude: number };
        horoscope?: { stars: HoroscopeStars; chartData: HoroscopeChartData };
      };
    } // 合盘报告
  | { type: MessageType.Like; messageId: string } // 点赞
  | {
      type: MessageType.SessionChat;
      context?: string;
      user?: {
        name?: string;
        birthDate?: string;
        birthPlace?: { address: string; longitude: number; latitude: number };
        horoscope?: { stars: HoroscopeStars; chartData: HoroscopeChartData };
      };
      friend?: {
        name?: string;
        birthDate?: string;
        birthPlace?: { address: string; longitude: number; latitude: number };
        horoscope?: { stars: HoroscopeStars; chartData: HoroscopeChartData };
      };
      history?: { content?: string; role: 'user' | 'assistant' }[];
      question: string;
    } // 会话
  | {
      type: MessageType.FriendNatalReport;
      name?: string;
      birthDate: string;
      birthPlace: { address: string; longitude: number; latitude: number };
      horoscope?: { stars: HoroscopeStars; chartData: HoroscopeChartData };
    }
  | {
      type: MessageType.Guide;
      question?: string;
    }
  | {
      type: MessageType.Suggestion;
      suggestionId: string;
    }
  | {
      type: MessageType.AcceptInvitation;
      invitationCode: string;
    }
  | {
      type: MessageType.Predict;
      birthDate: string;
      birthPlace: { address: string; longitude: number; latitude: number };
      horoscope?: { stars: HoroscopeStars; chartData: HoroscopeChartData };
      date: string;
      dateHoroscope?: { stars: HoroscopeStars; chartData: HoroscopeChartData };
    }
);

export interface ChatHandle<K extends MessageType> {
  (options: {
    stream?: boolean;
    language: string;
    userId?: string;
    input: Omit<ChatInput & { type: K }, 'type'>;
    message: Message;
    emitChunk?: (chunk: any) => void;
    req?: Request;
  }): Promise<ChatHandleResult>;
}

export interface ChatHandleResult {
  type: MessageType;
  title?: string;
  img?: string;
  data?: Readable | string;
  report?: Message['report'];
  next?: ChatInput;
  actions?: Action[];
  input?: Input;
  parameters?: object;
  context?: object;
  suggestions?: ChatInput[];
}
