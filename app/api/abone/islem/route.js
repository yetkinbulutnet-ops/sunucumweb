import { NextResponse } from 'next/server';
import { sistemMetinHazirla, sm } from '@/lib/sistem-metin';
import { rateLimit } from '@/lib/engines/core/ratelimit';
import { istemciIp, cmsAbone } from '@/lib/abone';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ISLEMLER = new Set(['onay', 'iptal', 'bilgi']);
const BASLIK = { 'Cache-Control': 'no-store' };

const yanit = (status, message) => NextResponse.json({ data: null, error: { status, message } }, { status, headers: BASLIK });

export async function POST(req) {
  await sistemMetinHazirla();
  const ip = istemciIp(req);
  if (!rateLimit(`abone-islem:${ip || 'bilinmiyor'}`, { limit: 30, windowMs: 10 * 60_000 }).allowed) return yanit(429, sm('sistem.abone_cok_fazla_deneme'));
  let b = {};
  try {
    b = await req.json();
  } catch {
    return yanit(400, sm('sistem.abone_gecersiz_istek'));
  }
  if (!ISLEMLER.has(b.islem) || typeof b.token !== 'string' || b.token.length > 100) return yanit(400, sm('sistem.abone_gecersiz_istek'));
  try {
    const { durum, j } = await cmsAbone('islem', { token: b.token, islem: b.islem, ip });
    if (j.data) return NextResponse.json({ data: { durum: j.data.durum, eposta: j.data.eposta } }, { headers: BASLIK });
    return yanit(durum >= 400 && durum < 600 ? durum : 502, sm(`sistem.abone_${j.error?.kod || 'yanit_yok'}`) || sm('sistem.abone_yanit_yok'));
  } catch {
    return yanit(503, sm('sistem.abone_yanit_yok'));
  }
}
