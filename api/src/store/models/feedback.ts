import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { Worker } from 'snowflake-uuid';

import { sequelize } from '.';

const idGenerator = new Worker();

const nextId = () => idGenerator.nextId().toString();

export default class Feedback extends Model<InferAttributes<Feedback>, InferCreationAttributes<Feedback>> {
  declare id: CreationOptional<string>;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;

  declare userId: string;

  declare key: `report-detail-${string}`;

  declare action: 'like' | 'dislike' | 'cancel';

  declare sectionId?: string | null;

  declare content?: string;

  status() {
    return this.action === 'cancel' ? undefined : this.action;
  }

  static async reportDetailStatus(userId: string, reportDetailId: string, sectionId?: string) {
    const feedback = await this.findOne({
      where: { userId, key: `report-detail-${reportDetailId}`, sectionId: sectionId || null },
      order: [['id', 'DESC']],
    });
    return feedback?.status();
  }
}

Feedback.init(
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
    key: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sectionId: {
      type: DataTypes.STRING,
    },
    content: {
      type: DataTypes.TEXT('long'),
    },
  },
  { sequelize },
);
