import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Op } from 'sequelize';
import { Worker } from 'snowflake-uuid';

import { sequelize } from '.';
import logger from '../../libs/logger';
import ReportDetail from './report-detail';

// TODO: Phase 4 - migrate app-receipt.ts and restore verifySubscription import
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function verifySubscription(_args: any): Promise<[any, number]> {
  throw new Error('App receipt verification not yet migrated');
}

const idGenerator = new Worker();

const nextId = () => idGenerator.nextId().toString();

export default class Billing extends Model<InferAttributes<Billing>, InferCreationAttributes<Billing>> {
  declare id: CreationOptional<string>;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;

  declare userId: string;

  declare platform: 'ios' | 'android' | 'unknown';

  declare receipt: string;

  // ios 的 transactionId，android 的 orderId
  declare transactionId: CreationOptional<string>;

  declare verification?: object;

  declare expirationDate?: number | null;

  // 购买对象 id：reportDetailId
  declare purchaseTargetId?: string | null;

  static async getLatestSubscription({ userId }: { userId: string }) {
    const billing = await this.findOne({
      where: { userId, expirationDate: { [Op.not]: null } },
      order: [['expirationDate', 'DESC']],
      limit: 1,
    });
    if (!billing) {
      return billing;
    }
    if (billing.expirationDate && billing.expirationDate > Date.now()) {
      return billing;
    }
    if (billing.expirationDate) {
      try {
        const { platform, receipt } = billing;
        if (platform !== 'android' && platform !== 'ios') throw new Error(`Unsupported platform ${platform}`);
        const [verification, expirationDate] = await verifySubscription({ platform, receipt });
        return await billing.update({ verification, expirationDate });
      } catch (error) {
        logger.info('Failed to verify subscription', { error });
      }
    }
    return billing;
  }

  static async isUserSubAvailable({ userId }: { userId: string }) {
    const billing = await this.getLatestSubscription({ userId });
    if (billing?.expirationDate && billing.expirationDate > Date.now()) {
      return billing;
    }
    return null;
  }

  static async isPurchased({
    userId,
    purchaseTargetId,
  }: {
    userId: string;
    purchaseTargetId: string;
  }): Promise<boolean>;
  static async isPurchased({
    userId,
    purchaseTargetId,
  }: {
    userId: string;
    purchaseTargetId: string[];
  }): Promise<{ [key: string]: boolean }>;
  static async isPurchased({
    userId,
    purchaseTargetId,
  }: {
    userId: string;
    purchaseTargetId: string | string[];
  }): Promise<boolean | { [key: string]: boolean }> {
    const ids = typeof purchaseTargetId === 'string' ? [purchaseTargetId] : purchaseTargetId;

    const purchased = Object.fromEntries(
      (ids.length ? await this.findAll({ where: { userId, purchaseTargetId: { [Op.in]: ids } } }) : []).map((i) => [
        i.purchaseTargetId,
        true,
      ]),
    );

    return typeof purchaseTargetId === 'string' ? purchased[purchaseTargetId] || false : purchased;
  }
}

Billing.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      defaultValue: nextId,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    platform: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    receipt: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
    transactionId: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    verification: {
      type: DataTypes.JSON,
    },
    expirationDate: {
      type: DataTypes.BIGINT,
    },
    purchaseTargetId: {
      type: DataTypes.STRING,
    },
  },
  { sequelize },
);

Billing.hasOne(ReportDetail, { sourceKey: 'purchaseTargetId', foreignKey: 'id', as: 'reportDetail' });
