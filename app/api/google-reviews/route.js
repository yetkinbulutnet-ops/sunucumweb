import { NextResponse } from 'next/server';
import { yorumOzeti } from '@/lib/engines/google-reviews';
import { sistemMetinHazirla } from '@/lib/sistem-metin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  await sistemMetinHazirla();
  const sonuc = await yorumOzeti();
  if (!sonuc.ok) {
    return NextResponse.json({ ok: false, error: sonuc.error }, { status: 503 });
  }
  return NextResponse.json(
    { ok: true, ...sonuc.data },
    { headers: { 'Cache-Control': 'public, max-age=300, s-maxage=300, stale-while-revalidate=86400' } },
  );
}
