import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { Worker } from 'snowflake-uuid';

import { sequelize } from '.';
import type { RuntimeResult } from '../../libs/runtime-types';
import type { HoroscopeChartData, HoroscopeStars } from '../../libs/types';
import type { GenerateStatus } from './report-detail';

const idGenerator = new Worker();

const nextId = () => idGenerator.nextId().toString();

export type PredictReportDateType = 'date' | 'week' | 'year';

export type ReportType = 'predict' | 'natal' | 'synastry' | 'phase';

export interface UserHoroscopeInfo {
  birthDate: string;
  birthPlace: { address: string; longitude: number; latitude: number };
  horoscope: { stars: HoroscopeStars; chartData: HoroscopeChartData };
}

export default class Report extends Model<InferAttributes<Report>, InferCreationAttributes<Report>> {
  declare id: CreationOptional<string>;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;

  declare userId: string;

  declare type: ReportType;

  declare key: string;

  declare meta: {
    _runtime?: {
      fields: RuntimeResult[];
    };
  } & (
    | {
        type: 'predict';
        user: UserHoroscopeInfo;
        date: string;
        dateHoroscope: UserHoroscopeInfo['horoscope'];
        dateType: PredictReportDateType;
      }
    | {
        type: 'natal';
        user: UserHoroscopeInfo;
      }
    | {
        type: 'synastry';
        user: UserHoroscopeInfo;
        secondaryUser: UserHoroscopeInfo;
      }
    | {
        type: 'phase';
        date: string;
        user: UserHoroscopeInfo;
      }
  );

  declare sections: {
    id: string;
    topic: string;
    score: number;
  }[];

  declare error?: string;

  declare generateStatus: GenerateStatus;
}

Report.init(
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
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    key: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    meta: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    sections: {
      type: DataTypes.JSON,
    },
    error: {
      type: DataTypes.TEXT,
    },
    generateStatus: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { sequelize },
);
