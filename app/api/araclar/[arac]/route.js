import { NextResponse } from 'next/server';
import { aracCalistir } from '@/lib/engines/tools';
import { rateLimit, clientKey, istemciIp } from '@/lib/engines/core/ratelimit';
import { sistemMetinHazirla, sm } from '@/lib/sistem-metin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ARAC_SINIRI = { karaliste: 6, basliklar: 10, ssl: 12 };

const ziyaretciIpAl = (request) => istemciIp(request);

export async function POST(request, { params }) {
  await sistemMetinHazirla();
  const { arac } = await params;

  const limit = rateLimit(clientKey(request, `arac:${arac}`), {
    limit: ARAC_SINIRI[arac] ?? 20,
    windowMs: 60_000,
  });
  if (!limit.allowed) {
    return NextResponse.json(
      { ok: false, error: { code: 'RATE_LIMITED', message: sm('sistem.api_cok_fazla_sorgu') } },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSec) } },
    );
  }

  let govde = {};
  try {
    govde = await request.json();
  } catch {
    govde = {};
  }

  const sonuc = await aracCalistir(arac, govde.girdi, {
    ziyaretciIp: ziyaretciIpAl(request),
    tip: govde.tip,
  });

  return NextResponse.json(sonuc, {
    status: sonuc.ok ? 200 : 400,
    headers: { 'Cache-Control': 'no-store' },
  });
}
