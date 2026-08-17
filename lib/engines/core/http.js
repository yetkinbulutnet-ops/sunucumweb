import { setDefaultResultOrder } from 'node:dns';

try {
  setDefaultResultOrder('ipv4first');
} catch {}

export async function fetchWithTimeout(url, options = {}, timeoutMs = 15000) {
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: ac.signal });
    return { res, error: null };
  } catch (e) {
    const aborted = e?.name === 'AbortError';
    return { res: null, error: aborted ? 'TIMEOUT' : 'NETWORK' };
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchJson(url, options = {}, { timeoutMs = 15000, retries = 1, retryDelayMs = 600 } = {}) {
  let last = { ok: false, status: 0, data: null, error: 'NETWORK' };

  for (let attempt = 0; attempt <= retries; attempt++) {
    const { res, error } = await fetchWithTimeout(url, options, timeoutMs);

    if (error) {
      last = { ok: false, status: 0, data: null, error };
    } else {
      const retryable = res.status === 429 || res.status >= 500;
      let data = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }
      if (res.ok) return { ok: true, status: res.status, data, error: null };
      last = { ok: false, status: res.status, data, error: retryable ? 'UPSTREAM' : 'HTTP' };
      if (!retryable) return last;
    }

    if (attempt < retries) await sleep(retryDelayMs * (attempt + 1));
  }
  return last;
}

export async function mapLimit(items, limit, worker) {
  const out = new Array(items.length);
  let cursor = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const i = cursor++;
      out[i] = await worker(items[i], i);
    }
  });
  await Promise.all(runners);
  return out;
}

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
