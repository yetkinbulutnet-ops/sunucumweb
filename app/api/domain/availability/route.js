import { NextResponse } from 'next/server';
import { checkDomains } from '@/lib/engines/domain-availability';
import { rateLimit, clientKey } from '@/lib/engines/core/ratelimit';
import { errorText } from '@/lib/engines/core/result';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** POST { domains: string[] } -> { ok, results: [{domain, status, source}] } */
export async function POST(request) {
  const { allowed, retryAfterSec } = rateLimit(clientKey(request, 'domain-avail'), { limit: 20, windowMs: 60_000 });
  if (!allowed) {
    return NextResponse.json(
      { ok: false, error: { code: 'RATE_LIMITED', message: errorText('RATE_LIMITED') } },
      { status: 429, headers: { 'Retry-After': String(retryAfterSec) } },
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: { code: 'BAD_INPUT', message: errorText('BAD_INPUT') } }, { status: 400 });
  }

  const result = await checkDomains(body?.domains);

  if (!result.ok) {
    const code = result.error.code;
    const status = code === 'BAD_INPUT' ? 400 : code === 'ENGINE_DISABLED' ? 503 : 502;
    return NextResponse.json({ ok: false, error: { code, message: errorText(code) } }, { status });
  }

  return NextResponse.json({ ok: true, results: result.data.results });
}
