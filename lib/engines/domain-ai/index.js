import 'server-only';
import { chatJSON } from '../ai/groq';
import { isEngineEnabled } from '../core/flags';
import { ok, fail } from '../core/result';
import { sanitizeBrief } from '../core/text';
import { SYSTEM_PROMPT, buildUserPrompt } from './prompt';
import { IDEAS_SCHEMA, ALLOWED_TLDS, sanitizeIdeas } from './schema';

/**
 * MOTOR: domain-ai
 * Kullanicinin serbest metinle anlattigi isten alan adi onerileri uretir.
 *
 * Bu motor BASKA HICBIR MOTORU tanimaz. Musaitlik kontrolu ayri motorun isidir.
 */

export const ENGINE = {
  id: 'domain-ai',
  title: 'AI Alan Adı Önerici',
  envFlag: 'ENGINE_DOMAIN_AI',
};

const MIN_BRIEF = 15;
const MAX_COUNT = 10;

export async function suggestDomains({ brief, count = 8, tlds } = {}) {
  if (!isEngineEnabled(ENGINE.envFlag)) return fail('ENGINE_DISABLED', 'domain-ai kapali.');

  const cleanBrief = sanitizeBrief(brief, 600);
  if (cleanBrief.length < MIN_BRIEF) {
    return fail('BAD_INPUT', `İşinizi en az ${MIN_BRIEF} karakterle anlatın.`);
  }

  const n = Math.min(Math.max(Number(count) || 8, 3), MAX_COUNT);
  const wantedTlds = Array.isArray(tlds) && tlds.length
    ? tlds.filter((t) => ALLOWED_TLDS.includes(t))
    : null;

  const res = await chatJSON({
    system: SYSTEM_PROMPT,
    user: buildUserPrompt({ brief: cleanBrief, count: n, tlds: wantedTlds }),
    schema: IDEAS_SCHEMA,
    schemaName: 'alan_adi_onerileri',
    temperature: 0.85,
    maxTokens: 2500,
    reasoningEffort: 'low',
  });

  if (!res.ok) return res; // hata tipi aynen yukari gider

  const ideas = sanitizeIdeas(res.data.json, {
    allowedTlds: wantedTlds || ALLOWED_TLDS,
    max: n,
  });

  if (!ideas.length) return fail('EMPTY_RESULT', 'Gecerli oneri uretilemedi.');

  return ok(
    { ideas },
    { model: res.data.model, tokens: res.data.usage?.total_tokens ?? null },
  );
}
