import { NextResponse } from 'next/server';
import { suggestDomains } from '@/lib/engines/domain-ai';
import { rateLimit, clientKey } from '@/lib/engines/core/ratelimit';
import { errorText } from '@/lib/engines/core/result';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request) {

  const { allowed, retryAfterSec } = rateLimit(clientKey(request, 'domain-ai'), { limit: 8, windowMs: 60_000 });
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

  const result = await suggestDomains({
    brief: body?.brief,
    count: body?.count,
    tlds: body?.tlds,
  });

  if (!result.ok) {
    const code = result.error.code;
    const status = code === 'BAD_INPUT' ? 400 : code === 'RATE_LIMITED' ? 429 : code === 'ENGINE_DISABLED' ? 503 : 502;

    return NextResponse.json(
      { ok: false, error: { code, message: code === 'BAD_INPUT' ? result.error.message : errorText(code) } },
      { status },
    );
  }

  return NextResponse.json({ ok: true, ideas: result.data.ideas, meta: result.meta });
}
