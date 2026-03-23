import { DataTypes } from 'sequelize';

import type { Migration } from '../migrate';

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.createTable('InviteFriends', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
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
    fromUserId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    friendName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    toUserId: {
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
  });
};

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.dropTable('InviteFriends');
};
