import { NextResponse } from 'next/server';
import { enginesStatus } from '@/lib/engines';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Motorlarin durumu. API anahtarini ASLA dondurmez, sadece "hazir mi" bilgisini verir.
 * Sorun yasandiginda ilk bakilacak yer: http://localhost:3000/api/health
 */
export async function GET() {
  return NextResponse.json({ ok: true, engines: enginesStatus() });
}
