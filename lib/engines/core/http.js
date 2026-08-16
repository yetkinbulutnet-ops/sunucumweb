/**
 * Timeout + yeniden deneme destekli fetch.
 * Hicbir motor cikip global fetch'i dogrudan kullanmaz; hepsi buradan gecer ki
 * timeout/retry davranisi tek yerden degistirilebilsin.
 */

/** Verilen ms sonra kendini iptal eden fetch. Asla throw etmez -> { res, error } doner. */
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

/**
 * JSON bekleyen istek. { ok, status, data, error } doner.
 * retries: 5xx / 429 / ag hatasinda kac kez daha denenecegi (artan bekleme ile).
 */
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
      if (!retryable) return last; // 4xx'te tekrar denemenin anlami yok
    }

    if (attempt < retries) await sleep(retryDelayMs * (attempt + 1));
  }
  return last;
}

/** Ayni anda en fazla `limit` is calistirir (dis servisleri bogmamak icin). */
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
