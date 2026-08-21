export const MUSTERILER = [];

export const SEKTORLER = [
  { id: 'eticaret', ad: 'E-ticaret' },
  { id: 'kurumsal', ad: 'Kurumsal web' },
  { id: 'ajans', ad: 'Ajans ve yazılım' },
  { id: 'egitim', ad: 'Eğitim' },
  { id: 'saglik', ad: 'Sağlık' },
  { id: 'medya', ad: 'Medya ve yayıncılık' },
  { id: 'oyun', ad: 'Oyun ve topluluk' },
  { id: 'kamu', ad: 'Dernek ve kamu' },
];

export const REFERANSLAR = {
  seo: {
    title: 'Referanslarımız',
    description:
      'SunucumWEB altyapısını kullanan firmalar ve birlikte çalıştığımız teknoloji ortakları. E-ticaretten kurumsal web sitelerine kadar farklı sektörlerde barındırma hizmeti veriyoruz.',
  },
  eyebrow: 'Referanslar',
  title: 'Altyapımızda yayında olan işler',
  lede:
    'Küçük işletmelerin kurumsal sitelerinden yoğun trafikli e-ticaret projelerine kadar farklı ölçekte işi aynı altyapıda barındırıyoruz. Aşağıdaki markalar hizmetlerimizi kullanan müşterilerimizdir.',
  ledeListesiz:
    'Küçük işletmelerin kurumsal sitelerinden yoğun trafikli e-ticaret projelerine kadar farklı ölçekte işi aynı altyapıda barındırıyoruz. Hangi sektörlerde hizmet verdiğimizi ve sunucularımızda kullandığımız teknolojileri aşağıda bulabilirsiniz.',

  rakamlar: [
    ['10.000+', 'Aktif müşteri'],
    ['2023', 'Kuruluş yılı'],
    ['%99.9', 'Uptime garantisi'],
    ['7/24', 'Teknik destek'],
  ],

  seritBaslik: 'Bizi tercih eden markalar',

  izgara: {
    eyebrow: 'Müşterilerimiz',
    baslik: 'Referans listemiz',
    metin:
      'Logoya tıkladığınızda ilgili firmanın sitesi yeni sekmede açılır. Listede yer almak istemeyen müşterilerimizin markası burada gösterilmez.',
  },

  sektorBolumu: {
    eyebrow: 'Kapsam',
    baslik: 'Hizmet verdiğimiz sektörler',
    metin:
      'Barındırma ihtiyacı sektöre göre değişir: e-ticarette anlık yük, eğitimde dönemsel yoğunluk, sağlıkta veri sorumluluğu öne çıkar. Yapılandırmayı işin gereksinimine göre belirliyoruz.',
    items: [
      { t: 'E-ticaret', d: 'Kampanya dönemlerindeki ani yük artışına dayanacak kaynak planlaması, hızlı disk ve önbellek yapılandırması.' },
      { t: 'Kurumsal web', d: 'Kurumsal e-posta, SSL ve düzenli yedekle çalışan, bakım gerektirmeyen paylaşımlı ya da sanal sunucu kurulumları.' },
      { t: 'Ajans ve yazılım', d: 'Birden çok müşteri sitesini tek panelden yöneten ajanslar için bayi paketleri ve ayrı kaynak sınırları.' },
      { t: 'Eğitim', d: 'Kayıt ve sınav dönemlerinde yoğunlaşan trafiği karşılayan, dönemsel olarak yükseltilebilen paketler.' },
      { t: 'Sağlık', d: 'Randevu ve hasta iletişimi yürüten sistemler için Türkiye lokasyonunda barındırma ve erişim kaydı.' },
      { t: 'Medya ve yayıncılık', d: 'Yüksek görsel ve video trafiği için geniş bant, CDN uyumlu yapılandırma ve yük dengeli sunucular.' },
    ],
  },

  ortaklar: {
    eyebrow: 'Teknoloji',
    baslik: 'Birlikte çalıştığımız teknolojiler',
    metin:
      'Sunucularımızda kullandığımız lisanslı yazılımlar ve donanım platformları. Logoya tıklayarak üreticinin sitesine gidebilirsiniz.',
    items: [
      { ad: 'cPanel', logo: '/img/marka/cpanel.svg', site: 'https://cpanel.net', not: 'Barındırma kontrol paneli' },
      { ad: 'LiteSpeed', logo: '/img/marka/litespeed.svg', site: 'https://www.litespeedtech.com', not: 'Web sunucusu ve önbellek' },
      { ad: 'WordPress', logo: '/img/marka/wordpress.png', site: 'https://wordpress.org', not: 'İçerik yönetim sistemi' },
      { ad: 'Linux', logo: '/img/marka/linux.svg', site: 'https://www.kernel.org', not: 'Sunucu işletim sistemi' },
      { ad: 'NVIDIA', logo: '/img/marka/nvidia.svg', site: 'https://www.nvidia.com', not: 'GPU sunucu platformu' },
    ],
  },

  neden: {
    eyebrow: 'Neden kaldılar',
    baslik: 'Müşterilerimizin bizde kalma sebebi',
    items: [
      { t: 'Talebi teknik ekip yanıtlıyor', d: 'Destek talebiniz aracı bir katmandan geçmez; yanıtlayan kişi sunucuya müdahale yetkisine sahiptir.', ikon: 'headset' },
      { t: 'Fiyat yenilemede değişmiyor', d: 'Pakette belirtilen tutar yenileme döneminde de geçerlidir. Sonradan eklenen kurulum bedeli uygulanmaz.', ikon: 'scale' },
      { t: 'Taşımayı biz yapıyoruz', d: 'Mevcut sitenizi başka firmadan taşırken dosya, veritabanı ve e-posta aktarımı ücretsizdir.', ikon: 'refresh' },
      { t: 'Altyapı bizim işlettiğimiz', d: 'Yedekli güç ve ağ, DDoS koruması ve 7/24 izleme kendi ekibimizce yürütülür.', ikon: 'shield' },
    ],
  },

  cta: {
    baslik: 'Siz de bu listede yer alın',
    metin: 'Mevcut sitenizi ücretsiz taşıyalım, ihtiyacınıza uygun paketi birlikte belirleyelim.',
  },
};
