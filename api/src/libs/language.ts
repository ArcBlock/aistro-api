import { Request } from 'express';
import localeCodes from 'locale-codes';

import { config } from './env';

export function getLanguage(req: Request) {
  return parseLanguage(req.query.language || req.body.language || req.acceptsLanguages()[0]);
}

export function parseLanguage(language?: string) {
  if (language) {
    const lang = localeCodes.where('tag', language)?.tag;
    if (lang) {
      if (/^en-/i.test(lang)) return 'en';
      if (/^zh(-(Hans|CN|SG))?$/i.test(lang)) return 'zh';
      if (/^zh-(Hant|HK|MO|TW)$/i.test(lang)) return 'zh-Hant';
      if (/^ja(-JP)?$/i.test(lang)) return 'ja';
      return lang;
    }
  }
  return config.defaultLanguage;
}
