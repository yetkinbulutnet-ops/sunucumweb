import { baytButcesi, clientKey } from '@/lib/engines/core/ratelimit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const PARCA = 65536;
const MAKS = 32 * 1024 * 1024;
const VARSAYILAN = 8 * 1024 * 1024;
const BUTCE = 1024 * 1024 * 1024;
const PENCERE = 10 * 60_000;

let blok = null;
function blokGetir() {
  if (!blok) {
    blok = new Uint8Array(PARCA);
    crypto.getRandomValues(blok);
  }
  return blok;
}

export async function GET(req) {
  const istenen = parseInt(new URL(req.url).searchParams.get('bayt') || '', 10);
  const toplam = Number.isFinite(istenen) && istenen > 0 ? Math.min(istenen, MAKS) : VARSAYILAN;

  const butce = baytButcesi(clientKey(req, 'hiz-indir'), toplam, { limit: BUTCE, windowMs: PENCERE });
  if (!butce.allowed) {
    return new Response(null, { status: 429, headers: { 'cache-control': 'no-store', 'retry-after': String(butce.retryAfterSec) } });
  }

  const veri = blokGetir();
  let kalan = toplam;

  const akis = new ReadableStream({
    pull(kontrol) {
      if (kalan <= 0) {
        kontrol.close();
        return;
      }
      const n = Math.min(PARCA, kalan);
      kontrol.enqueue(n === PARCA ? veri : veri.subarray(0, n));
      kalan -= n;
    },
  });

  return new Response(akis, {
    headers: {
      'content-type': 'application/octet-stream',
      'content-length': String(toplam),
      'cache-control': 'no-store, no-transform',
      'x-accel-buffering': 'no',
    },
  });
}
