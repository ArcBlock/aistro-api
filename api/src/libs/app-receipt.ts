import Config from '@blocklet/sdk/lib/config';
import Verifier from 'google-play-billing-validator';
import { isNil } from 'lodash';
import { config as configApple, validate } from 'node-apple-receipt-verify';

import { TEST_IOS_PURCHASE_RECEIPT, config } from './env';
import logger from './logger';

let isAppleReady = false;

Config.events.on('envUpdate', () => {
  isAppleReady = false;
});

export async function verifySubscription({
  platform,
  receipt,
  developerPayload,
}: {
  platform: 'ios' | 'android';
  receipt: string;
  developerPayload?: string;
}): Promise<[object, number]> {
  if (platform === 'ios') {
    if (!isAppleReady) {
      configApple({
        secret: config.billing.ios.secret,
        verbose: false,
        environment: ['production', 'sandbox'],
      });
      isAppleReady = true;
    }

    if (TEST_IOS_PURCHASE_RECEIPT === receipt) {
      return [{}, Date.now() + 3600e3];
    }

    const res = (await validate({ receipt })).filter((i: any) => config.billing.ios.productIds.includes(i.productId));

    const expirationDates = res
      .map((i: any) => i.expirationDate)
      .filter((i: any): i is NonNullable<typeof i> => !isNil(i));

    const expirationDate = expirationDates.length > 0 ? Math.max(...expirationDates) : undefined;

    if (!expirationDate || !Number.isFinite(expirationDate)) {
      logger.info('Failed to verify ios receipt');
      throw new Error('Verify receipt failed');
    }

    return [res, expirationDate];
  }

  try {
    const res = await new Verifier({
      email: config.billing.android.email,
      key: config.billing.android.secret,
    }).verifySub({
      packageName: config.billing.android.packageName,
      productId: config.billing.android.productId,
      purchaseToken: receipt,
    });

    if (!res.isSuccessful) {
      throw new Error(res.errorMessage || 'Verify receipt failed');
    }

    try {
      const res = await new Verifier({
        email: config.billing.android.email,
        key: config.billing.android.secret,
      }).verifySub({
        packageName: config.billing.android.packageName,
        productId: config.billing.android.productId,
        purchaseToken: receipt,
        developerPayload,
      } as any);

      if (!res.isSuccessful) {
        logger.error('acknowledge purchase token not successful');
      }
    } catch (error) {
      logger.error('acknowledge purchase token error', error);
    }

    return [res.payload, res.payload.expiryTimeMillis];
  } catch (error: any) {
    error.message ||= error.errorMessage;
    throw error;
  }
}

export async function verifyPurchaseOfReport({
  platform,
  receipt,
  transactionId,
}: {
  platform: 'ios' | 'android';
  receipt: string;
  transactionId: string;
}): Promise<object> {
  if (platform === 'ios') {
    if (TEST_IOS_PURCHASE_RECEIPT === receipt) {
      return [];
    }

    if (!isAppleReady) {
      configApple({
        secret: config.billing.ios.secret,
        verbose: false,
        environment: ['production', 'sandbox'],
      });
      isAppleReady = true;
    }

    const res = (await validate({ receipt })).filter(
      (i: any) => i.productId === config.billing.ios.reportDetailProductId && i.transactionId === transactionId,
    );

    if (!res.length) {
      logger.info('Failed to verify ios report purchase');
      throw new Error('Verify receipt failed');
    }

    return res;
  }

  try {
    const res = await new Verifier({
      email: config.billing.android.email,
      key: config.billing.android.secret,
    }).verifyINAPP({
      packageName: config.billing.android.packageName,
      productId: config.billing.android.reportDetailProductId!,
      purchaseToken: receipt,
    });

    if (!res.isSuccessful) {
      throw new Error(res.errorMessage || 'Verify receipt failed');
    }
    if (res.payload.orderId !== transactionId) {
      throw new Error(`verify inapp error, orderId not match ${transactionId} - ${res.payload.orderId}`);
    }

    await new Verifier({
      email: config.billing.android.email,
      key: config.billing.android.secret,
    }).verifyINAPP({
      packageName: config.billing.android.packageName,
      productId: config.billing.android.reportDetailProductId!,
      purchaseToken: receipt,
      developerPayload: '',
    } as any);

    return res;
  } catch (error: any) {
    error.message ||= error.errorMessage;
    throw error;
  }
}
