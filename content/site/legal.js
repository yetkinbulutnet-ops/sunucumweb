export const LEGAL = {
  seo: {
    title: 'Legal',
    description:
      'SunucumWEB sözleşmeleri, yasal metinleri ve ticari bilgileri: hizmet kullanım koşulları, gizlilik sözleşmesi, iade politikası, şirket ünvanı, vergi ve yer sağlayıcı bilgileri.',
  },
  eyebrow: 'Kurumsal',
  title: 'Legal',
  lede:
    'Hizmetlerimizi kullanırken geçerli olan sözleşmeler ile şirketimize ait resmî ticari bilgiler bu sayfada toplanmıştır.',

  sozlesmeler: {
    eyebrow: 'Sözleşmeler',
    baslik: 'Sözleşmeler ve yasal metinler',
    items: [
      {
        slug: 'kullanim-kosullari',
        baslik: 'Hizmet Kullanım Koşulları',
        ozet: 'Hizmetlerimizi kullanırken geçerli olan genel şartlar, tarafların hak ve yükümlülükleri.',
        icon: 'doc',
      },
      {
        slug: 'gizlilik-sozlesmesi',
        baslik: 'Gizlilik Sözleşmesi',
        ozet: 'Kişisel verilerin toplanma, işlenme ve korunma esasları.',
        icon: 'lock',
      },
      {
        slug: 'iade-politikasi',
        baslik: 'İade Politikası',
        ozet: 'Cayma hakkı, iade süreçleri ve iade garantisinin kapsamı.',
        icon: 'refresh',
      },
      {
        slug: 'kullanim-politikasi',
        baslik: 'Kabul Edilebilir Kullanım Politikası',
        ozet: 'Sunucularda yasaklı içerik ve kaynak kullanımına ilişkin kurallar.',
        icon: 'shield',
      },
    ],
  },

  ticari: {
    eyebrow: 'Ticari bilgiler',
    baslik: 'Resmî şirket bilgileri',
    ozet: 'Faturalandırma, sözleşme ve resmî yazışmalarda geçerli bilgilerimiz.',
    sutunlar: [
      {
        baslik: 'Şirket',
        satirlar: [
          ['Şirket ünvanı', 'SunucumWEB Bilişim Hizmetleri'],
          ['Ticari ünvan', 'Ortam Medya Bilişim Teknolojileri'],
          ['Telefon', '0(850) 302 5809', 'tel:08503025809'],
        ],
      },
      {
        baslik: 'Vergi ve adres',
        satirlar: [
          ['Vergi dairesi', 'Keçiborlu Vergi Dairesi'],
          ['Vergi numarası', '2220195996'],
          ['Şirket adresi', 'Hasanbey Mahallesi, Sokullu Sokak No: 16, Keçiborlu / Isparta'],
        ],
        belge: { etiket: 'Vergi Levhası (PDF)', href: '/vergi-levhasi.pdf', icon: 'doc' },
      },
      {
        baslik: 'Yer sağlayıcı',
        satirlar: [
          ['Yer sağlayıcı', 'SunucumWEB Internet Hizmetleri (Mustafa Çakır)'],
          ['Yetkilendirme', '5651 sayılı kanun kapsamında BTK tarafından yetkilendirilmiştir.'],
        ],
        belge: {
          etiket: 'BTK kaydını görüntüle',
          href: 'https://internet.btk.gov.tr/yer-saglayici-listesi?page=1&q=SunucumWEB',
          icon: 'shield',
        },
      },
    ],
    epostalar: [
      ['Genel', 'info@sunucumweb.com'],
      ['Satış', 'satis@sunucumweb.com'],
      ['Kötüye kullanım', 'abuse@sunucumweb.com'],
    ],
    hizmetler: ['Web Hosting', 'Sunucu Kiralama', 'Sunucu Barındırma', 'Alan Adı Hizmetleri'],
  },
};
