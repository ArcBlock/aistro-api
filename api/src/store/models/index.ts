// NOTE: add next line to keep sqlite3 in the bundle
import 'mariadb';
import { Sequelize } from 'sequelize';
import 'sqlite3';

import { config } from '../../libs/env';
import logger from '../../libs/logger';

// TODO: listen config changed and recreate sequelize
export const sequelize = new Sequelize(config.database.url, {
  logging: logger.debug.bind(logger),
  pool: config.database.pool,
});
