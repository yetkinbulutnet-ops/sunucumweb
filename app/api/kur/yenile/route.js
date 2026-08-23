import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export const runtime = 'nodejs';

const SECRET = process.env.KUR_YENILE_SECRET || '';

export async function GET(req) {
  const s = new URL(req.url).searchParams.get('s') || '';
  if (!SECRET || s !== SECRET) return NextResponse.json({ ok: false }, { status: 403 });
  revalidateTag('kur');
  return NextResponse.json({ ok: true, yenilendi: true });
}
