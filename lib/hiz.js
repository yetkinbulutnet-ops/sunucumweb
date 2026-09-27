import { dohSorgu } from '@/lib/engines/tools/dns';
import { sm } from '@/lib/sistem-metin';

export const ULKE = () => ({
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
  AZ: sm('sistem.ulke_az'),
  GE: sm('sistem.ulke_ge'),
  BE: sm('sistem.ulke_be'),
  SE: sm('sistem.ulke_se'),
  CH: sm('sistem.ulke_ch'),
  AT: sm('sistem.ulke_at'),
  GR: sm('sistem.ulke_gr'),
  CY: sm('sistem.ulke_cy'),
});

export const ulkeAdi = (kod) => {
  const k = (kod || '').toUpperCase().replace(/[^A-Z]/g, '');
  return k ? ULKE()[k] || k : null;
};

export function saglayiciTemizle(ad) {
  if (!ad) return null;
  const temiz = ad.replace(/,\s*[A-Z]{2}\s*$/, '').replace(/\s+AS\d+\s*$/i, '').trim();
  const parcalar = [...new Set(temiz.split(/\s+-\s+/).map((p) => p.trim()).filter(Boolean))];
  return parcalar[parcalar.length - 1] || temiz || null;
}

export async function saglayiciAdi(asnNum) {
  if (!Number.isFinite(asnNum) || asnNum <= 0) return null;
  try {
    const kayit = await dohSorgu(`AS${asnNum}.asn.cymru.com`, 'TXT');
    const parcalar = (kayit.kayitlar?.[0]?.deger || '').split('|').map((p) => p.trim());
    return saglayiciTemizle(parcalar[4]);
  } catch {
    return null;
  }
}
