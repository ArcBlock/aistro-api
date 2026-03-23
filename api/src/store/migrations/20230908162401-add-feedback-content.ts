import { DataTypes } from 'sequelize';

import type { Migration } from '../migrate';

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.addColumn('Feedbacks', 'content', {
    type: DataTypes.TEXT('long'),
  });
  await queryInterface.addColumn('Feedbacks', 'sectionId', {
    type: DataTypes.STRING,
  });
};

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.removeColumn('Feedbacks', 'content');
  await queryInterface.removeColumn('Feedbacks', 'sectionId');
};
