import { NextResponse } from 'next/server';
import {
  COOKIE_ADI, DATACENTER_ASN, BLOKLU_IP, BLOKLU_ASN,
  GUVENLIK_YOLU, BLOK_YOLU, iyiBotMu, muafBotUA, kartGecerliMi,
} from '@/lib/guvenlik';

export const config = {
  matcher: ['/((?!api/|_next/|assets/|img/|icon/|fonts/|guvenlik|engellendi|.*\\.[a-zA-Z0-9]+$).*)'],
};

// Çerez tabanlı hız sayacı (HTML zaten cache'lenmiyor, Set-Cookie zararsız).
const RL_PENCERE_MS = 10000;
const RL_LIMIT = 40;
const RL_COOKIE = 'swb_rl';

function rlDurum(req, now) {
  const parca = (req.cookies.get(RL_COOKIE)?.value || '').split('~');
  let n = parseInt(parca[0], 10);
  let t0 = parseInt(parca[1], 10);
  if (!t0 || now - t0 > RL_PENCERE_MS) { n = 0; t0 = now; }
  n = (n || 0) + 1;
  return { asildi: n > RL_LIMIT, deger: `${n}~${t0}` };
}

function rlYaz(res, deger) {
  res.cookies.set(RL_COOKIE, deger, { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 20 });
  return res;
}

function yonlendir(req, yol, devamEkle) {
  const host = req.headers.get('host') || 'sunucumweb.com';
  let hedef = `https://${host}${yol}`;
  if (devamEkle) {
    const devam = req.nextUrl.pathname + req.nextUrl.search;
    hedef += `?devam=${encodeURIComponent(devam)}`;
  }
  const res = NextResponse.redirect(hedef, 302);
  res.headers.set('x-robots-tag', 'noindex, nofollow');
  res.headers.set('cache-control', 'no-store');
  return res;
}

export async function middleware(req) {
  try {
    const asnRaw = req.headers.get('x-swb-asn');
    const asn = asnRaw ? parseInt(asnRaw, 10) : NaN;
    if (!asn || Number.isNaN(asn)) return NextResponse.next();

    const secret = process.env.GUVENLIK_SECRET;
    if (!secret) return NextResponse.next();

    const ip = req.headers.get('cf-connecting-ip') || '';

    if ((ip && BLOKLU_IP.has(ip)) || BLOKLU_ASN.has(asn)) {
      return yonlendir(req, BLOK_YOLU, false);
    }

    const kart = req.cookies.get(COOKIE_ADI)?.value;
    if (kart && (await kartGecerliMi(kart, ip, secret))) return NextResponse.next();

    const ua = req.headers.get('user-agent') || '';
    if (iyiBotMu(ua, asn) || muafBotUA(ua)) return NextResponse.next();

    const rl = rlDurum(req, Date.now());
    if (DATACENTER_ASN.has(asn) || rl.asildi) {
      return rlYaz(yonlendir(req, GUVENLIK_YOLU, true), rl.deger);
    }

    return rlYaz(NextResponse.next(), rl.deger);
  } catch {
    return NextResponse.next();
  }
}
