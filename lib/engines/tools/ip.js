import { dohSorgu } from './dns';
import { sm } from '../../sistem-metin';

const REGISTRY_ADI = () => ({
  ripencc: sm('sistem.ip_rir_ripencc'),
  arin: sm('sistem.ip_rir_arin'),
  apnic: sm('sistem.ip_rir_apnic'),
  lacnic: sm('sistem.ip_rir_lacnic'),
  afrinic: sm('sistem.ip_rir_afrinic'),
});

const ULKE_ADI = () => ({
  TR: sm('sistem.ulke_tr'),
  US: sm('sistem.ulke_us'),
  DE: sm('sistem.ulke_de'),
  NL: sm('sistem.ulke_nl'),
  GB: sm('sistem.ulke_gb'),
  FR: sm('sistem.ulke_fr'),
  RU: sm('sistem.ulke_ru'),
  IE: sm('sistem.ulke_ie'),
  SG: sm('sistem.ulke_sg'),
  JP: sm('sistem.ulke_jp'),
  CA: sm('sistem.ulke_ca'),
  PL: sm('sistem.ulke_pl'),
  IT: sm('sistem.ulke_it'),
  ES: sm('sistem.ulke_es'),
  RO: sm('sistem.ulke_ro'),
  BG: sm('sistem.ulke_bg'),
  UA: sm('sistem.ulke_ua'),
  AE: sm('sistem.ulke_ae'),
  CN: sm('sistem.ulke_cn'),
  IN: sm('sistem.ulke_in'),
});

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
    ulke: ulke ? ULKE_ADI()[ulke] || ulke : null,
    kayitci: kayitci ? REGISTRY_ADI()[kayitci] || kayitci : null,
    tahsisTarihi: tahsis || null,
  };
}
