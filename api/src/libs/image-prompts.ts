/**
 * AI image prompt templates for astrological report illustrations.
 * Each function returns a descriptive prompt for AIGNEHubImageModel.
 */

export function natalPrompt(sign: string): string {
  return `A mystical astrological illustration for the zodiac sign ${sign}. Celestial theme with zodiac symbols, stars and constellations. Rich deep blue and gold palette. Professional astrology app style. Square format. No text.`;
}

export function synastryPrompt(star: string): string {
  return `A cosmic illustration representing the planet ${star} in astrology and relationship compatibility. Ethereal space theme with planetary symbols and celestial harmony. Purple and silver tones. Professional astrology app style. Square format. No text.`;
}

export function predictPrompt(topic: string): string {
  return `A dreamy astrological illustration for a "${topic}" daily fortune reading. Soft mystical atmosphere with celestial elements and zodiac motifs. Warm inspiring colors. Professional astrology app style. Square format. No text.`;
}

export function backgroundPrompt(): string {
  return 'A wide celestial background for an astrology app. Starfield with subtle zodiac constellations. Deep navy blue gradient with gentle aurora glow. Elegant and minimal. No text. Wide landscape format.';
}

export function fortunePrompt(type: string): string {
  const label = type.replace(/_/g, ' ');
  return `A festive astrology fortune card cover for "${label}". Celebrating and mystical theme with zodiac elements. Vibrant festive colors with gold accents. Portrait format. No text.`;
}
