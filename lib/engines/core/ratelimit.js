import { istemciIp as ipCoz } from '@/lib/guvenlik';

const buckets = new Map();
const butceler = new Map();

function temizle(harita, from) {
  if (harita.size > 5000) {
    for (const [k, v] of harita) if (!v.some((t) => (t.t ?? t) > from)) harita.delete(k);
  }
}

export function rateLimit(key, { limit = 10, windowMs = 60_000 } = {}) {
  const now = Date.now();
  const from = now - windowMs;

  const hits = (buckets.get(key) || []).filter((t) => t > from);

  if (hits.length >= limit) {
    const retryAfterSec = Math.max(1, Math.ceil((hits[0] + windowMs - now) / 1000));
    buckets.set(key, hits);
    return { allowed: false, remaining: 0, retryAfterSec };
  }

  hits.push(now);
  buckets.set(key, hits);
  temizle(buckets, from);

  return { allowed: true, remaining: limit - hits.length, retryAfterSec: 0 };
}

export function baytButcesi(key, bayt, { limit, windowMs }) {
  const now = Date.now();
  const from = now - windowMs;
  const kayitlar = (butceler.get(key) || []).filter((k) => k.t > from);
  const kullanilan = kayitlar.reduce((a, k) => a + k.b, 0);

  if (kullanilan + bayt > limit) {
    butceler.set(key, kayitlar);
    const retryAfterSec = kayitlar.length ? Math.max(1, Math.ceil((kayitlar[0].t + windowMs - now) / 1000)) : 1;
    return { allowed: false, retryAfterSec };
  }

  kayitlar.push({ t: now, b: bayt });
  butceler.set(key, kayitlar);
  temizle(butceler, from);
  return { allowed: true, retryAfterSec: 0 };
}

export function istemciIp(request) {
  return ipCoz((n) => request.headers.get(n));
}

export function clientKey(request, scope = 'genel') {
  return `${scope}:${istemciIp(request) || 'bilinmeyen'}`;
}
