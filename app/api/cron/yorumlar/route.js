import { NextResponse } from 'next/server';
import { yorumOzeti, yorumDurumu } from '@/lib/engines/google-reviews';
import { sistemMetinHazirla } from '@/lib/sistem-metin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function yetkili(request) {
  const beklenen = process.env.CRON_TOKEN || '';
  if (!beklenen) return false;
  const gelen =
    request.headers.get('x-cron-token') || new URL(request.url).searchParams.get('key') || '';
  return gelen === beklenen;
}

export async function GET(request) {
  await sistemMetinHazirla();
  if (!yetkili(request)) {
    return NextResponse.json({ ok: false, error: { code: 'YETKISIZ' } }, { status: 401 });
  }

  const sonuc = await yorumOzeti({ zorla: true });
  const durum = yorumDurumu();

  if (!sonuc.ok) {
    return NextResponse.json({ ok: false, error: sonuc.error, durum }, { status: 503 });
  }

  return NextResponse.json(
    { ok: true, ...sonuc.data, durum },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
