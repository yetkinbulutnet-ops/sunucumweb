import { SITE_URL, SITE_ADI, mutlakUrl } from './seo';

const FIRMA_ID = `${SITE_URL}/#organization`;

const SOSYAL = [
  'https://facebook.com/sunucumweb',
  'https://x.com/sunucumweb',
  'https://instagram.com/sunucumweb',
  'https://linkedin.com/company/sunucumweb',
  'https://youtube.com/@sunucumweb',
];

export function firmaSemasi() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['Organization', 'LocalBusiness'],
        '@id': FIRMA_ID,
        name: SITE_ADI,
        legalName: 'SunucumWEB Bilişim Teknolojileri',
        url: SITE_URL,
        logo: mutlakUrl('/icon/logo.png'),
        image: mutlakUrl('/og.png'),
        email: 'destek@sunucumweb.com',
        telephone: '+90-850-302-5809',
        priceRange: '₺₺',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Hasanbey Mahallesi, Sokullu Sokak No: 16',
          addressLocality: 'Keçiborlu',
          addressRegion: 'Isparta',
          postalCode: '32700',
          addressCountry: 'TR',
        },
        areaServed: { '@type': 'Country', name: 'Türkiye' },
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+90-850-302-5809',
          contactType: 'customer support',
          areaServed: 'TR',
          availableLanguage: ['Turkish'],
        },
        sameAs: SOSYAL,
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
