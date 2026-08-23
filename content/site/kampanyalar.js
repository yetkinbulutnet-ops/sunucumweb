export const KAMPANYA_META = {
  eyebrow: 'Fırsatlar',
  baslik: 'Kampanyalar',
  aciklama:
    'Hosting, sunucu ve alan adı hizmetlerinde güncel indirimler ve sınırlı süreli fırsatlar. Kampanya kodunu sipariş sırasında girmeniz yeterli.',
};

export const KAMPANYALAR = [
  {
    id: 'yil-sonu-hosting',
    kategori: 'Web Hosting',
    icon: 'globe',
    baslik: 'Yıl Sonu Hosting Fırsatı',
    aciklama:
      'Tüm Linux hosting paketlerinde ilk yıl %40 indirim. NVMe disk, ücretsiz SSL sertifikası ve günlük yedekleme dahil.',
    indirim: 40,
    eskiFiyat: 1200,
    yeniFiyat: 720,
    periyot: '/yıl',
    kupon: 'YILSONU40',
    bitis: '31 Aralık 2026',
    rozet: 'En Popüler',
    rTon: 'sari',
    vurgu: true,
    href: '/web-hosting',
    cta: 'Paketleri İncele',
  },
  {
    id: 'vds-ilk-yil',
    kategori: 'Sanal Sunucu',
    icon: 'vds',
    baslik: 'VDS İlk Yıl Kampanyası',
    aciklama:
      'E5-2699 v4 tabanlı sanal sunucularda ilk yıla özel %35 indirim. Saniyeler içinde kurulum, tam yetkili erişim.',
    indirim: 35,
    eskiFiyat: 3600,
    yeniFiyat: 2340,
    periyot: '/yıl',
    kupon: 'VDS35',
    bitis: '31 Ocak 2027',
    rozet: 'Yeni',
    rTon: 'mavi',
    href: '/sanal-sunucu',
    cta: 'Sunucuları Gör',
  },
  {
    id: 'com-alan-adi',
    kategori: 'Alan Adı',
    icon: 'tag',
    baslik: '.com Alan Adında İndirim',
    aciklama:
      'Yeni tescil edilen .com uzantılı alan adları ilk yıl indirimli. WHOIS gizliliği ve DNS yönetimi ücretsiz.',
    indirim: 25,
    eskiFiyat: 399,
    yeniFiyat: 299,
    periyot: '/yıl',
    kupon: null,
    bitis: '28 Şubat 2027',
    href: '/alan-adi',
    cta: 'Alan Adı Sorgula',
  },
];
