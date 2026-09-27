import { NextResponse } from 'next/server';
import { enginesStatus } from '@/lib/engines';
import { sistemMetinHazirla } from '@/lib/sistem-metin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  await sistemMetinHazirla();
  return NextResponse.json({ ok: true, engines: enginesStatus() });
}
