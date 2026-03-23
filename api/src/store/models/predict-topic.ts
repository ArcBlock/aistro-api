import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { Worker } from 'snowflake-uuid';

import { sequelize } from '.';

const idGenerator = new Worker();

const nextId = () => idGenerator.nextId().toString();

export default class PredictTopic extends Model<InferAttributes<PredictTopic>, InferCreationAttributes<PredictTopic>> {
  declare id: CreationOptional<string>;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;

  declare topic: string;

  declare language?: string;
}

PredictTopic.init(
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
    topic: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    language: {
      type: DataTypes.STRING,
    },
  },
  { sequelize },
);
