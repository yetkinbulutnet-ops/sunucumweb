import { NextResponse } from 'next/server';
import { usdKuru } from '@/lib/engines/kur';
import { sistemMetinHazirla } from '@/lib/sistem-metin';

export const runtime = 'nodejs';

export async function GET() {
  await sistemMetinHazirla();
  const veri = await usdKuru();
  return NextResponse.json(
    { ok: true, ...veri },
    { headers: { 'Cache-Control': 'public, max-age=1800, s-maxage=1800' } },
  );
}
