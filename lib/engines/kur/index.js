import 'server-only';
import { unstable_cache } from 'next/cache';

const VARSAYILAN_USD = 48;

async function tcmbUsdCek() {
  try {
    const yanit = await fetch('https://www.tcmb.gov.tr/kurlar/today.xml', { cache: 'no-store' });
    if (!yanit.ok) throw new Error('tcmb-' + yanit.status);
    const xml = await yanit.text();
    const usdBlok = xml.match(/Kod="USD"[\s\S]*?<ForexSelling>([\d.]+)<\/ForexSelling>/);
    const tarih = xml.match(/Tarih="([^"]+)"/);
    const usd = usdBlok ? parseFloat(usdBlok[1]) : null;
    if (!usd || !Number.isFinite(usd)) throw new Error('usd-parse');
    return { usd, tarih: tarih ? tarih[1] : null, kaynak: 'tcmb' };
  } catch {
    return { usd: VARSAYILAN_USD, tarih: null, kaynak: 'varsayilan' };
  }
}

export const usdKuru = unstable_cache(tcmbUsdCek, ['tcmb-usd'], { tags: ['kur'], revalidate: 86400 });
