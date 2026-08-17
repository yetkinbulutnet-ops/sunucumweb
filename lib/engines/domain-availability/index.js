import { fetchWithTimeout, fetchJson, mapLimit } from '../core/http';
import { ok, fail } from '../core/result';
import { isEngineEnabled } from '../core/flags';
import { rdapServerFor } from '../core/rdap';

export const ENGINE = {
  id: 'domain-availability',
  title: 'Alan Adı Müsaitlik Kontrolü',
  envFlag: 'ENGINE_DOMAIN_AVAILABILITY',
};

export const STATUS = { AVAILABLE: 'musait', TAKEN: 'alinmis', UNKNOWN: 'bilinmiyor' };

const DOMAIN_RE = /^[a-z0-9]([a-z0-9-]{1,28}[a-z0-9])?(\.[a-z]{2,10}){1,2}$/;
const MAX_BATCH = 12;

async function hasNameservers(domain) {
  const r = await fetchJson(
    `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=NS`,
    { headers: { Accept: 'application/dns-json' } },
    { timeoutMs: 6000, retries: 0 },
  );
  if (!r.ok || !r.data) return null;
  if (r.data.Status === 3) return false;
  const records = [...(r.data.Answer || []), ...(r.data.Authority || [])];
  return records.some((a) => a.type === 2);
}

async function rdapRegistered(domain) {
  const server = await rdapServerFor(domain);
  if (!server) return null;

  const { res, error } = await fetchWithTimeout(
    `${server}domain/${encodeURIComponent(domain)}`,
    { headers: { Accept: 'application/rdap+json' } },
    8000,
  );
  if (error || !res) return null;
  if (res.status === 200) return true;
  if (res.status === 404) return false;
  return null;
}

async function checkOne(domain) {
  const [rdap, ns] = await Promise.all([rdapRegistered(domain), hasNameservers(domain)]);

  if (rdap === true) return { domain, status: STATUS.TAKEN, source: 'rdap' };
  if (ns === true) return { domain, status: STATUS.TAKEN, source: 'dns' };
  if (rdap === false) return { domain, status: STATUS.AVAILABLE, source: ns === false ? 'rdap+dns' : 'rdap' };
  return { domain, status: STATUS.UNKNOWN, source: rdap === null ? 'rdap-yok' : 'belirsiz' };
}

export async function checkDomains(domains) {
  if (!isEngineEnabled(ENGINE.envFlag)) return fail('ENGINE_DISABLED', 'musaitlik motoru kapali.');

  const list = [...new Set((Array.isArray(domains) ? domains : [])
    .map((d) => String(d).trim().toLowerCase())
    .filter((d) => DOMAIN_RE.test(d)))].slice(0, MAX_BATCH);

  if (!list.length) return fail('BAD_INPUT', 'Gecerli alan adi verilmedi.');

  const results = await mapLimit(list, 6, checkOne);

  return ok({ results });
}
