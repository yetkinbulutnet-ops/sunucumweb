import 'server-only';

export { istemciIp } from '@/lib/engines/core/ratelimit';

export const cmsAbone = async (yol, govde) => {
  const r = await fetch(`${(process.env.CMS_INTERNAL_URL || 'http://127.0.0.1:3654').replace(/\/+$/, '')}/api/v1/abone/${yol}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-cark-secret': process.env.CARK_SECRET || '' },
    body: JSON.stringify(govde),
    signal: AbortSignal.timeout(15000),
    cache: 'no-store',
  });
  const j = await r.json().catch(() => ({}));
  return { durum: r.status, j };
};

export const turnstileDogrula = async (token, ip) => {
  const d = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: new URLSearchParams({ secret: process.env.TURNSTILE_SECRET_KEY || '', response: token, ...(ip ? { remoteip: ip } : {}) }),
    signal: AbortSignal.timeout(8000),
  }).then((r) => r.json());
  return !!d.success;
};
