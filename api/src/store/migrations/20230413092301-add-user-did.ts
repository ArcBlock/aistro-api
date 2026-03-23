import { DataTypes } from 'sequelize';

import type { Migration } from '../migrate';

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.addColumn('Users', 'did', { type: DataTypes.STRING });
  await queryInterface.addColumn('Users', 'pk', { type: DataTypes.STRING });
};

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.removeColumn('Users', 'did');
  await queryInterface.removeColumn('Users', 'pk');
};
