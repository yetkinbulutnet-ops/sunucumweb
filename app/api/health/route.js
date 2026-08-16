import { NextResponse } from 'next/server';
import { enginesStatus } from '@/lib/engines';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({ ok: true, engines: enginesStatus() });
}
