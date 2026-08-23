import { NextResponse } from 'next/server';
import { usdKuru } from '@/lib/engines/kur';

export const runtime = 'nodejs';

export async function GET() {
  const veri = await usdKuru();
  return NextResponse.json(
    { ok: true, ...veri },
    { headers: { 'Cache-Control': 'public, max-age=1800, s-maxage=1800' } },
  );
}
