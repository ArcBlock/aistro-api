import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

import { generateImage } from '../ai/image';
import env from './env';
import { PredictTopics, Signs } from './horoscope';
import { backgroundPrompt, fortunePrompt, natalPrompt, predictPrompt, synastryPrompt } from './image-prompts';
import logger from './logger';

const SYNASTRY_STARS = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn'] as const;
const FORTUNE_TYPES = ['2024_new_year', '2024_dragon_spring_festival', '2025_snake_spring_festival'] as const;

// ---------------------------------------------------------------------------
// In-memory cache: key → image URL
// ---------------------------------------------------------------------------

const cache = new Map<string, string>();

function getCachePath(): string {
  const dir = env.dataDir;
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  return join(dir, 'image-cache.json');
}

function loadCache(): void {
  try {
    const path = getCachePath();
    if (existsSync(path)) {
      const data = JSON.parse(readFileSync(path, 'utf-8'));
      for (const [k, v] of Object.entries(data)) {
        if (typeof v === 'string') cache.set(k, v);
      }
      logger.info(`Image cache loaded: ${cache.size} entries`);
    }
  } catch (error) {
    logger.warn('Failed to load image cache, starting fresh', error);
  }
}

function saveCache(): void {
  try {
    const data = Object.fromEntries(cache);
    writeFileSync(getCachePath(), JSON.stringify(data, null, 2));
  } catch (error) {
    logger.warn('Failed to save image cache', error);
  }
}

// Load cache on module initialization
loadCache();

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Synchronous cache lookup. Returns cached URL or undefined.
 */
export function getImage(key: string): string | undefined {
  return cache.get(key);
}

/**
 * Get cached URL or generate a new image and cache it.
 */
export async function getOrGenerate(key: string, prompt: string): Promise<string> {
  const existing = cache.get(key);
  if (existing) return existing;

  const url = await generateImage(prompt);
  cache.set(key, url);
  saveCache();
  return url;
}

// ---------------------------------------------------------------------------
// Prompt resolver: maps cache key to its prompt
// ---------------------------------------------------------------------------

function getPromptForKey(key: string): string | undefined {
  if (key === 'background') return backgroundPrompt();

  const [category, ...rest] = key.split('-');
  const value = rest.join('-');
  if (!value) return undefined;

  switch (category) {
    case 'natal':
      return natalPrompt(value);
    case 'synastry':
      return synastryPrompt(value);
    case 'predict':
      return predictPrompt(value);
    case 'fortune':
      return fortunePrompt(value);
    default:
      return undefined;
  }
}

/**
 * Build the full list of all cache keys that should exist.
 */
function allCacheKeys(): string[] {
  const keys: string[] = [];

  for (const sign of Signs) keys.push(`natal-${sign}`);
  for (const star of SYNASTRY_STARS) keys.push(`synastry-${star}`);
  for (const topic of PredictTopics) keys.push(`predict-${topic}`);
  keys.push('background');
  for (const ft of FORTUNE_TYPES) keys.push(`fortune-${ft}`);

  return keys;
}

/**
 * Pre-generate all missing images in the background.
 * Runs sequentially to avoid rate-limiting. Does not block.
 */
export async function warmUp(): Promise<void> {
  const keys = allCacheKeys();
  const missing = keys.filter((k) => !cache.has(k));

  if (missing.length === 0) {
    logger.info('Image cache is fully warm, no generation needed');
    return;
  }

  logger.info(`Image cache warm-up: ${missing.length} images to generate (${cache.size} cached)`);

  for (const key of missing) {
    const prompt = getPromptForKey(key);
    if (!prompt) continue;

    try {
      await getOrGenerate(key, prompt);
      logger.info(`Image cache warm-up: generated ${key} (${cache.size}/${keys.length})`);
    } catch (error) {
      logger.error(`Image cache warm-up: failed to generate ${key}`, error);
    }
  }

  logger.info(`Image cache warm-up complete: ${cache.size}/${keys.length} images cached`);
}
