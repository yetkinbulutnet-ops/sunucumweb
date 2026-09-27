import { NextResponse } from 'next/server';
import { sistemMetinHazirla } from '@/lib/sistem-metin';
import { rateLimit } from '@/lib/engines/core/ratelimit';
import { istemciIp, cmsAbone } from '@/lib/abone';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req) {
  await sistemMetinHazirla();
  const ip = istemciIp(req);
  if (!rateLimit(`abone-cik:${ip || 'bilinmiyor'}`, { limit: 30, windowMs: 10 * 60_000 }).allowed) return new NextResponse(null, { status: 429 });
  const token = new URL(req.url).searchParams.get('t') || '';
  if (!token || token.length > 100) return new NextResponse(null, { status: 400 });
  try {
    const { durum } = await cmsAbone('islem', { token, islem: 'tek-tik', ip });
    return new NextResponse(null, { status: durum === 200 ? 200 : durum === 404 ? 404 : 502, headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return new NextResponse(null, { status: 503 });
  }
}

export async function GET(req) {
  const t = new URL(req.url).searchParams.get('t') || '';
  return NextResponse.redirect(new URL(`/bulten?islem=iptal&t=${encodeURIComponent(t.slice(0, 100))}`, process.env.SITE_URL || req.url), 303);
}
