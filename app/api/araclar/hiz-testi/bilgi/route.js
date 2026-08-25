import { dohSorgu } from '@/lib/engines/tools/dns';
import { istemciIp } from '@/lib/guvenlik';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ULKE = {
  TR: 'Türkiye', US: 'ABD', DE: 'Almanya', NL: 'Hollanda', GB: 'Birleşik Krallık',
  FR: 'Fransa', RU: 'Rusya', IE: 'İrlanda', SG: 'Singapur', JP: 'Japonya',
  CA: 'Kanada', PL: 'Polonya', IT: 'İtalya', ES: 'İspanya', RO: 'Romanya',
  BG: 'Bulgaristan', UA: 'Ukrayna', AE: 'BAE', CN: 'Çin', IN: 'Hindistan',
  AZ: 'Azerbaycan', GE: 'Gürcistan', BE: 'Belçika', SE: 'İsveç', CH: 'İsviçre',
  AT: 'Avusturya', GR: 'Yunanistan', CY: 'Kıbrıs',
};

function saglayiciTemizle(ad) {
  if (!ad) return null;
  const temiz = ad.replace(/,\s*[A-Z]{2}\s*$/, '').replace(/\s+AS\d+\s*$/i, '').trim();
  const parcalar = [...new Set(temiz.split(/\s+-\s+/).map((p) => p.trim()).filter(Boolean))];
  return parcalar[parcalar.length - 1] || temiz || null;
}

export async function GET(req) {
  const ip = istemciIp((n) => req.headers.get(n));
  const asnNum = parseInt(req.headers.get('x-swb-asn') || '', 10);
  const ulkeKodu = (req.headers.get('cf-ipcountry') || '').toUpperCase().replace(/[^A-Z]/g, '');

  let saglayici = null;
  if (Number.isFinite(asnNum) && asnNum > 0) {
    try {
      const kayit = await dohSorgu(`AS${asnNum}.asn.cymru.com`, 'TXT');
      const parcalar = (kayit.kayitlar?.[0]?.deger || '').split('|').map((p) => p.trim());
      saglayici = saglayiciTemizle(parcalar[4]);
    } catch {}
  }

  return Response.json(
    {
      ip: ip || null,
      asn: Number.isFinite(asnNum) && asnNum > 0 ? `AS${asnNum}` : null,
      saglayici,
      ulkeKodu: ulkeKodu || null,
      ulke: (ulkeKodu && ULKE[ulkeKodu]) || ulkeKodu || null,
    },
    { headers: { 'cache-control': 'no-store' } },
  );
}
