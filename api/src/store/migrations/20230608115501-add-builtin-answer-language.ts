import { DataTypes } from 'sequelize';

import type { Migration } from '../migrate';

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.addColumn('BuiltinAnswers', 'language', {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'en',
  });
};

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.removeColumn('BuiltinAnswers', 'language');
};
