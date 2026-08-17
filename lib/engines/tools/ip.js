import { dohSorgu } from './dns';

const REGISTRY_ADI = {
  ripencc: 'RIPE NCC (Avrupa)',
  arin: 'ARIN (Kuzey Amerika)',
  apnic: 'APNIC (Asya-Pasifik)',
  lacnic: 'LACNIC (Latin Amerika)',
  afrinic: 'AFRINIC (Afrika)',
};

const ULKE_ADI = {
  TR: 'Türkiye', US: 'ABD', DE: 'Almanya', NL: 'Hollanda', GB: 'Birleşik Krallık',
  FR: 'Fransa', RU: 'Rusya', IE: 'İrlanda', SG: 'Singapur', JP: 'Japonya',
  CA: 'Kanada', PL: 'Polonya', IT: 'İtalya', ES: 'İspanya', RO: 'Romanya',
  BG: 'Bulgaristan', UA: 'Ukrayna', AE: 'BAE', CN: 'Çin', IN: 'Hindistan',
};

const tersAd = (ip) => `${ip.split('.').reverse().join('.')}.origin.asn.cymru.com`;

export async function ipBilgisi(adres) {
  const [ptr, kokenler] = await Promise.all([
    dohSorgu(`${adres.split('.').reverse().join('.')}.in-addr.arpa`, 'PTR'),
    dohSorgu(tersAd(adres), 'TXT'),
  ]);

  const kayit = kokenler.kayitlar[0]?.deger || '';
  const [asn, onEk, ulke, kayitci, tahsis] = kayit.split('|').map((p) => p.trim());

  let asAdi = null;
  if (asn) {
    const asKaydi = await dohSorgu(`AS${asn.split(' ')[0]}.asn.cymru.com`, 'TXT');
    const parcalar = (asKaydi.kayitlar[0]?.deger || '').split('|').map((p) => p.trim());
    asAdi = parcalar[4] || null;
  }

  return {
    adres,
    ptr: ptr.kayitlar.map((k) => k.deger.replace(/\.$/, '')),
    asn: asn ? `AS${asn.split(' ')[0]}` : null,
    asAdi,
    onEk: onEk || null,
    ulkeKodu: ulke || null,
    ulke: ulke ? ULKE_ADI[ulke] || ulke : null,
    kayitci: kayitci ? REGISTRY_ADI[kayitci] || kayitci : null,
    tahsisTarihi: tahsis || null,
  };
}
