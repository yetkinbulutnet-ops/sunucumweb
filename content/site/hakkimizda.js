export const HAKKIMIZDA = {
  seo: {
    title: 'Şirket Profili',
    description:
      'SunucumWEB 2023 yılında kuruldu; Keçiborlu / Isparta merkezli, BTK kayıtlı yer sağlayıcıdır. Web hosting, sanal sunucu ve sunucu barındırma hizmetleri.',
  },
  title: 'Şirket Profili',
  lede:
    'SunucumWEB, 2023 yılından bu yana web hosting, sanal sunucu ve sunucu barındırma hizmeti sunmaktadır. ' +
    'Keçiborlu / Isparta’daki merkezimizden Türkiye genelindeki işletmelere altyapı hizmeti veriyoruz.',

  kisayollar: [
    { metin: 'Çalışma ilkelerimiz', href: '#ilkeler', ikon: 'scale' },
    { metin: 'Veri merkezimiz', href: '#veri-merkezi', ikon: 'database' },
  ],

  rakamlar: [
    ['%99.9', 'Uptime garantisi'],
    ['10.000+', 'Aktif müşteri'],
    ['<5 dk', 'Ortalama ilk yanıt'],
    ['7/24', 'Teknik destek'],
  ],

  hikaye: {
    paragraflar: [
      'Şirket, barındırma sektöründeki iki eksikliği gidermek üzere kuruldu: fiyatlandırmanın şeffaf olmaması ve teknik ekibe doğrudan ulaşılamaması. Kendi projelerimizde karşılaştığımız bu sorunlar, hizmet modelimizin çıkış noktası oldu.',
      'Bugün bireysel kullanıcılardan kurumsal firmalara uzanan bir müşteri portföyüne hizmet veriyoruz. Sunucuları kuran ekip ile destek taleplerini karşılayan ekip aynıdır; talebiniz aracı bir katmandan geçmez.',
    ],
    fotograflar: [
      { src: '/img/galeri/kabin-yogun.webp', alt: 'Etiketlenmiş sunucuların yerleştiği kabin', g: 382, y: 510 },
      { src: '/img/galeri/ekip-kabin.webp', alt: 'Teknisyenimiz kabin arkasında kablolama yaparken', g: 382, y: 510 },
      { src: '/img/galeri/kabin-dellemc.webp', alt: 'Dell EMC sunucuların bulunduğu kabinin ön yüzü', g: 382, y: 510 },
      { src: '/img/galeri/kabin-anahtar.webp', alt: 'Ağ anahtarı ve blade sunucuların bulunduğu kabin', g: 287, y: 510 },
      { src: '/img/galeri/kabin-gpu.webp', alt: 'GPU sunucunun yerleştirildiği kabin bölümü', g: 287, y: 510 },
      { src: '/img/galeri/kabin-acik.webp', alt: 'Kapağı açık kabinde çalışan sunucular', g: 287, y: 510 },
    ],
  },

  veriMerkezi: {
    eyebrow: 'Altyapı',
    baslik: 'Veri merkezimiz',
    metin:
      'Sunucularımız İstanbul’daki Netweb veri merkezinde barınıyor. Operatör bağımsız bir tesis olduğu için trafiğimiz tek bir servis sağlayıcıya bağlı değil; bir hatta sorun çıktığında bağlantı diğer taşıyıcılar üzerinden devam eder. Türkiye’deki ziyaretçileriniz için gecikme süresi yurt dışı barındırmaya göre belirgin biçimde düşüktür.',
    konum: {
      sehir: 'İstanbul',
      ulke: 'Türkiye',
      etiket: 'İstanbul',
      enlem: 41.0082,
      boylam: 28.9784,
      koordinat: '41.0082° K · 28.9784° D',
    },
    tesis: {
      ad: 'Netweb',
      site: 'https://www.netweb.com.tr',
      not: 'Operatör bağımsız veri merkezi',
    },
    kart: {
      eyebrow: 'Konumdasınız',
      baslik: 'Netweb · İstanbul',
      metin: 'Kabinlerimizden görüntüler:',
      video: {
        kutuphane: '734078',
        acik: 'e68489b9-9b61-4d3f-8985-11b3489b7227',
        koyu: 'b42057cf-5755-481c-945b-a9c3bc95207b',
        baslik: 'SunucumWEB veri merkezi kabinleri',
      },
    },
    ozellikler: [
      'EN 50600 standardında tesis altyapısı',
      'Yedekli güç ve iklimlendirme',
      '1:1 simetrik internet bağlantısı',
      'Şebeke seviyesinde DDoS koruması',
      'Kabin ve colocation imkânı',
      '7/24 fiziksel güvenlik ve izleme',
    ],
  },

  ilkeler: {
    eyebrow: 'Çalışma biçimimiz',
    baslik: 'Hizmet ilkelerimiz',
    items: [
      { t: 'Şeffaf fiyatlandırma', d: 'Pakette belirtilen tutar geçerlidir. Yenileme döneminde beklenmedik artış ya da sonradan eklenen kurulum bedeli uygulanmaz.' },
      { t: 'Doğrudan teknik iletişim', d: 'Talebinizi yanıtlayan kişi sunucuya müdahale yetkisine sahiptir. Ortalama ilk yanıt süremiz 5 dakikadır.' },
      { t: 'Kendi işlettiğimiz altyapı', d: 'Yedekli güç ve ağ, DDoS koruması ile 7/24 izleme kendi ekibimiz tarafından yürütülür.' },
      { t: 'Veri konumunda netlik', d: 'Sunucularımız Türkiye’de bulunur. Talep eden müşterilerimize ayrıca ABD lokasyonu sunulur.' },
    ],
  },

  cta: {
    baslik: 'İhtiyacınıza uygun yapılandırmayı birlikte belirleyelim',
    metin: 'Hangi paketin işinize uygun olduğundan emin değilseniz teknik ekibimizle görüşün.',
  },
};
