import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { Worker } from 'snowflake-uuid';

import { sequelize } from '.';

const idGenerator = new Worker();

const nextId = () => idGenerator.nextId().toString();

export default class Invite extends Model<InferAttributes<Invite>, InferCreationAttributes<Invite>> {
  declare id: CreationOptional<string>;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;

  declare code: string;

  declare public?: boolean;

  declare userId?: string | null;

  declare note?: string | null;
}

Invite.init(
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
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    public: {
      type: DataTypes.BOOLEAN,
    },
    userId: {
      type: DataTypes.STRING,
    },
    note: {
      type: DataTypes.TEXT,
    },
  },
  { sequelize },
);
