import { NextResponse } from 'next/server';
import { aracCalistir } from '@/lib/engines/tools';
import { rateLimit, clientKey } from '@/lib/engines/core/ratelimit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ziyaretciIpAl = (request) =>
  (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() ||
  request.headers.get('x-real-ip') ||
  '';

export async function POST(request, { params }) {
  const { arac } = await params;

  const limit = rateLimit(clientKey(request, `arac:${arac}`), { limit: 20, windowMs: 60_000 });
  if (!limit.allowed) {
    return NextResponse.json(
      { ok: false, error: { code: 'RATE_LIMITED', message: 'Çok fazla sorgu gönderdiniz, biraz bekleyin.' } },
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
