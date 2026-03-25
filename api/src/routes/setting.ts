import { getComponentMountPoint } from '@blocklet/sdk/lib/component';
import { Router } from 'express';

import { componentIds } from '../libs/constants';
import env, { config, configFile } from '../libs/env';
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

export default router;
