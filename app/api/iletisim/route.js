import { NextResponse } from 'next/server';
import { mesajGonder, formDogrula, konulariGetir } from '@/lib/engines/contact';
import { rateLimit, clientKey, istemciIp } from '@/lib/engines/core/ratelimit';
import { sistemMetinHazirla, sm } from '@/lib/sistem-metin';
import { turnstileDogrula } from '@/lib/abone';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const cokFazla = (saniye) =>
  NextResponse.json(
    { ok: false, error: { code: 'RATE_LIMITED', message: sm('sistem.form_cok_fazla_mesaj') } },
    { status: 429, headers: { 'Retry-After': String(saniye) } },
  );

export async function POST(request) {
  await sistemMetinHazirla();
  const kaba = rateLimit(clientKey(request, 'iletisim-istek'), { limit: 40, windowMs: 10 * 60_000 });
  if (!kaba.allowed) return cokFazla(kaba.retryAfterSec);

  let govde = {};
  try {
    govde = await request.json();
  } catch {
    govde = {};
  }

  if (formDogrula(govde, await konulariGetir()).gecerli) {
    const teslimLimiti = rateLimit(clientKey(request, 'iletisim-teslim'), { limit: 5, windowMs: 10 * 60_000 });
    if (!teslimLimiti.allowed) return cokFazla(teslimLimiti.retryAfterSec);
    const token = typeof govde.token === 'string' ? govde.token.slice(0, 4096) : '';
    let dogru = false;
    try {
      dogru = !!token && (await turnstileDogrula(token, istemciIp(request)));
    } catch {}
    if (!dogru) {
      return NextResponse.json(
        { ok: false, error: { code: 'DOGRULAMA', message: sm('sistem.form_dogrulama_basarisiz') } },
        { status: 400, headers: { 'Cache-Control': 'no-store' } },
      );
    }
  }

  const ip = istemciIp(request);
  const sonuc = await mesajGonder(govde, { ip, tarayici: request.headers.get('user-agent') });

  return NextResponse.json(sonuc, {
    status: sonuc.ok ? 200 : sonuc.error?.code === 'BAD_INPUT' ? 422 : 500,
    headers: { 'Cache-Control': 'no-store' },
  });
}
