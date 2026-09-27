import 'server-only';
import { chatJSON } from '../ai/groq';
import { isEngineEnabled } from '../core/flags';
import { ok, fail } from '../core/result';
import { sm } from '@/lib/sistem-metin';
import { sanitizeBrief } from '../core/text';
import { promptOlustur } from './prompt';
import { aiAyarlari } from '../../cms';
import { IDEAS_SCHEMA, ALLOWED_TLDS, sanitizeIdeas } from './schema';

export const ENGINE = {
  id: 'domain-ai',
  envFlag: 'ENGINE_DOMAIN_AI',
};

const MIN_BRIEF = 15;
const MAX_COUNT = 10;

export async function suggestDomains({ brief, count = 8, tlds } = {}) {
  if (!isEngineEnabled(ENGINE.envFlag)) return fail('ENGINE_DISABLED', sm('sistem.ai_alanadi_kapali'));

  const cleanBrief = sanitizeBrief(brief, 600);
  if (cleanBrief.length < MIN_BRIEF) {
    return fail('BAD_INPUT', sm('sistem.ai_brief_kisa', { sayi: MIN_BRIEF }));
  }

  const n = Math.min(Math.max(Number(count) || 8, 3), MAX_COUNT);
  const wantedTlds = Array.isArray(tlds) && tlds.length
    ? tlds.filter((t) => ALLOWED_TLDS.includes(t))
    : null;

  let talimat;
  try {
    talimat = promptOlustur(await aiAyarlari(), { brief: cleanBrief, count: n, tlds: wantedTlds });
  } catch {
    talimat = null;
  }
  if (!talimat?.system || !talimat.user) return fail('UPSTREAM_ERROR', sm('sistem.ai_ayar_eksik'));

  const res = await chatJSON({
    system: talimat.system,
    user: talimat.user,
    jsonTalimati: talimat.jsonTalimati,
    schema: IDEAS_SCHEMA,
    schemaName: 'alan_adi_onerileri',
    temperature: 0.85,
    maxTokens: 2500,
    reasoningEffort: 'low',
  });

  if (!res.ok) return res;

  const ideas = sanitizeIdeas(res.data.json, {
    allowedTlds: wantedTlds || ALLOWED_TLDS,
    max: n,
  });

  if (!ideas.length) return fail('EMPTY_RESULT', sm('sistem.ai_oneri_yok'));

  return ok(
    { ideas },
    { model: res.data.model, tokens: res.data.usage?.total_tokens ?? null },
  );
}
