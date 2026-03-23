import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { Worker } from 'snowflake-uuid';

import { sequelize } from '.';
import type { RuntimeResult } from '../../libs/runtime-types';
import type { ReportType } from './report';
import Report from './report';

const idGenerator = new Worker();

export const nextReportDetailId = () => idGenerator.nextId().toString();

export default class ReportDetail extends Model<InferAttributes<ReportDetail>, InferCreationAttributes<ReportDetail>> {
  declare id: CreationOptional<string>;

  declare reportId: string;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;

  declare userId: string;

  declare generateStatus: GenerateStatus;

  declare feedbackStatus?: 'like' | 'dislike';

  declare meta: {
    type: ReportType;
    topic: string;
    score: number;
  };

  declare data?: {
    _runtime?: {
      fields: RuntimeResult[];
    };
    sections: {
      id: string;
      sectionId: string;
      result: RuntimeResult[];
    }[];
  };

  declare error?: string;
}

ReportDetail.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      defaultValue: nextReportDetailId,
    },
    reportId: {
      type: DataTypes.STRING,
      allowNull: false,
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
    generateStatus: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    feedbackStatus: {
      type: DataTypes.STRING,
    },
    meta: {
      type: DataTypes.JSON,
    },
    data: {
      type: DataTypes.JSON,
    },
    error: {
      type: DataTypes.TEXT,
    },
  },
  { sequelize },
);

export type GenerateStatus = 'notstart' | 'generating' | 'finished' | 'error';

ReportDetail.hasOne(Report, { as: 'report', sourceKey: 'reportId', foreignKey: 'id' });
