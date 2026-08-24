import { NextResponse } from 'next/server';
import { COOKIE_ADI, GECERLILIK_SN } from '@/lib/guvenlik-config';
import { kartOlustur } from '@/lib/guvenlik';

export const dynamic = 'force-dynamic';

const SITEVERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

// Yalnız aynı-origin YOL kabul et (açık yönlendirme / open-redirect engeli)
function guvenliDevam(v) {
  if (typeof v !== 'string' || !v.startsWith('/') || v.startsWith('//')) return '/';
  return v;
}

function taban(req) {
  // Cloudflare arkasında req.url dahili (127.0.0.1) olabilir → gerçek origin'i kullan
  return process.env.SITE_URL || `https://${req.headers.get('host') || 'sunucumweb.com'}`;
}

function hataYonlendir(base, devam) {
  const u = new URL('/guvenlik', base);
  u.searchParams.set('devam', devam);
  u.searchParams.set('hata', '1');
  return NextResponse.redirect(u, 303);
}

export async function POST(req) {
  const base = taban(req);
  let devam = '/';
  try {
    // Not: req.formData() bu custom-server/standalone kurulumda güvenilir değil;
    // ham gövdeyi urlencoded olarak elle çözüyoruz (form dosya içermiyor).
    const ham = await req.text();
    const form = new URLSearchParams(ham);
    devam = guvenliDevam(form.get('devam'));
    const token = form.get('cf-turnstile-response');

    const secret = process.env.GUVENLIK_SECRET;
    const gizli = process.env.TURNSTILE_SECRET_KEY;
    const ip = req.headers.get('cf-connecting-ip') || '';

    if (!token || !gizli || !secret) return hataYonlendir(base, devam);

    // Turnstile jetonunu Cloudflare'da doğrula
    const govde = new URLSearchParams();
    govde.set('secret', gizli);
    govde.set('response', String(token));
    if (ip) govde.set('remoteip', ip);

    const yanit = await fetch(SITEVERIFY, { method: 'POST', body: govde });
    const sonuc = await yanit.json().catch(() => ({ success: false }));
    if (!sonuc.success) return hataYonlendir(base, devam);

    // Geçiş kartı: IP'ye bağlı, imzalı, 7 gün geçerli
    const { deger } = await kartOlustur(ip, secret, GECERLILIK_SN);
    const res = NextResponse.redirect(new URL(devam, base), 303);
    res.cookies.set(COOKIE_ADI, deger, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: GECERLILIK_SN,
    });
    return res;
  } catch {
    return hataYonlendir(base, devam);
  }
}

// Yanlışlıkla GET ile gelinirse güvenlik sayfasına geri gönder
export async function GET(req) {
  return NextResponse.redirect(new URL('/guvenlik', taban(req)), 303);
}
