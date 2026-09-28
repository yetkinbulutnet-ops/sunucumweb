import { NextResponse } from 'next/server';
import { sistemMetinHazirla, sm } from '@/lib/sistem-metin';
import { istemciIp } from '@/lib/engines/core/ratelimit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const limitler = new Map();
const limitAsildi = (ip) => {
  const simdi = Date.now();
  const liste = (limitler.get(ip) || []).filter((t) => t > simdi - 10 * 60 * 1000);
  liste.push(simdi);
  limitler.set(ip, liste);
  if (limitler.size > 20000) limitler.clear();
  return liste.length > 10;
};

const yanit = (status, message) =>
  NextResponse.json({ data: null, error: { status, message } }, { status, headers: { 'Cache-Control': 'no-store' } });

export async function POST(req) {
  await sistemMetinHazirla();
  const ip = istemciIp(req);
  if (limitAsildi(ip || 'bilinmiyor')) return yanit(429, sm('sistem.cark_cok_fazla_deneme'));

  let b = {};
  try {
    b = await req.json();
  } catch {
    return yanit(400, sm('sistem.cark_gecersiz_istek'));
  }
  if (typeof b.token !== 'string' || !b.token || b.token.length > 4096) return yanit(400, sm('sistem.cark_dogrulama_eksik'));

  try {
    const d = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: new URLSearchParams({ secret: process.env.TURNSTILE_SECRET_KEY || '', response: b.token, ...(ip ? { remoteip: ip } : {}) }),
      signal: AbortSignal.timeout(8000),
    }).then((r) => r.json());
    if (!d.success) return yanit(400, sm('sistem.cark_dogrulama_basarisiz'));
  } catch {
    return yanit(503, sm('sistem.cark_dogrulama_yapilamiyor'));
  }

  try {
    const r = await fetch(`${(process.env.CMS_INTERNAL_URL || 'http://127.0.0.1:3654').replace(/\/+$/, '')}/api/v1/cark/cevir`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-cark-secret': process.env.CARK_SECRET || '' },
      body: JSON.stringify({
        eposta: String(b.eposta || '').slice(0, 254),
        kvkk: b.kvkk === true,
        pazarlama: b.pazarlama === true,
        izinMetni: sm('cark.pazarlama'),
        tarayici: (req.headers.get('user-agent') || '').slice(0, 300),
        ip,
      }),
      signal: AbortSignal.timeout(15000),
      cache: 'no-store',
    });
    const j = await r.json().catch(() => ({}));
    if (j.error?.kod) {
      const metin = sm(`sistem.cark_cms_${j.error.kod}`);
      if (metin) j.error.message = metin;
      delete j.error.kod;
    }
    return NextResponse.json(j, { status: r.status, headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return yanit(503, sm('sistem.cark_yanit_yok'));
  }
}
