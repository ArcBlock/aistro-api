import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { Worker } from 'snowflake-uuid';

import { sequelize } from '.';

const idGenerator = new Worker();

const nextId = () => idGenerator.nextId().toString();

export default class SNSEndpoint extends Model<InferAttributes<SNSEndpoint>, InferCreationAttributes<SNSEndpoint>> {
  declare id: CreationOptional<string>;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;

  declare userId: string;

  declare platform: string;

  declare deviceToken: string;

  declare snsEndpoint: string;
}

SNSEndpoint.init(
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
    platform: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    deviceToken: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    snsEndpoint: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { sequelize },
);
