import 'server-only';
import { AI, isAiConfigured } from './config';
import { fetchJson } from '../core/http';
import { ok, fail } from '../core/result';
import { sm } from '@/lib/sistem-metin';

async function call(body) {
  return fetchJson(
    `${AI.baseUrl}/chat/completions`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${AI.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    },
    { timeoutMs: AI.timeoutMs, retries: 1, retryDelayMs: 700 },
  );
}

export async function chatJSON({
  system,
  user,
  jsonTalimati = '',
  schema,
  schemaName = 'sonuc',
  model = AI.models.smart,
  temperature = 0.8,
  topP = 0.95,
  maxTokens = 2500,
  reasoningEffort = 'low',
}) {
  if (!isAiConfigured()) return fail('AI_NOT_CONFIGURED', sm('sistem.ai_anahtar_tanimsiz'));

  const base = {
    temperature,
    top_p: topP,
    max_completion_tokens: maxTokens,
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
  };

  const attempts = [

    {
      ...base,
      model,
      reasoning_effort: reasoningEffort,
      response_format: { type: 'json_schema', json_schema: { name: schemaName, strict: true, schema } },
    },

    {
      ...base,
      model: AI.models.fallback,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: `${system}\n\n${jsonTalimati.replace('{sema}', () => JSON.stringify(schema))}` },
        { role: 'user', content: user },
      ],
    },
  ];

  let lastCode = 'UPSTREAM_ERROR';

  for (const body of attempts) {
    const r = await call(body);

    if (!r.ok) {
      if (r.error === 'TIMEOUT') lastCode = 'TIMEOUT';
      else if (r.status === 401 || r.status === 403) return fail('AI_NOT_CONFIGURED', sm('sistem.ai_anahtar_gecersiz'));
      else if (r.status === 429) lastCode = 'RATE_LIMITED';
      else lastCode = 'UPSTREAM_ERROR';
      continue;
    }

    const content = r.data?.choices?.[0]?.message?.content;
    if (!content) { lastCode = 'EMPTY_RESULT'; continue; }

    let json;
    try {
      json = JSON.parse(content);
    } catch {

      const m = content.match(/\{[\s\S]*\}/);
      if (!m) { lastCode = 'EMPTY_RESULT'; continue; }
      try { json = JSON.parse(m[0]); } catch { lastCode = 'EMPTY_RESULT'; continue; }
    }

    return ok({ json, model: r.data?.model || body.model, usage: r.data?.usage || null });
  }

  return fail(lastCode, sm('sistem.ai_yanit_yok'));
}
