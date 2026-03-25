import Config from '@blocklet/sdk/lib/config';
import { env } from '@blocklet/sdk/lib/env';
import { readFileSync, writeFileSync } from 'fs';
import Joi from 'joi';
import path from 'path';

import { defaultNatalReportTemplate, defaultPredictReportTemplate } from './default-report-templates';
import logger from './logger';

export const { TEST_IOS_PURCHASE_RECEIPT } = process.env;

export const isDevelopment = Config.env.mode === 'development';

const EMPTY_BILLING = {
  android: {
    productId: '',
    reportDetailProductId: undefined as string | undefined,
    secret: '',
    email: '',
    packageName: '',
  },
  ios: { secret: '', bundleId: '', productIds: [] as string[], reportDetailProductId: undefined as string | undefined },
};

function parseBillingConfiguration(value: object) {
  const result = Joi.object<{
    android: { productId: string; reportDetailProductId?: string; secret: string; email: string; packageName: string };
    ios: { secret: string; bundleId: string; productIds: string[]; reportDetailProductId?: string };
  }>({
    android: Joi.object({
      productId: Joi.string().empty([null, '']).default(''),
      secret: Joi.string().empty([null, '']).default(''),
      email: Joi.string().empty([null, '']).default(''),
      packageName: Joi.string().empty([null, '']).default(''),
      reportDetailProductId: Joi.string().empty([null, '']),
    }).required(),
    ios: Joi.object({
      secret: Joi.string().empty([null, '']).default(''),
      bundleId: Joi.string().empty([null, '']).default(''),
      productIds: Joi.array().items(Joi.string()).default([]),
      reportDetailProductId: Joi.string().empty([null, '']),
    }).required(),
  }).validate(value, { stripUnknown: true });

  if (result.error) {
    logger.warn(`Billing configuration missing or invalid: ${result.error.message}, using empty defaults`);
    return EMPTY_BILLING;
  }

  return result.value;
}

function parseAITemplates(value: object) {
  const result = Joi.object<{
    projectId: string;
    gitRef: string;
    question: string;
    predict: string;
    natal: string;
    synastry: string;
    translate: string;
    sessionChat: string;
    guide: string;
    summary: string;
    suggestQuestions: string;
    newYear: string;
    dragonYear: string;
    snakeYear: string;
    longTermMemory: string;
    aiUpdateUserInfo: string;
  }>({
    projectId: Joi.string().empty([null, '']).default('default'),
    gitRef: Joi.string().empty([null, '']).default('main'),
    question: Joi.string().required(),
    predict: Joi.string().required(),
    natal: Joi.string().required(),
    synastry: Joi.string().required(),
    translate: Joi.string().required(),
    sessionChat: Joi.string().required(),
    guide: Joi.string().required(),
    summary: Joi.string().required(),
    suggestQuestions: Joi.string().required(),
    newYear: Joi.string().required(),
    longTermMemory: Joi.string().required(),
    dragonYear: Joi.string().required(),
    snakeYear: Joi.string().required(),
    aiUpdateUserInfo: Joi.string().required(),
  }).validate(value, { stripUnknown: true });

  if (result.error) throw new Error(`validate ai templates configuration error ${result.error.message}`);

  return result.value;
}

function parseDatabaseConfiguration(value: object) {
  const result = Joi.object<{
    url: string;
    logging?: boolean;
    pool?: {
      max?: number;
      min?: number;
    };
  }>({
    url: Joi.string().empty([null, '']).default(`sqlite:${env.dataDir}/aistro.db`),
    logging: Joi.boolean().empty([null, '']),
    pool: Joi.object({
      max: Joi.number().integer().min(1).empty([null, '']),
      min: Joi.number().integer().min(0).empty([null, '']),
    }),
  }).validate(value, { stripUnknown: true });

  if (result.error) throw new Error(`validate database configuration error ${result.error.message}`);

  return result.value;
}

function parseLimitationConfiguration(value: object) {
  const result = Joi.object<{
    everyMonthCountForSub: number;
    everyDayCountForFree: number;
    countMessageType: number[];
    requireInvite: boolean;
    publicInviteCodeNumber: number;
  }>({
    everyMonthCountForSub: Joi.number().integer().min(0).default(2000),
    everyDayCountForFree: Joi.number().integer().min(0).default(5),
    countMessageType: Joi.array().items(Joi.number().integer()).default([0]),
    requireInvite: Joi.boolean().default(false),
    publicInviteCodeNumber: Joi.number().integer().min(1).max(1000).default(100),
  }).validate(value, { stripUnknown: true });

  if (result.error) throw new Error(`validate limitation configuration error ${result.error.message}`);

  return result.value;
}

function parseNotificationConfiguration(value: object) {
  const result = Joi.object<{
    sns: {
      region: string;
      credentials: { accessKeyId: string; secretAccessKey: string };
      android: { platformApplicationArn: string };
      ios: { platformApplicationArn: string };
      iosSandbox: { platformApplicationArn: string };
    };
    predict: {
      enable: boolean;
      runAtHourOfDay: number;
      autoGenerate: boolean;
      queueConcurrency: number;
    };
    blog: {
      enable: boolean;
    };
  }>({
    sns: Joi.object({
      region: Joi.string(),
      credentials: Joi.object({
        accessKeyId: Joi.string(),
        secretAccessKey: Joi.string(),
      }),
      android: Joi.object({ platformApplicationArn: Joi.string() }),
      ios: Joi.object({ platformApplicationArn: Joi.string() }),
      iosSandbox: Joi.object({ platformApplicationArn: Joi.string() }),
    }),
    predict: Joi.object({
      enable: Joi.boolean().empty([null, '']).default(false),
      runAtHourOfDay: Joi.number().integer().min(0).max(23).default(8),
      autoGenerate: Joi.boolean().empty([null, '']).default(false),
      queueConcurrency: Joi.number().integer().min(0).default(10),
    }),
    blog: Joi.object({
      enable: Joi.boolean().empty([null, '']).default(false),
    }),
  }).validate(value, { stripUnknown: true });

  if (result.error) throw new Error(`validate notification configuration error ${result.error.message}`);

  return result.value;
}

export type Runtime = {
  fields?: {
    field: string;
    ai?: {
      template: string;
      parameters?: Runtime['fields'];
    };
    variable?: string;
    map?: {
      iterator: string;
      fields: Runtime['fields'];
    };
    translate?: string;
  }[];
};

const runtimeSchema = Joi.object<Runtime>({
  fields: Joi.array().items(
    Joi.object({
      field: Joi.string()
        .regex(/^\w+(?<index>\[index\])?$/)
        .required(),
      ai: Joi.object({
        template: Joi.string().required(),
        parameters: Joi.link('#runtime.fields'),
      }),
      variable: Joi.string().empty([null, '']),
      map: Joi.object({
        iterator: Joi.string().required(),
        fields: Joi.link('#runtime.fields'),
      }),
      translate: Joi.string().empty([null, '']),
    }).oxor('ai', 'variable', 'map', 'translate'),
  ),
}).id('runtime');

function parseReportTemplateConfiguration(value: object) {
  const result = Joi.object<{
    _runtime?: Runtime;
    _details_?: {
      _runtime?: Runtime;
      sections: {
        _id: string;
        _runtime?: Runtime;
        [key: string]: any;
      }[];
    };
  }>({
    _runtime: runtimeSchema,
    _details_: Joi.object({
      _runtime: runtimeSchema,
      sections: Joi.array()
        .items(
          Joi.object({
            _id: Joi.string(),
            _runtime: runtimeSchema,
          }).pattern(Joi.string(), Joi.any()),
        )
        .required(),
    }),
  })
    .required()
    .validate(value, { stripUnknown: true });

  if (result.error) throw new Error(`Validate predict report template configuration error: ${result.error}`);

  return result.value;
}

function parseReportIconsConfiguration(value: object) {
  type ReportIconConfiguration = {
    [key: string]: string | ReportIconConfiguration | undefined;
  };

  const result = Joi.object<ReportIconConfiguration>({})
    .pattern(Joi.string(), Joi.alternatives(Joi.string(), Joi.number(), Joi.link('#reportIcon')))
    .id('reportIcon')
    .validate(value || {}, { stripUnknown: true });

  if (result.error) throw new Error(`Validate predict report icons configuration error: ${result.error.message}`);

  return result.value;
}

function parsePointsConfiguration(value: object) {
  type PointsConfiguration = {
    actions: {
      [action: string]: {
        ruleId: string;
      };
    };
    consume: {
      redeemReport?: {
        ruleId: string;
      };
    };
    badges: {
      [badge: string]: string;
    };
  };

  const result = Joi.object<PointsConfiguration>({
    actions: Joi.object({})
      .pattern(
        Joi.string(),
        Joi.object({
          ruleId: Joi.string().required(),
        }),
      )
      .default({}),
    consume: Joi.object({
      redeemReport: Joi.object({
        ruleId: Joi.string().required(),
      }),
    }).default({}),
    badges: Joi.object({}).pattern(Joi.string(), Joi.string().allow('')).default({}),
  }).validate(value || {}, { stripUnknown: true });

  if (result.error) throw new Error(`Validate points configuration error: ${result.error.message}`);

  return result.value;
}

export default {
  ...env,
  chainHost: process.env.CHAIN_HOST || '',
};

export const config = parseConfigFromPreferences();

Config.events.on('envUpdate', () => {
  for (const key of Object.keys(config)) {
    if (key.startsWith('_')) (config as any)[key] = undefined;
  }
});

function parseConfigFromPreferences() {
  const { preferences } = Config.env;

  return {
    auth: {
      google: {
        _clientId: undefined as string | undefined,
        get clientId() {
          if (!this._clientId) {
            const { error, value } = Joi.string()
              .required()
              .validate(preferences.auth_google_clientId || process.env.GOOGLE_CLIENT_ID);
            if (error) throw new Error(`validate google clientId error: ${error.message}`);
            this._clientId = value;
          }
          return this._clientId;
        },
      },

      apple: {
        _clientId: undefined as string | undefined,
        get clientId() {
          if (!this._clientId) {
            const { error, value } = Joi.string()
              .required()
              .validate(preferences.auth_apple_clientId || process.env.APPLE_CLIENT_ID);
            if (error) throw new Error(`validate apple clientId error: ${error.message}`);
            this._clientId = value;
          }
          return this._clientId;
        },
      },
    },

    _billing: undefined as ReturnType<typeof parseBillingConfiguration> | undefined,
    get billing() {
      const old = tryParse(process.env.BILLING);

      this._billing ??= parseBillingConfiguration({
        android: {
          productId: preferences.billing_android_productId || old?.android?.productId,
          reportDetailProductId: preferences.billing_android_productId_reportDetail,
          packageName: preferences.billing_android_packageName || old?.android?.packageName,
          email: preferences.billing_android_email || old?.android?.email,
          secret: (process.env.BILLING_ANDROID_SECRET || old?.android?.secret)
            ?.replace(/-----BEGIN PRIVATE KEY-----/g, '-----BEGIN PRIVATE KEY-----\n')
            .replace(/-----END PRIVATE KEY-----/g, '\n-----END PRIVATE KEY-----'),
        },
        ios: {
          productIds: (preferences.billing_ios_productIds || old?.ios?.productIds?.join('\n') || '')
            .split(/\s+/)
            .filter(Boolean),
          reportDetailProductId: preferences.billing_ios_productId_reportDetail,
          bundleId: preferences.billing_ios_bundleId || old?.ios?.bundleId,
          secret: process.env.BILLING_IOS_SECRET || old?.ios?.secret,
        },
      });
      return this._billing;
    },

    _limitation: undefined as ReturnType<typeof parseLimitationConfiguration> | undefined,
    get limitation() {
      this._limitation ??= parseLimitationConfiguration(
        preferences.limitation || tryParse(process.env.LIMITATION) || {},
      );
      return this._limitation;
    },

    _notification: undefined as ReturnType<typeof parseNotificationConfiguration> | undefined,
    get notification() {
      const old = tryParse(process.env.NOTIFICATION);

      this._notification ??= parseNotificationConfiguration({
        sns: {
          region: preferences.notification_sns_region || old?.sns?.region,
          credentials: {
            accessKeyId: preferences.notification_sns_accessKeyId || old?.sns?.credentials?.accessKeyId,
            secretAccessKey: process.env.NOTIFICATION_SNS_SECRET_ACCESS_KEY || old?.sns?.credentials?.secretAccessKey,
          },
          android: {
            platformApplicationArn:
              preferences.notification_sns_platformApplicationArn_android || old?.sns?.android?.platformApplicationArn,
          },
          ios: {
            platformApplicationArn:
              preferences.notification_sns_platformApplicationArn_ios || old?.sns?.ios?.platformApplicationArn,
          },
          iosSandbox: {
            platformApplicationArn:
              preferences.notification_sns_platformApplicationArn_iosSandbox ||
              old?.sns?.iosSandbox?.platformApplicationArn,
          },
        },
        predict: {
          enable: preferences.notification_predict_enable,
          runAtHourOfDay: preferences.notification_predict_runAtHourOfDay || old?.todaysFortunes?.runAtHourOfDay,
          autoGenerate: preferences.notification_predict_autoGenerate,
          queueConcurrency: preferences.notification_predict_queueConcurrency,
        },
        blog: {
          enable: preferences.notification_blog_enable,
        },
      });
      return this._notification;
    },

    _templates: undefined as ReturnType<typeof parseAITemplates> | undefined,
    get templates() {
      const old = tryParse(process.env.TEMPLATES);

      this._templates ??= parseAITemplates({
        projectId: preferences.templates_projectId?.toString()?.replace(/^project_/, ''),
        gitRef: preferences.templates_gitRef?.toString(),
        question: preferences.templates_question || old?.question,
        predict: preferences.templates_predict || old?.todaysFortune,
        natal: preferences.templates_natal || old?.natal,
        synastry: preferences.templates_synastry || old?.synastry,
        translate: preferences.templates_translate || old?.translate,
        sessionChat: preferences.templates_sessionChat || old?.sessionChat,
        guide: preferences.templates_guide || old?.guide,
        summary: preferences.templates_summary || old?.summary,
        suggestQuestions: preferences.templates_suggestQuestions || old?.recommends,
        newYear: preferences.templates_newYear,
        dragonYear: preferences.templates_dragon_year,
        snakeYear: preferences.snake_year,
        longTermMemory: preferences.templates_longTermMemory,
        aiUpdateUserInfo: preferences.templates_ai_update_user_info,
      });
      return this._templates;
    },

    _database: undefined as ReturnType<typeof parseDatabaseConfiguration> | undefined,
    get database() {
      const old = tryParse(process.env.DATABASE);

      this._database ??= parseDatabaseConfiguration({
        url: preferences.database_url?.replaceAll('$password$', process.env.DATABASE_PASSWORD || '') || old?.url,
        logging: preferences.database_logging ?? old?.logging,
        pool: {
          min: preferences.database_pool_min || old?.pool?.min,
          max: preferences.database_pool_max || old?.pool?.max,
        },
      });
      return this._database;
    },

    avatars: {
      _pool: undefined as string[] | undefined,
      get pool() {
        if (!this._pool) {
          const old = tryParse(process.env.AVATARS_POOL);
          const { error, value } = Joi.array<string[]>()
            .items(Joi.string())
            .required()
            .validate((preferences.avatars_pool || old?.join('\n') || '').split(/\s+/).filter(Boolean));
          if (error) throw new Error(`validate avatars pool configuration error: ${error.message}`);
          this._pool = value;
        }
        return this._pool;
      },
    },

    _predictReportTemplate: undefined as ReturnType<typeof parseReportTemplateConfiguration> | undefined,
    get predictReportTemplate() {
      if (!this._predictReportTemplate) {
        this._predictReportTemplate =
          (configFile.config?.predictReportTemplate &&
            parseReportTemplateConfiguration(configFile.config?.predictReportTemplate)) ||
          (preferences.predictReportTemplate
            ? parseReportTemplateConfiguration(preferences.predictReportTemplate)
            : parseReportTemplateConfiguration(defaultPredictReportTemplate));
      }
      return this._predictReportTemplate;
    },

    _natalReportTemplate: undefined as ReturnType<typeof parseReportTemplateConfiguration> | undefined,
    get natalReportTemplate() {
      if (!this._natalReportTemplate) {
        return (this._natalReportTemplate =
          (configFile.config?.natalReportTemplate &&
            parseReportTemplateConfiguration(configFile.config?.natalReportTemplate)) ||
          (preferences.natalReportTemplate
            ? parseReportTemplateConfiguration(preferences.natalReportTemplate)
            : parseReportTemplateConfiguration(defaultNatalReportTemplate)));
      }
      return this._natalReportTemplate;
    },

    _synastryReportTemplate: undefined as ReturnType<typeof parseReportTemplateConfiguration> | undefined | null,
    get synastryReportTemplate() {
      if (this._synastryReportTemplate === undefined) {
        const source = configFile.config?.synastryReportTemplate || preferences.synastryReportTemplate;
        this._synastryReportTemplate = source ? parseReportTemplateConfiguration(source) : null;
      }
      return this._synastryReportTemplate;
    },

    _phaseReportTemplate: undefined as ReturnType<typeof parseReportTemplateConfiguration> | undefined | null,
    get phaseReportTemplate() {
      if (this._phaseReportTemplate === undefined) {
        const source = configFile.config?.phaseReportTemplate || preferences.phaseReportTemplate;
        this._phaseReportTemplate = source ? parseReportTemplateConfiguration(source) : null;
      }
      return this._phaseReportTemplate;
    },

    _reportIcons: undefined as ReturnType<typeof parseReportIconsConfiguration> | undefined,
    get reportIcons() {
      if (!this._reportIcons) {
        return (this._reportIcons =
          (configFile.config?.reportIcons && parseReportIconsConfiguration(configFile.config?.reportIcons)) ||
          parseReportIconsConfiguration(preferences.reportIcons));
      }
      return this._reportIcons;
    },

    defaultLanguage: 'en',

    outputSpeed: 50,

    publicPredictTopics: ['love', 'wealth'],

    publicNatalTopics: ['sun', 'ascendant'],

    publicSynastryTopics: ['sun', 'moon'],

    _points: undefined as ReturnType<typeof parsePointsConfiguration> | undefined,
    get points() {
      this._points ??= parsePointsConfiguration(
        typeof preferences.points === 'string' ? tryParse(preferences.points) || {} : preferences.points || {},
      );
      return this._points;
    },
  };
}

export interface SessionChatGreetings {
  [name: string]:
    | {
        [locale: string]: string | undefined;
      }
    | undefined;
}

export interface ConfigFile {
  agents?: ReturnType<typeof parseAgentsConfiguration>;
  predictReportTemplate?: ReturnType<typeof parseReportTemplateConfiguration>;
  natalReportTemplate?: ReturnType<typeof parseReportTemplateConfiguration>;
  synastryReportTemplate?: ReturnType<typeof parseReportTemplateConfiguration>;
  phaseReportTemplate?: ReturnType<typeof parseReportTemplateConfiguration>;
  reportIcons?: ReturnType<typeof parseReportIconsConfiguration>;
  sessionChatGreetings?: {
    blocks?: SessionChatGreetings;
    tools?: SessionChatGreetings;
  };
}

export const configFile = new (class {
  configFilePath = path.join(Config.env.dataDir, 'config.json');

  private _config: ConfigFile | undefined;

  get config() {
    if (!this._config) {
      try {
        this._config = JSON.parse(readFileSync(this.configFilePath).toString());
      } catch (error) {
        logger.error('parse config error', { error });
      }
    }
    return this._config;
  }

  set config(value: ConfigFile | undefined) {
    for (const key of Object.keys(config)) {
      if (key.startsWith('_')) (config as any)[key] = undefined;
    }

    this._config = value;
    writeFileSync(this.configFilePath, JSON.stringify(value));
  }
})();

function tryParse(value: any) {
  try {
    return JSON.parse(value);
  } catch {
    /* empty */
  }

  return null;
}

function parseAgentsConfiguration(value: object) {
  const result = Joi.object<{ [type: string]: { aid: string } }>()
    .pattern(
      Joi.string(),
      Joi.object({
        aid: Joi.string().required(),
      }),
    )
    .validate(value, { stripUnknown: true });

  if (result.error) throw new Error(`Validate agents configuration error: ${result.error}`);

  return result.value;
}
