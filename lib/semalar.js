import { SITE_URL, SITE_ADI, mutlakUrl } from './seo';

const FIRMA_ID = `${SITE_URL}/#organization`;

export function firmaSemasi(ayar) {
  const f = ayar.firma;
  const tel = String(f.telefonHref || '').replace(/^tel:/, '').replace(/^0/, '+90');
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['Organization', 'LocalBusiness'],
        '@id': FIRMA_ID,
        name: SITE_ADI,
        legalName: f.unvan,
        url: SITE_URL,
        logo: mutlakUrl('/icon/logo.png'),
        image: mutlakUrl('/og.png'),
        email: f.eposta,
        telephone: tel,
        priceRange: '₺₺',
        address: {
          '@type': 'PostalAddress',
          streetAddress: f.adresSokak,
          addressLocality: f.adresIlce,
          addressRegion: f.adresIl,
          postalCode: f.postaKodu,
          addressCountry: 'TR',
        },
        areaServed: { '@type': 'Country', name: 'Türkiye' },
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: tel,
          contactType: 'customer support',
          areaServed: 'TR',
          availableLanguage: ['Turkish'],
        },
        sameAs: ayar.sosyal.map((s) => s.href),
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        name: SITE_ADI,
        url: SITE_URL,
        inLanguage: 'tr-TR',
        publisher: { '@id': FIRMA_ID },
      },
    ],
  };
}

export function ekmekKirintisi(parcalar) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: (parcalar || []).map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: p.ad,
      ...(p.yol ? { item: mutlakUrl(p.yol) } : {}),
    })),
  };
}

export function sssSemasi(sorular) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: (sorular || []).map((s) => ({
      '@type': 'Question',
      name: s.q,
      acceptedAnswer: { '@type': 'Answer', text: s.a },
    })),
  };
}

export function urunSemasi({ ad, aciklama, yol, gorsel, planlar }) {
  const temiz = (planlar || []).filter((p) => Number(p.fiyat) > 0);
  const fiyatlar = temiz.map((p) => Number(p.fiyat));
  const veri = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: ad,
    description: aciklama,
    url: mutlakUrl(yol),
    brand: { '@type': 'Brand', name: SITE_ADI },
  };
  if (gorsel) veri.image = mutlakUrl(gorsel);
  if (fiyatlar.length) {
    veri.offers = {
      '@type': 'AggregateOffer',
      priceCurrency: 'TRY',
      lowPrice: Math.min(...fiyatlar),
      highPrice: Math.max(...fiyatlar),
      offerCount: temiz.length,
      availability: 'https://schema.org/InStock',
      url: mutlakUrl(yol),
      offers: temiz.map((p) => ({
        '@type': 'Offer',
        name: p.name,
        price: Number(p.fiyat),
        priceCurrency: 'TRY',
        availability: 'https://schema.org/InStock',
        url: mutlakUrl(yol),
      })),
    };
  }
  return veri;
}
