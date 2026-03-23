import '@blocklet/sdk/lib/error-handler';
import dotenv from 'dotenv-flow';

if (process.env.NODE_ENV === 'development') {
  dotenv.config();
}

const { name } = require('../../../package.json');

(async () => {
  try {
    await import('../store/migrate').then((m) => m.default());
    await import('../store/reset-generating-status').then((m) => m.resetGeneratingStatus());
    process.exit(0);
  } catch (err) {
    console.error(`${name} pre-start error`, err);
    process.exit(1);
  }
})();
