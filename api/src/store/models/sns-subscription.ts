import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { Worker } from 'snowflake-uuid';

import { sequelize } from '.';
import { SNSTopicType } from './sns-topic';

const idGenerator = new Worker();

const nextId = () => idGenerator.nextId().toString();

export default class SNSSubscription extends Model<
  InferAttributes<SNSSubscription>,
  InferCreationAttributes<SNSSubscription>
> {
  declare id: CreationOptional<string>;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;

  declare userId: string;

  declare topicArn: string;

  declare endpoint: string;

  declare subscription: string;

  declare topicType: SNSTopicType;

  declare utcOffset: number;

  declare language: string;
}

SNSSubscription.init(
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
    topicArn: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    endpoint: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subscription: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    topicType: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    utcOffset: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    language: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { sequelize },
);
