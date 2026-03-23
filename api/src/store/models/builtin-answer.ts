import { createHash } from 'crypto';
import { pick, sampleSize } from 'lodash';
import Queue from 'queue';
import ReadableStreamClone from 'readable-stream-clone';
import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Op } from 'sequelize';
import { Worker } from 'snowflake-uuid';
import { Readable } from 'stream';

import { sequelize } from '.';
import { config } from '../../libs/env';
import { streamToString } from '../../libs/stream';

const idGenerator = new Worker();

const nextId = () => idGenerator.nextId().toString();

const generateReportQueue = new Queue({ concurrency: 10, autostart: true });

const generateReportTaskMap: { [key: string]: Promise<BuiltinAnswer & { content: string }> } = {};

const generateQuestionTaskMap: { [key: string]: Promise<string> } = {};

export const BuiltinAnswerKeys = {
  NotificationTodaysPredict: 'Notification-TodaysPredict' as const,
};

export default class BuiltinAnswer extends Model<
  InferAttributes<BuiltinAnswer>,
  InferCreationAttributes<BuiltinAnswer>
> {
  declare id: CreationOptional<string>;

  // 如果是翻译版本的话 `originalAnswerId` 应该为原文 id（一般情况下都是先生成 en 版本，然后再翻译为其他语言）
  // 为了方便用户切换语言时能够找到原文，从而找到对应的翻译版本
  declare originalAnswerId?: string;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;

  // 报告的类型，这个字段中应该包含所有跟报告内容相关的因素。比如:
  // 运势报告: `predict-${today}-${dimension}-${starsKey}`
  // 同一个报告类型可能有多份内容不相关的报告:
  // 1. 因为 cluster 模式下可能同时产生相同类型的报告
  // 2. 业务上面可能需要生成多份相同类型的报告，随机取一份，避免重复率过高的问题
  declare key: string;

  declare question?: string | null;

  declare content?: string | null;

  declare summary?: string | null;

  declare language: string;

  declare score?: number | null;

  static async getOrGenerateQuestion({
    question,
    language,
    generate,
  }: {
    question: string;
    language: string;
    generate: (options: { language: string; question: string }) => Promise<Readable>;
  }): Promise<Readable | string> {
    const sha = createHash('sha256');
    sha.write(question);
    const hash = sha.digest('base64');

    const key = `guide-${hash}`;

    if (!generateQuestionTaskMap[key]) {
      return new Promise((resolve, reject) => {
        generateQuestionTaskMap[key] = (async () => {
          try {
            const answer = await this.findOne({
              where: { key, language, content: { [Op.not]: null } },
              order: [['id', 'DESC']],
              limit: 1,
            });
            if (answer?.content) {
              resolve(answer.content);
              return answer.content;
            }

            const stream = await generate({ language, question });
            const res = new ReadableStreamClone(stream);
            resolve(res);

            const content = await streamToString(stream);
            await this.create({ key, language, question, content });

            return content;
          } catch (error) {
            reject(error);
            throw error;
          }
        })();
      });
    }

    return generateQuestionTaskMap[key]!;
  }

  static async getOrGenerateReport({
    key,
    language,
    generate,
    translate,
    summarize,
  }: {
    key: string;
    language: string;
    generate: (options: { language: string }) => Promise<{ content: string; score?: number }>;
    translate: (options: { content: string; language: string }) => Promise<Readable>;
    summarize: (options: { content: string; language: string }) => Promise<Readable>;
  }): Promise<BuiltinAnswer & { content: string }> {
    const taskKey = `${key}-${language}`;

    const generateReport = async () => {
      const res =
        language === config.defaultLanguage
          ? await new Promise<Awaited<ReturnType<typeof generate>> & { summary?: string }>((resolve, reject) => {
              generateReportQueue.unshift(async () => {
                try {
                  resolve(await generate({ language }));
                } catch (error) {
                  reject(error);
                }
              });
            })
          : await this.getOrGenerateReport({
              key,
              language: config.defaultLanguage,
              generate,
              translate,
              summarize,
            }).then(async (res) => ({
              ...pick(res, 'summary', 'score'),
              originalAnswerId: res.id,
              content: await streamToString(await translate({ content: res.content, language })),
            }));

      res.summary ||= await summarize({ content: res.content, language }).then((s) => streamToString(s));

      return res;
    };

    const startGenerate = async () => {
      try {
        const answer =
          (await this.findOne({
            where: { key, language, content: { [Op.not]: null }, summary: { [Op.not]: null } },
            order: [['id', 'DESC']],
            limit: 1,
          })) ?? (await this.create({ key, language }));

        return await (answer.content
          ? answer
          : generateReport().then((res) => {
              answer.update(res);
              return answer;
            }));
      } catch (error) {
        delete generateReportTaskMap[taskKey];
        throw error;
      }
    };

    generateReportTaskMap[taskKey] ??= startGenerate() as any;

    return generateReportTaskMap[taskKey]!;
  }

  static async getOrTranslateFrom({
    key,
    language,
    random,
    translateFromLanguage,
    translate,
  }: {
    key: string;
    language: string;
    random?: boolean;
    translateFromLanguage?: string;
    translate: (options: { language: string; content: string }) => Promise<string>;
  }) {
    const item = await this.findOne({
      where: { key, language, content: { [Op.not]: null } },
      order: random ? sequelize.random() : [['id', 'desc']],
    });
    if (item) return item;
    if (translateFromLanguage && language !== translateFromLanguage) {
      const source = await this.findOne({
        where: { key, language: translateFromLanguage, content: { [Op.not]: null } },
        order: random ? sequelize.random() : [['id', 'desc']],
      });
      if (source?.content) {
        const translation = await translate({ language, content: source.content });
        return this.create({ originalAnswerId: source.id, key, language, content: translation });
      }
    }
    return null;
  }

  static async getOrTranslateByOriginalId({
    originalAnswerId,
    language,
    translate,
  }: {
    originalAnswerId: string;
    language: string;
    translate: (options: { language: string; content: string }) => Promise<string>;
  }) {
    const item = await this.findOne({
      where: {
        language,
        [Op.or]: [{ id: originalAnswerId }, { originalAnswerId }],
      },
    });

    if (item) return item;

    const original = await BuiltinAnswer.findByPk(originalAnswerId, {
      rejectOnEmpty: new Error('Original answer not found'),
    });

    if (!original.content) throw new Error('the content of original answer is empty');
    const translation = await translate({ language, content: original.content });

    return this.create({
      originalAnswerId: original.id,
      language,
      content: translation,
      ...pick(original, 'key', 'summary', 'score'),
    });
  }
}

BuiltinAnswer.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      defaultValue: nextId,
    },
    originalAnswerId: {
      type: DataTypes.STRING,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    key: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    question: {
      type: DataTypes.TEXT,
    },
    content: {
      type: DataTypes.TEXT,
    },
    summary: {
      type: DataTypes.TEXT,
    },
    language: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: config.defaultLanguage,
    },
  },
  { sequelize },
);

export const staticQA: { [key: string]: { [key: string]: string } } = {
  en: {
    'Please tell me more about Aistro':
      'Aistro = AI + Astrology, we combine AI and Astrology with your personal information to create your own unique AI astrologer and provide you with a professional and personalized prediction experience.',
    'And how do you provide me with personalized forecasts?':
      'After you authorize us to provide your personal information (time and place of birth), we will combine our professional Astrology algorithm and astronomical data to analyze your birth chart, then we will analyze it with our professionally trained AI model and make personalized predictions based on the results.',
    'How do you protect the privacy of my data?':
      'Our decentralized storage solution based on ArcBlock: DID Spaces, stores the data of all conversations between you and Aistro in your own DID Spaces, and the Aistro service promises not to store any of your astrological conversation data.',
    'What is the ArcBlock mentioned above?':
      'ArcBlock is a platform and ecosystem for building and deploying decentralized blockchain applications. combinations between Blocklets can be built in countless combinations and do not need to be dependent on the ArcBlock platform, which is unique.',
  },
  zh: {
    '请跟我详细介绍一下 Aistro':
      'Aistro = AI + Astrology，我们结合 AI 和 Astrology 以及您的个人信息创建属于您的独一无二的专属 AI 占星师，并为您提供专业和个性化的预测体验。',
    'Aistro是如何为我提供个性化的预测的？':
      '在您授权提供您的个人信息(出生时间和地点)之后，我们将会结合专业的 Astrology 算法和天文数据解析出您的出生本命盘，然后我们会通过专业训练的 AI 模型对其进行分析，并根据分析的结果进行个性化的预测。',
    'Aistro是如何保护我的数据隐私？':
      '我们基于 ArcBlock 去中心化的存储方案：DID Spaces，将您和 Aistro 之间所有对话的数据存储于您自己的 DID Spaces 中，Aistro 服务承诺不会存储任何您的占星对话数据。',
    'ArcBlock 是什么？':
      'ArcBlock 是一个用于构建和部署去中心化区块链应用的平台和生态系统。Blocklet 之间的组合可以构建出无数种组合形式，而且并不需要依赖于 ArcBlock 平台，这也是独特之处。',
  },
};

export const staticQAs = Object.values(staticQA);

const staticQuestions = Object.fromEntries(
  Object.entries(staticQA).map(([language, map]) => [language, Object.keys(map)]),
);

export function getStaticAnswer(question: string) {
  for (const m of staticQAs) {
    const a = m[question];
    if (a) return a;
  }

  return undefined;
}

export function getStaticQuestions(language: string, count: number): string[] | undefined {
  const lang = language.startsWith('zh') ? 'zh' : 'en';

  return sampleSize(staticQuestions[lang] ?? [], count);
}
