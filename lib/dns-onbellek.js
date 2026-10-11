import 'server-only';
import { headers } from 'next/headers';
import { dnsSorgula } from '@/lib/engines/tools';
import { rateLimit, istemciIp } from '@/lib/engines/core/ratelimit';

const SURE_MS = 15 * 60 * 1000;
const AZAMI = 500;
const onbellek = new Map();
const bekleyen = new Map();

export async function dnsSorgulaOnbellekli(alan, tip) {
  const anahtar = `${alan}|${tip}`;
  const kayit = onbellek.get(anahtar);
  if (kayit && Date.now() - kayit.t < SURE_MS) return kayit.sonuc;
  if (bekleyen.has(anahtar)) return bekleyen.get(anahtar);

  const ip = istemciIp({ headers: await headers() });
  if (!rateLimit(`dns-sayfa:${ip || 'bilinmeyen'}`, { limit: 30, windowMs: 60_000 }).allowed) {
    return { ok: false, error: { code: 'RATE_LIMITED' } };
  }

  const is = dnsSorgula(alan, tip)
    .then((sonuc) => {
      if (sonuc?.ok) {
        onbellek.delete(anahtar);
        onbellek.set(anahtar, { t: Date.now(), sonuc });
        while (onbellek.size > AZAMI) onbellek.delete(onbellek.keys().next().value);
      }
      return sonuc;
    })
    .finally(() => bekleyen.delete(anahtar));
  bekleyen.set(anahtar, is);
  return is;
}
