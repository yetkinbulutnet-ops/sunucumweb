import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const KAYNAK = 'https://status.sunucumweb.com/api?status';

export async function GET() {
  try {
    const r = await fetch(KAYNAK, { next: { revalidate: 30 }, headers: { 'User-Agent': 'SunucumWEB-Site' } });
    if (!r.ok) return NextResponse.json({ ok: false }, { status: 503 });
    const d = await r.json();
    return NextResponse.json(
      { ok: true, ...d },
      { headers: { 'Cache-Control': 'public, max-age=30, s-maxage=30, stale-while-revalidate=300' } },
    );
  } catch {
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}
