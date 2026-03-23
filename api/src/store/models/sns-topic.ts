import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { Worker } from 'snowflake-uuid';

import { sequelize } from '.';

// TODO: Phase 4 - migrate sns.ts and restore createTopic import
async function createTopic({ name }: { name: string }): Promise<string> {
  throw new Error(`SNS not yet migrated - createTopic unavailable for topic: ${name}`);
}

const idGenerator = new Worker();

const nextId = () => idGenerator.nextId().toString();

export enum SNSTopicType {
  Default = 0,
}

export default class SNSTopic extends Model<InferAttributes<SNSTopic>, InferCreationAttributes<SNSTopic>> {
  declare id: CreationOptional<string>;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;

  declare name: string;

  declare arn: string;

  declare type: SNSTopicType;

  declare utcOffset: number;

  declare language: string;

  static async findOrCreateWithArn({
    type,
    utcOffset,
    language,
  }: {
    type: SNSTopicType;
    utcOffset: number;
    language: string;
  }) {
    const item = await this.findOne({ where: { type, utcOffset, language } });
    if (item) return item;
    const name = `Topic-${type}-${utcOffset}-${language}`;
    const arn = await createTopic({ name });
    return (await this.upsert({ name, arn, type, utcOffset, language }))[0];
  }
}

SNSTopic.init(
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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    arn: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    utcOffset: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    language: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { sequelize },
);
