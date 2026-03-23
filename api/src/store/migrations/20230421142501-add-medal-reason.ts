import { DataTypes } from 'sequelize';

import type { Migration } from '../migrate';

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.addColumn('Medals', 'reason', {
    type: DataTypes.STRING,
  });
  await queryInterface.addColumn('Billings', 'transactionId', {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '',
  });
};

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.removeColumn('Medals', 'reason');
  await queryInterface.removeColumn('Billings', 'transactionId');
};
