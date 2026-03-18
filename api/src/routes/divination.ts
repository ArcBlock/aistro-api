import type { ChatModelOutput } from '@aigne/core';
import { Router } from 'express';

import createModel from '../libs/model';

const router = Router();

// POST /generate — structured JSON generation
router.post('/generate', async (req, res) => {
  const { systemPrompt, userPrompt, outputSchema, temperature, maxOutputTokens } = req.body;

  if (!systemPrompt || !userPrompt || !outputSchema) {
    res.status(400).json({ error: 'Missing required fields: systemPrompt, userPrompt, outputSchema' });
    return;
  }

  const model = createModel({
    model: req.headers['x-model-name'] as string,
    temperature,
    maxOutputTokens,
  });

  const schemaInstruction = `\n\nYou MUST respond with a valid JSON object that conforms to the following schema:\n${JSON.stringify(outputSchema, null, 2)}\n\nRespond ONLY with the JSON object, no other text.`;

  const result: ChatModelOutput = await model.invoke({
    messages: [
      { role: 'system', content: systemPrompt + schemaInstruction },
      { role: 'user', content: userPrompt },
    ],
  });

  const text = result.text || '';

  try {
    // Extract JSON from the response (handle markdown code blocks)
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, text];
    const parsed = JSON.parse(jsonMatch[1]!.trim());
    res.json(parsed);
  } catch (_e) {
    res.status(502).json({ error: 'Failed to parse model response as JSON', raw: text });
  }
});

// POST /chat — SSE chat (non-streaming invoke, SSE envelope for client compatibility)
router.post('/chat', async (req, res) => {
  const { systemPrompt, messages, temperature, maxOutputTokens } = req.body;

  if (!systemPrompt || !messages) {
    res.status(400).json({ error: 'Missing required fields: systemPrompt, messages' });
    return;
  }

  const model = createModel({
    model: req.headers['x-model-name'] as string,
    temperature,
    maxOutputTokens,
  });

  // Map Gemini role convention to AIGNE convention
  const mappedMessages = [
    { role: 'system' as const, content: systemPrompt },
    ...messages.map((msg: { role: string; content: string }) => ({
      role: msg.role === 'model' ? ('agent' as const) : (msg.role as 'user' | 'agent'),
      content: msg.content,
    })),
  ];

  // Invoke model first (non-streaming), then send result as SSE
  let result: ChatModelOutput;
  try {
    result = await model.invoke({ messages: mappedMessages });
  } catch (err: any) {
    res.status(502).json({ error: err.message || 'Failed to invoke model' });
    return;
  }

  // Model invoked successfully — now start SSE response
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  const text = result.text || '';
  if (text) {
    // Split by sentences for a streaming feel
    const chunks = text.match(/[^.!?。！？\n]+[.!?。！？\n]?\s*/g) || [text];
    for (const chunk of chunks) {
      res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
    }
  }

  res.write('data: [DONE]\n\n');
  res.end();
});

export default router;
