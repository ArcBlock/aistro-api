import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { Worker } from 'snowflake-uuid';

import { sequelize } from '.';

const idGenerator = new Worker();

const nextId = () => idGenerator.nextId().toString();

export default class InviteFriend extends Model<InferAttributes<InviteFriend>, InferCreationAttributes<InviteFriend>> {
  declare id: CreationOptional<string>;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;

  declare fromUserId: string;

  declare friendName?: string | null;

  declare toUserId?: string | null;

  declare friendBirthDate?: string | null;

  declare friendBirthPlace?: { longitude: number; latitude: number; address: string } | null;

  declare reportId?: string | null;

  declare status?: 'pending' | 'completed' | 'linked';
}

InviteFriend.init(
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
    fromUserId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    toUserId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    friendName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    friendBirthDate: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    friendBirthPlace: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    reportId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  { sequelize },
);
