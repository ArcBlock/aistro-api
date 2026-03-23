import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { Worker } from 'snowflake-uuid';

import { sequelize } from '.';

const idGenerator = new Worker();

const nextId = () => idGenerator.nextId().toString();

export default class CronHistory extends Model<InferAttributes<CronHistory>, InferCreationAttributes<CronHistory>> {
  declare id: CreationOptional<string>;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;

  declare key: string;

  declare result?: object;

  declare error?: object;
}

CronHistory.init(
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
    key: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    result: {
      type: DataTypes.JSON,
    },
    error: {
      type: DataTypes.JSON,
    },
  },
  { sequelize },
);
