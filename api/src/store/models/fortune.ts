import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { Worker } from 'snowflake-uuid';

import { sequelize } from '.';

const idGenerator = new Worker();

const nextId = () => idGenerator.nextId().toString();

interface ReportTypeInterface {
  [key: string]: number;
}

export const ReportType: ReportTypeInterface = {
  NewYear2024: 0, // 2024-01-01
  ChineseYearOfTheDragon2024: 1,
  ChineseYearOfTheSnake2025: 2,
};

export default class Fortune extends Model<InferAttributes<Fortune>, InferCreationAttributes<Fortune>> {
  declare id: CreationOptional<string>;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;

  declare userId: string | null;

  declare status: 'generating' | 'completed' | 'error';

  declare type: number;

  declare report: string | null;

  declare cover: string | null;
}

Fortune.init(
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
    status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cover: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    report: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    type: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  { sequelize },
);
