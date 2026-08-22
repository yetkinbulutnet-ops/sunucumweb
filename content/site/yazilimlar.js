export const YAZILIM_KATEGORILERI = [
  { slug: 'e-ticaret', ad: 'E-Ticaret', icon: 'cart' },
  { slug: 'kurumsal', ad: 'Kurumsal Tanıtım', icon: 'binaOfis' },
  { slug: 'blog-haber', ad: 'Blog & Haber', icon: 'doc' },
  { slug: 'ilan-emlak', ad: 'İlan & Emlak', icon: 'pin' },
  { slug: 'rezervasyon', ad: 'Rezervasyon & Randevu', icon: 'clock' },
  { slug: 'egitim', ad: 'Eğitim & Okul', icon: 'users' },
  { slug: 'restoran', ad: 'Restoran & Kafe', icon: 'sparkles' },
  { slug: 'portfolyo', ad: 'Portfolyo & Kişisel', icon: 'star' },
];

export const YAZILIMLAR = [
  { id: 'ticaretpro', ad: 'TicaretPro E-Ticaret', kategori: 'e-ticaret', fiyat: 12900, oneCikan: true, aciklama: 'Ürün yönetimi, sepet, sanal POS ve kargo entegrasyonuyla tam kapsamlı online mağaza.', etiketler: ['Sanal POS', 'Kargo Entegrasyonu', 'Çok Dilli'] },
  { id: 'magaza-lite', ad: 'Mağaza Lite', kategori: 'e-ticaret', fiyat: 6900, aciklama: 'Küçük işletmeler için dakikalar içinde kurulan, sade ve hızlı satış sitesi.', etiketler: ['Responsive', 'SEO Uyumlu'] },
  { id: 'pazaryeri', ad: 'PazarYeri Multi-Vendor', kategori: 'e-ticaret', fiyat: 24900, oneCikan: true, aciklama: 'Birden çok satıcının ürün sattığı, komisyon yönetimli pazar yeri altyapısı.', etiketler: ['Çoklu Satıcı', 'Komisyon', 'Cüzdan'] },
  { id: 'abone-kutusu', ad: 'AboneKutusu', kategori: 'e-ticaret', fiyat: 14500, aciklama: 'Abonelik bazlı satış ve tekrarlayan ödemeleri otomatik yöneten sistem.', etiketler: ['Abonelik', 'Otomatik Tahsilat'] },

  { id: 'kurumsal-tanitim', ad: 'Kurumsal Tanıtım Sitesi', kategori: 'kurumsal', fiyat: 5900, oneCikan: true, aciklama: 'Şirketiniz için modern, çok sayfalı, blog ve iletişim formu içeren kurumsal site.', etiketler: ['Çok Dilli', 'Blog', 'SEO Uyumlu'] },
  { id: 'ajans-portfolyo', ad: 'Ajans Vitrini', kategori: 'kurumsal', fiyat: 4500, aciklama: 'Ajans ve stüdyolar için proje galerili, etkileyici tanıtım sitesi.', etiketler: ['Galeri', 'Animasyon'] },
  { id: 'sanayi-katalog', ad: 'Fabrika & Sanayi', kategori: 'kurumsal', fiyat: 7500, aciklama: 'Üretim firmaları için ürün kataloğu ve teklif formu içeren kurumsal site.', etiketler: ['Ürün Kataloğu', 'Teklif Formu'] },

  { id: 'haber-portali', ad: 'Haber Portalı', kategori: 'blog-haber', fiyat: 9900, oneCikan: true, aciklama: 'Kategori, yazar ve reklam alanlarıyla tam donanımlı haber ve içerik sitesi.', etiketler: ['Reklam Alanı', 'Kategori', 'Yazar Paneli'] },
  { id: 'kisisel-blog', ad: 'Kişisel Blog', kategori: 'blog-haber', fiyat: 2900, aciklama: 'Yazarlar için sade, hızlı ve arama motoru dostu blog altyapısı.', etiketler: ['SEO Uyumlu', 'Bülten'] },
  { id: 'dergi-pro', ad: 'Dergi Pro', kategori: 'blog-haber', fiyat: 8500, aciklama: 'Dijital dergi ve içerik yayıncılığı için abonelikli okuma platformu.', etiketler: ['Abonelik', 'Sayı Arşivi'] },

  { id: 'emlak-vitrin', ad: 'Emlak Vitrini', kategori: 'ilan-emlak', fiyat: 11900, oneCikan: true, aciklama: 'İlan yönetimi, harita ve danışman profilleriyle profesyonel emlak sitesi.', etiketler: ['Harita', 'İlan Paneli'] },
  { id: 'ilan-platform', ad: 'İkinci El İlan', kategori: 'ilan-emlak', fiyat: 9500, aciklama: 'Kullanıcıların ilan verebildiği, üyelik ve öne çıkarma destekli ilan platformu.', etiketler: ['Üyelik', 'Öne Çıkarma'] },
  { id: 'arac-galeri', ad: 'Araç Galeri', kategori: 'ilan-emlak', fiyat: 8900, aciklama: 'Oto galeriler için stok takibi ve gelişmiş filtreli ilan sitesi.', etiketler: ['Stok Takibi', 'Filtre'] },

  { id: 'randevu-plus', ad: 'Randevu Plus', kategori: 'rezervasyon', fiyat: 6500, oneCikan: true, aciklama: 'Klinik, kuaför ve danışmanlar için takvimli online randevu sistemi.', etiketler: ['Takvim', 'SMS Hatırlatma'] },
  { id: 'otel-rezervasyon', ad: 'Otel Rezervasyon', kategori: 'rezervasyon', fiyat: 15900, aciklama: 'Oda müsaitliği, dönemsel fiyatlandırma ve online ödeme destekli sistem.', etiketler: ['Takvim', 'Online Ödeme'] },
  { id: 'etkinlik-bileti', ad: 'Etkinlik Bileti', kategori: 'rezervasyon', fiyat: 10500, aciklama: 'Etkinlikler için bilet satışı ve karekodlu kapı girişi yönetimi.', etiketler: ['Karekod', 'Online Ödeme'] },

  { id: 'okul-yonetim', ad: 'Okul Yönetim Portalı', kategori: 'egitim', fiyat: 13900, oneCikan: true, aciklama: 'Öğrenci, veli ve duyuru yönetimini tek panelde toplayan okul portalı.', etiketler: ['Veli Paneli', 'Duyuru'] },
  { id: 'online-kurs', ad: 'Online Kurs (LMS)', kategori: 'egitim', fiyat: 16500, aciklama: 'Video ders, sınav ve sertifikalı öğrenme yönetim sistemi.', etiketler: ['Video Ders', 'Sınav', 'Sertifika'] },
  { id: 'anaokulu', ad: 'Anaokulu Sitesi', kategori: 'egitim', fiyat: 4900, aciklama: 'Kreş ve anaokulları için renkli, galerili tanıtım ve kayıt sitesi.', etiketler: ['Galeri', 'Kayıt Formu'] },

  { id: 'qr-menu', ad: 'Dijital QR Menü', kategori: 'restoran', fiyat: 3500, oneCikan: true, aciklama: 'Karekod ile açılan, güncellemesi kolay dijital menü ve sipariş çözümü.', etiketler: ['Karekod', 'Çok Dilli'] },
  { id: 'restoran-siparis', ad: 'Restoran Sipariş', kategori: 'restoran', fiyat: 9900, aciklama: 'Online sipariş, masa ve kurye yönetimi içeren restoran sitesi.', etiketler: ['Online Sipariş', 'Kurye'] },

  { id: 'portfolyo-tek', ad: 'Tek Sayfa Portfolyo', kategori: 'portfolyo', fiyat: 1900, aciklama: 'Freelancer ve tasarımcılar için şık, hızlı tek sayfa portfolyo.', etiketler: ['Tek Sayfa', 'Animasyon'] },
  { id: 'dijital-cv', ad: 'Dijital Özgeçmiş', kategori: 'portfolyo', fiyat: 1500, aciklama: 'Kişisel dijital özgeçmiş, yetenek ve iletişim sayfası.', etiketler: ['Responsive', 'PDF Çıktı'] },
  { id: 'dugun-davetiye', ad: 'Dijital Düğün Davetiyesi', kategori: 'portfolyo', fiyat: 2500, aciklama: 'Çiftler için katılım (RSVP) ve konum bilgili dijital davetiye.', etiketler: ['RSVP', 'Konum'] },
];

export const YAZILIM_SERIDI = {
  eyebrow: 'Hazır Yazılımlar',
  baslik: 'Kuruluma hazır web yazılımları',
  metin: 'İşinizi hızla internete taşıyın. E-ticaretten kurumsal siteye, rezervasyondan eğitim platformuna kadar test edilmiş, kurulumu bize ait paketler. Hepsi mobil uyumlu, SEO dostu ve SunucumWEB altyapısında yayında.',
};
