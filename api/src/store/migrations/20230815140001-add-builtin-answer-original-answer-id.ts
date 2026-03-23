import { DataTypes } from 'sequelize';

import type { Migration } from '../migrate';

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.addColumn('BuiltinAnswers', 'originalAnswerId', {
    type: DataTypes.STRING,
  });
};

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.removeColumn('BuiltinAnswers', 'originalAnswerId');
};
