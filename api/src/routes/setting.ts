import { getComponentMountPoint } from '@blocklet/sdk/lib/component';
import { Router } from 'express';

import { componentIds } from '../libs/constants';
import { runBlogGeneration } from '../libs/cron-blog';
import env, { config, configFile } from '../libs/env';
import logger from '../libs/logger';
import { ensureAdmin } from '../libs/security';

const router = Router();

const mountPoint = getComponentMountPoint('aistro');
const pointUpMountPoint = getComponentMountPoint(componentIds.pointUp);

router.get('/', async (_, res) => {
  res.json({
    billing: {
      android: {
        productId: config.billing.android.productId,
      },
      ios: {
        productIds: config.billing.ios.productIds,
      },
    },
    chainHost: env.chainHost,
    mountPoint,
    pointUpMountPoint,
    requireInvite: config.limitation.requireInvite,
    agents: configFile.config?.agents,
  });
});

router.get('/system', ensureAdmin, async (_, res) => {
  res.json(configFile.config);
});

router.post('/system', ensureAdmin, async (req, res) => {
  configFile.config = req.body;
  res.json(configFile.config);
});

router.post('/generate-blog', ensureAdmin, async (_, res) => {
  res.json({ message: 'Blog generation started' });
  runBlogGeneration({ force: true }).catch((error) => logger.error('Manual blog generation failed', error));
});

export default router;
