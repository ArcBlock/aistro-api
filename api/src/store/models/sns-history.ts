import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { Worker } from 'snowflake-uuid';

import { sequelize } from '.';
import { BuiltinAnswerKeys } from './builtin-answer';

const idGenerator = new Worker();

const nextId = () => idGenerator.nextId().toString();

export default class SNSHistory extends Model<InferAttributes<SNSHistory>, InferCreationAttributes<SNSHistory>> {
  declare id: CreationOptional<string>;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;

  declare reason?: typeof BuiltinAnswerKeys.NotificationTodaysPredict;

  declare target: string;

  declare message: object;
}

SNSHistory.init(
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
    reason: {
      type: DataTypes.STRING,
    },
    target: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  },
  { sequelize },
);
