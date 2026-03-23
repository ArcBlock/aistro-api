import { Sign, Star } from '../../api/src/libs/horoscope';
import { HoroscopeChartData } from '../../api/src/store/models/user';

export type Detail = {
  star: Star;
  sign: Sign;
  icon: string;
  topic: string;
  iconTitle: string;
  title: string;
  content: string;
  image?: string;
};

export type FortuneDetail = {
  content: string;
  dimension: string;
  image?: string;
  score: number;
};

export enum MessageType {
  Question = 0,
  AppInit = 1,
  DailyInit = 2,
  TodaysFortunes = 3,
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
  Fortunes = 23,
}

export interface HoroscopeStar {
  star: string;
  sign: string;
  house?: number;
  decimalDegrees?: number;
  arcDegreesFormatted30?: string;
}

export interface NewHoroscopeStar extends HoroscopeStar {
  i18nSign?: string;
  myself?: HoroscopeStar;
  friend?: HoroscopeStar;
}

export type DataProps = {
  user: {
    id: string;
    name?: string;
    avatar?: string;
    horoscopeChartData?: HoroscopeChartData;
  };
  friend: {
    name?: string;
    avatar?: string;
  };
  createdAt?: string;
  content?: string;
  parameters?: any;
  img?: string;
  title?: string;
  type: MessageType;
  sections: Detail[];
  isVip?: boolean;
  score?: number;
  generateStatus?: string;
  invitedFriend?: InviteFriend | null;
};

export type InviteFriend = {
  id: string;
  fromUserId: string;
  fromUserName?: string | null;
  friendName?: string | null;
  toUserId?: string | null;
  friendBirthDate?: string | null;
  friendBirthPlace?: { longitude: number; latitude: number; address: string } | null;
  reportId?: string | null;
  status?: string | null;
};

export enum PredictReportGenerateStatus {
  NotStart = 'notstart',
  Generating = 'generating',
  Finished = 'finished',
}

export interface PredictReportInAppDevice {
  productId: string | null;
}

export interface PredictReportInApp {
  ios: PredictReportInAppDevice | null;
  android: PredictReportInAppDevice | null;
}

export interface PredictReportTopic {
  id: string;
  title: string;
  image?: string | null;
}

export interface PredictReportScore {
  icon?: string | null;
  title: string;
  topics: PredictReportTopic[];
}

export interface PredictReportSection {
  id: string;
  topic?: string | null;
  icon?: string | null;
  iconTitle?: string | null;
  title?: string | null;
  subtitle?: string | null;
  content: string;
  lock: boolean;
  generateStatus?: PredictReportGenerateStatus | null;
  image?: string | null;
  purchased?: boolean | null;
  inapp?: PredictReportInApp | null;
}

export interface PredictReportModel {
  id: string;
  title?: string | null;
  summary?: string | null;
  scores?: PredictReportScore[] | null;
  sections: PredictReportSection[];
  generateStatus?: PredictReportGenerateStatus | null;
  error?: string | null;
}

export enum ReportDetailDataType {
  ImageText = 1,
  Chart = 2,
  Image = 3,
  Space = 4,
  Unknown = 0,
}

export enum ReportDetailChartType {
  Natal = 'natal',
  Transit = 'transit',
}

export interface ReportDetailCellModel {
  type: ReportDetailDataType;
  id?: string | null;
  content: string;
  image?: string | null;
  inset?: string | null;
  sectionTitle?: string | null;
  sectionIcon?: string | null;
  iconTitle?: string | null;
  subTitle?: string | null;
  contentColor?: string | null;
  titleColor?: string | null;
}

export interface ReportDetailChartModel {
  type: ReportDetailDataType;
  chartType: ReportDetailChartType;
  description?: string | null;
  birthDate?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  darkTheme: boolean;
  transitDate?: string | null;
}

export interface ReportDetailImageModel {
  type: ReportDetailDataType;
  image: string;
  description?: string | null;
  title?: string | null;
}

export interface ReportDetailSpaceModel {
  type: ReportDetailDataType;
  line: number;
}

type ReportDetailSection =
  | ReportDetailCellModel
  | ReportDetailChartModel
  | ReportDetailImageModel
  | ReportDetailSpaceModel;

export type ReportDetail = {
  id: string;
  icon?: string | null;
  iconTitle?: string | null;
  title?: string | null;
  subtitle?: string | null;
  generateStatus?: PredictReportGenerateStatus | null;
  sections: ReportDetailSection[];
  details: PredictReportSection[];
};
