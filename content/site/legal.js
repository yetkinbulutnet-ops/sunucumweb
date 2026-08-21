export const LEGAL_BELGELER = [
  {
    slug: 'kullanim-kosullari',
    baslik: 'Hizmet Kullanım Koşulları',
    kisa: 'Kullanım Koşulları',
    ozet: 'Genel şartlar, tarafların hak ve yükümlülükleri.',
    icon: 'doc',
    seo: 'SunucumWEB hizmet kullanım koşulları: tanımlar, hizmet şartları, ödeme, askıya alma ve sorumluluk sınırları.',
  },
  {
    slug: 'gizlilik-sozlesmesi',
    baslik: 'Gizlilik Sözleşmesi',
    kisa: 'Gizlilik',
    ozet: 'Kişisel verilerin toplanma, işlenme ve korunma esasları.',
    icon: 'lock',
    seo: 'SunucumWEB gizlilik sözleşmesi: toplanan bilgiler, kullanım amacı, çerezler ve veri güvenliği.',
  },
  {
    slug: 'iade-politikasi',
    baslik: 'İade Politikası',
    kisa: 'İade',
    ozet: 'Cayma hakkı, iade süreçleri ve garantinin kapsamı.',
    icon: 'refresh',
    seo: 'SunucumWEB iade ve iptal politikası: hosting ve sunucu hizmetlerinde cayma hakkı, iade koşulları ve süreçler.',
  },
];

export const belgeBul = (slug) => LEGAL_BELGELER.find((b) => b.slug === slug) || null;

export const LEGAL = {
  seo: {
    title: 'Legal',
    description:
      'SunucumWEB sözleşmeleri, yasal metinleri ve ticari bilgileri: hizmet kullanım koşulları, gizlilik sözleşmesi, iade politikası, şirket ünvanı, vergi ve yer sağlayıcı bilgileri.',
  },
  eyebrow: 'Kurumsal',
  title: 'Sözleşmeler ve yasal bilgiler',
  lede:
    'Hizmetlerimizi kullanırken geçerli olan sözleşmeler ile şirketimize ait resmî ticari bilgiler bu sayfada toplanmıştır.',

  ticari: {
    eyebrow: 'Ticari bilgiler',
    baslik: 'Resmî şirket bilgileri',
    ozet: 'Faturalandırma, sözleşme ve resmî yazışmalarda geçerli bilgilerimiz.',

    bilgiler: [
      ['Şirket ünvanı', 'SunucumWEB Bilişim Hizmetleri'],
      ['Ticari ünvan', 'Ortam Medya Bilişim Teknolojileri'],
      ['Vergi dairesi', 'Keçiborlu Vergi Dairesi'],
      ['Vergi numarası', '2220195996'],
      ['Adres', 'Hasanbey Mahallesi, Sokullu Sokak No: 16, Keçiborlu / Isparta'],
      ['Telefon', '0(850) 302 5809', 'tel:08503025809'],
      ['Yer sağlayıcı', 'SunucumWEB Internet Hizmetleri (Mustafa Çakır)'],
      ['Yetkilendirme', '5651 sayılı kanun kapsamında BTK tarafından yetkilendirilmiştir'],
    ],

    belgeler: [
      { etiket: 'Vergi Levhası (PDF)', href: '/vergi-levhasi.pdf', icon: 'doc' },
      { etiket: 'BTK yer sağlayıcı kaydı', href: 'https://internet.btk.gov.tr/yer-saglayici-listesi?page=1&q=SunucumWEB', icon: 'shield' },
    ],

    epostalar: [
      ['Genel', 'info@sunucumweb.com'],
      ['Satış', 'satis@sunucumweb.com'],
      ['Kötüye kullanım', 'abuse@sunucumweb.com'],
    ],

    hizmetler: ['Web Hosting', 'Sunucu Kiralama', 'Sunucu Barındırma', 'Alan Adı Hizmetleri'],
  },
};
