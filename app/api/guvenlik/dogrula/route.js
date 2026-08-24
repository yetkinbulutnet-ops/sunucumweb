import { NextResponse } from 'next/server';
import { COOKIE_ADI, GECERLILIK_SN } from '@/lib/guvenlik-config';
import { kartOlustur, refUret } from '@/lib/guvenlik';

export const dynamic = 'force-dynamic';

const SITEVERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

function guvenliDevam(v) {
  if (typeof v !== 'string' || !v.startsWith('/') || v.startsWith('//')) return '/';
  return v;
}

function taban(req) {
  return process.env.SITE_URL || `https://${req.headers.get('host') || 'sunucumweb.com'}`;
}

function hataYonlendir(base, ip) {
  const u = new URL('/guvenlik', base);
  u.searchParams.set('refid', refUret());
  u.searchParams.set('ip', ip || 'bilinmiyor');
  u.searchParams.set('hata', '1');
  return NextResponse.redirect(u, 303);
}

export async function POST(req) {
  const base = taban(req);
  const ip = req.headers.get('cf-connecting-ip') || '';
  const devam = guvenliDevam(req.cookies.get('swb_devam')?.value);
  try {
    const ham = await req.text();
    const form = new URLSearchParams(ham);
    const token = form.get('cf-turnstile-response');

    const secret = process.env.GUVENLIK_SECRET;
    const gizli = process.env.TURNSTILE_SECRET_KEY;
    if (!token || !gizli || !secret) return hataYonlendir(base, ip);

    const govde = new URLSearchParams();
    govde.set('secret', gizli);
    govde.set('response', String(token));
    if (ip) govde.set('remoteip', ip);

    const yanit = await fetch(SITEVERIFY, { method: 'POST', body: govde });
    const sonuc = await yanit.json().catch(() => ({ success: false }));
    if (!sonuc.success) return hataYonlendir(base, ip);

    const { deger } = await kartOlustur(ip, secret, GECERLILIK_SN);
    const res = NextResponse.redirect(new URL(devam, base), 303);
    res.cookies.set(COOKIE_ADI, deger, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: GECERLILIK_SN,
    });
    res.cookies.set('swb_devam', '', { path: '/', maxAge: 0 });
    return res;
  } catch {
    return hataYonlendir(base, ip);
  }
}

export async function GET(req) {
  return NextResponse.redirect(new URL('/guvenlik', taban(req)), 303);
}
