import { createPool } from 'generic-pool';
import { createClient } from 'redis';

import { config } from './env';
import logger from './logger';

// TODO: listen config changed and recreate redis pool
export const redisPool = createPool(
  {
    create: async () => {
      const client = createClient({ url: config.redis.url });
      client.on('error', (err) => logger.error('Redis Client Error', err));
      await client.connect();
      return client;
    },
    destroy: async (client) => {
      await client.quit();
    },
  },
  {
    max: config.redis.pool?.max,
    min: config.redis.pool?.min,
    evictionRunIntervalMillis: 30000,
  },
);

export const withRedis = async <R, T extends (redis: Awaited<ReturnType<typeof redisPool.acquire>>) => Promise<R>>(
  cb: T,
): Promise<R> => {
  const redis = await redisPool.acquire();
  try {
    return await cb(redis);
  } finally {
    await redisPool.release(redis);
  }
};

export const xRead: Awaited<ReturnType<typeof redisPool.acquire>>['xRead'] = async (...args) => {
  return withRedis((redis) => redis.xRead(...args));
};

export const xAdd: Awaited<ReturnType<typeof redisPool.acquire>>['xAdd'] = async (...args) => {
  return withRedis((redis) => redis.xAdd(...args));
};
