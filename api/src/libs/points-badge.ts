import { call } from '@blocklet/sdk/lib/component';

import { componentIds } from './constants';
import logger from './logger';

export async function addPointsBadge({ did, ruleId }: { did: string; ruleId: string }) {
  const { data } = await call({
    name: componentIds.pointUp,
    path: '/api/add-badge-cc',
    method: 'POST',
    data: {
      ruleId,
      userDID: did,
    },
  });

  return data;
}

export async function addPointsBadgeWithCatch(...args: Parameters<typeof addPointsBadge>) {
  return addPointsBadge(...args).catch((error) => {
    logger.error('failed to add badge', args, error);
  });
}
