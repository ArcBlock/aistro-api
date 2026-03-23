import { DataTypes } from 'sequelize';

import type { Migration } from '../migrate';

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.dropTable('PredictReports');
  await queryInterface.createTable('Reports', {
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
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    key: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    meta: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    sections: {
      type: DataTypes.JSON,
    },
    error: {
      type: DataTypes.TEXT,
    },
    generateStatus: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  await queryInterface.createTable('ReportDetails', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
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
  });
};

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.dropTable('Reports');
  await queryInterface.createTable('PredictReports', {
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
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    topics: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  });

  await queryInterface.dropTable('ReportDetails');
};
