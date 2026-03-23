# Chat Context Router (Reference Only)

This file documents the old AIGNE Studio router logic. In the new project,
routing is handled by `classifyQuestion()` in `ai/chat.ts` using keyword matching.

## Routing Rules

| Route | Trigger Keywords |
|-------|-----------------|
| Natal Report context | future, career, fortune, love, zodiac, sign, birthday, birth place, personal info |
| Moon Phase context | Planet, Moon phase, Planet retrograde, planetary motion |
| Predict Report context | horoscope for a given day, predict report, specific time |
| General (no context) | fallback |
