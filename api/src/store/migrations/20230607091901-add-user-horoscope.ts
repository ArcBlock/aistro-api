import { DataTypes } from 'sequelize';

import type { Migration } from '../migrate';

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.addColumn('Users', 'horoscopeChartData', {
    type: DataTypes.JSON,
  });
  await queryInterface.addColumn('Users', 'horoscopeStars', {
    type: DataTypes.JSON,
  });
};

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.removeColumn('Users', 'horoscopeChartData');
  await queryInterface.removeColumn('Users', 'horoscopeStars');
};
