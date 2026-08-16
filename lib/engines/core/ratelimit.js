/**
 * Basit bellek-ici istek limiti (kayan pencere).
 * Tek sunucu ornegi icindir; birden fazla instance'a cikildiginda
 * Redis/Upstash tabanli bir limiter ile degistirilmelidir (arayuz ayni kalir).
 */

const buckets = new Map(); // anahtar -> zaman damgasi dizisi

/**
 * @returns {{allowed:boolean, remaining:number, retryAfterSec:number}}
 */
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

  // bellegi temiz tut: ara sira olu anahtarlari at
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) if (!v.some((t) => t > from)) buckets.delete(k);
  }

  return { allowed: true, remaining: limit - hits.length, retryAfterSec: 0 };
}

/** Istekten kaba bir istemci kimligi cikarir (proxy arkasinda da calisir). */
export function clientKey(request, scope = 'genel') {
  const h = request.headers;
  const ip =
    (h.get('x-forwarded-for') || '').split(',')[0].trim() ||
    h.get('x-real-ip') ||
    h.get('cf-connecting-ip') ||
    'bilinmeyen';
  return `${scope}:${ip}`;
}
