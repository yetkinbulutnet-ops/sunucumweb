import { baytButcesi, clientKey } from '@/lib/engines/core/ratelimit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAKS = 8 * 1024 * 1024;
const BUTCE = 400 * 1024 * 1024;
const PENCERE = 10 * 60_000;

const yanit = (status, govde) => Response.json(govde, { status, headers: { 'cache-control': 'no-store' } });

export async function POST(req) {
  const beyan = parseInt(req.headers.get('content-length') || '', 10);
  if (Number.isFinite(beyan) && beyan > MAKS) return yanit(413, { ok: false });

  const butce = baytButcesi(clientKey(req, 'hiz-yukle'), MAKS, { limit: BUTCE, windowMs: PENCERE });
  if (!butce.allowed) return yanit(429, { ok: false });

  let bayt = 0;
  const okuyucu = req.body?.getReader?.();
  if (okuyucu) {
    for (;;) {
      const { done, value } = await okuyucu.read();
      if (done) break;
      bayt += value?.byteLength || 0;
      if (bayt > MAKS) {
        okuyucu.cancel().catch(() => {});
        return yanit(413, { ok: false });
      }
    }
  }
  return yanit(200, { ok: true, bayt });
}
