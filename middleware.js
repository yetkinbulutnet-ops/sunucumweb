import { NextResponse } from 'next/server';
import { COOKIE_ADI, DATACENTER_ASN, GUVENLIK_YOLU, iyiBotMu, muafBotUA, kartGecerliMi } from '@/lib/guvenlik';

/**
 * Güvenlik geçişi middleware'i.
 * Akış: Cloudflare `x-swb-asn` başlığını enjekte eder → burada SADECE datacenter/
 * hosting/VPN ASN'leri, doğrulanmış çerezi olmayan ziyaretçiler güvenlik sayfasına
 * yönlendirilir. Gerçek kullanıcılar ve doğrulanmış arama botları HİÇ dokunulmaz.
 * HER hata → fail-open (asla gerçek müşteri/Google engellenmez).
 */
export const config = {
  matcher: [
    // Statik dosyalar, _next, api, güvenlik sayfası ve uzantılı her dosya HARİÇ tüm sayfalar
    '/((?!api/|_next/|assets/|img/|icon/|fonts/|guvenlik|.*\\.[a-zA-Z0-9]+$).*)',
  ],
};

export async function middleware(req) {
  try {
    const asnRaw = req.headers.get('x-swb-asn');
    const asn = asnRaw ? parseInt(asnRaw, 10) : NaN;

    // Cloudflare arkasında değilsek (yerel geliştirme / doğrudan origin) ASN gelmez → dokunma
    if (!asn || Number.isNaN(asn)) return NextResponse.next();

    const secret = process.env.GUVENLIK_SECRET;
    if (!secret) return NextResponse.next(); // yapılandırma eksik → fail-open

    const ip = req.headers.get('cf-connecting-ip') || '';

    // 1) Geçerli geçiş kartı → serbest bırak
    const kart = req.cookies.get(COOKIE_ADI)?.value;
    if (kart && (await kartGecerliMi(kart, ip, secret))) return NextResponse.next();

    // 2) Datacenter ASN değilse → normal ziyaretçi, dokunma
    if (!DATACENTER_ASN.has(asn)) return NextResponse.next();

    // 3) Datacenter'dan gelse bile doğrulanmış arama/sosyal/uptime botu → dokunma (SEO + entegrasyon)
    const ua = req.headers.get('user-agent') || '';
    if (iyiBotMu(ua, asn) || muafBotUA(ua)) return NextResponse.next();

    // 4) Şüpheli (datacenter/VPN) → markalı güvenlik sayfasına rewrite et
    const url = req.nextUrl.clone();
    const devam = req.nextUrl.pathname + req.nextUrl.search;
    url.pathname = GUVENLIK_YOLU;
    url.search = '';
    url.searchParams.set('devam', devam);
    const res = NextResponse.rewrite(url);
    res.headers.set('x-robots-tag', 'noindex, nofollow');
    res.headers.set('cache-control', 'no-store');
    return res;
  } catch {
    return NextResponse.next(); // HER hata → FAIL OPEN
  }
}
