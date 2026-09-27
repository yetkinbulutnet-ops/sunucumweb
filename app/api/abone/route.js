import { NextResponse } from 'next/server';
import { sistemMetinHazirla, sm } from '@/lib/sistem-metin';
import { rateLimit } from '@/lib/engines/core/ratelimit';
import { istemciIp, cmsAbone, turnstileDogrula } from '@/lib/abone';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const KAYNAKLAR = new Set(['footer', 'anasayfa', 'kampanyalar', 'blog', 'iletisim']);
const EPOSTA_RE = /^[^\s@]{1,64}@[^\s@]{1,190}\.[a-z]{2,24}$/i;
const BASLIK = { 'Cache-Control': 'no-store' };

const yanit = (status, message) => NextResponse.json({ data: null, error: { status, message } }, { status, headers: BASLIK });

export async function POST(req) {
  await sistemMetinHazirla();
  const ip = istemciIp(req);
  if (!rateLimit(`abone:${ip || 'bilinmiyor'}`, { limit: 6, windowMs: 10 * 60_000 }).allowed) return yanit(429, sm('sistem.abone_cok_fazla_deneme'));

  let b = {};
  try {
    b = await req.json();
  } catch {
    return yanit(400, sm('sistem.abone_gecersiz_istek'));
  }
  const eposta = String(b.eposta || '').trim().slice(0, 254);
  if (b.web) return NextResponse.json({ data: { durum: 'beklemede' } }, { headers: BASLIK });
  if (!EPOSTA_RE.test(eposta)) return yanit(400, sm('sistem.abone_eposta_gecersiz'));
  if (b.izin !== true) return yanit(400, sm('sistem.abone_izin'));
  if (!KAYNAKLAR.has(b.kaynak)) return yanit(400, sm('sistem.abone_gecersiz_istek'));
  if (typeof b.token !== 'string' || !b.token || b.token.length > 4096) return yanit(400, sm('sistem.abone_dogrulama_eksik'));

  try {
    if (!(await turnstileDogrula(b.token, ip))) return yanit(400, sm('sistem.abone_dogrulama_basarisiz'));
  } catch {
    return yanit(503, sm('sistem.abone_dogrulama_yapilamiyor'));
  }

  try {
    const { durum, j } = await cmsAbone('kayit', {
      eposta,
      izin: true,
      kaynak: b.kaynak,
      izinMetni: `${sm('bulten.izin_link')} ${sm('bulten.izin_metni')}`.trim(),
      ip,
      tarayici: (req.headers.get('user-agent') || '').slice(0, 300),
    });
    if (j.data) return NextResponse.json({ data: { durum: j.data.durum } }, { headers: BASLIK });
    return yanit(durum >= 400 && durum < 600 ? durum : 502, sm(`sistem.abone_${j.error?.kod || 'yanit_yok'}`) || sm('sistem.abone_yanit_yok'));
  } catch {
    return yanit(503, sm('sistem.abone_yanit_yok'));
  }
}
