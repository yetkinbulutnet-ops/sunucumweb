import { DNS_TIP_KODLARI } from '@/content/site/dns-tipleri';

const IPV4 = /^(\d{1,3}\.){3}\d{1,3}$/;

export const ipMi = (deger) => IPV4.test(deger) && deger.split('.').every((o) => Number(o) <= 255);

export function alanNormalle(ham) {
  let d = String(ham || '').trim().toLowerCase();
  try {
    d = decodeURIComponent(d);
  } catch {
    /* bozuk kodlama gelirse ham değerle devam edilir */
  }
  return d
    .replace(/^[a-z][a-z0-9+.-]*:\/\//, '')
    .replace(/^[^/@]*@/, '')
    .split(/[/?#]/)[0]
    .replace(/:\d+$/, '')
    .replace(/^www\./, '')
    .replace(/^\.+|\.+$/g, '')
    .replace(/[^a-z0-9.-]/g, '');
}

export function gecerliAlan(d) {
  return (
    d.length <= 253 &&
    /^(?=.{1,253}$)([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z][a-z0-9-]{0,61}[a-z0-9]$/.test(d)
  );
}

export function gecerliHedef(d, tip) {
  return tip === 'PTR' ? ipMi(d) || gecerliAlan(d) : gecerliAlan(d);
}

export const tipNormalle = (ham) => String(ham || '').toUpperCase().replace(/[^A-Z]/g, '');

export const gecerliTip = (tip) => DNS_TIP_KODLARI.includes(tip);

export const dnsYolu = (alan, tip) => `/araclar/dns/${alan}${tip ? `/${tip.toLowerCase()}` : ''}`;
