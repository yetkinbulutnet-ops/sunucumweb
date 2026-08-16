import { NextResponse } from 'next/server';
import { yorumOzeti } from '@/lib/engines/google-reviews';

export const runtime = 'nodejs';
export const revalidate = 21600;

export async function GET() {
  const sonuc = await yorumOzeti();
  if (!sonuc.ok) {
    return NextResponse.json({ ok: false, error: sonuc.error }, { status: 503 });
  }
  return NextResponse.json(
    { ok: true, ...sonuc.data },
    { headers: { 'Cache-Control': 'public, s-maxage=21600, stale-while-revalidate=86400' } },
  );
}
