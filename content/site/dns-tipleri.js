export const DNS_TIPLERI = [
  {
    tip: 'A',
    ad: 'A kaydı',
    kisa: 'IPv4 adresi',
    ozet: 'Alan adını bir IPv4 adresine bağlar.',
    ornek: '93.184.216.34',
    aciklama:
      'A kaydı, bir alan adının hangi sunucunun IPv4 adresine gideceğini söyler. Tarayıcıya adresi yazdığınızda ilk sorulan kayıt budur; değeri yanlışsa site açılmaz ya da eski sunucudan açılmaya devam eder. Bir alan adında birden fazla A kaydı bulunabilir, bu durumda istekler adresler arasında dağıtılır.',
    ipucu:
      'Sunucu taşırken A kaydının TTL değerini bir gün önceden 300 saniyeye düşürün; yeni adres birkaç dakikada yayılır.',
  },
  {
    tip: 'AAAA',
    ad: 'AAAA kaydı',
    kisa: 'IPv6 adresi',
    ozet: 'Alan adını bir IPv6 adresine bağlar.',
    ornek: '2606:2800:220:1:248:1893:25c8:1946',
    aciklama:
      'AAAA kaydı A kaydının IPv6 karşılığıdır. Mobil operatörlerin ve yeni erişim ağlarının önemli bir kısmı artık öncelikle IPv6 kullanıyor; kayıt tanımlıysa bu ziyaretçiler siteye doğrudan IPv6 üzerinden ulaşır. Kayıt yoksa bağlantı IPv4 üzerinden kurulur, yani AAAA olmaması siteyi erişilemez yapmaz.',
    ipucu:
      'AAAA kaydını yalnızca sunucunuz gerçekten IPv6 dinliyorsa tanımlayın; dinlemeyen bir adres ziyaretçide uzun bekleme süresine yol açar.',
  },
  {
    tip: 'CNAME',
    ad: 'CNAME kaydı',
    kisa: 'Takma ad',
    ozet: 'Bir alt alan adını başka bir alan adına yönlendirir.',
    ornek: 'magaza.ornek.com → shops.saglayici.com',
    aciklama:
      'CNAME kaydı bir adı başka bir adın takma adı yapar. Çözümleyici CNAME gördüğünde hedefteki adı yeniden sorgular ve asıl adresi oradan alır. CDN, e-ticaret altyapısı ve doğrulama servisleri genellikle bu yöntemle bağlanır; böylece sağlayıcı IP adresini değiştirdiğinde sizin bir şey yapmanız gerekmez.',
    ipucu:
      'Alan adının kökünde (ornek.com) CNAME kullanılamaz; kökte yalnızca A veya AAAA kaydı tanımlanır.',
  },
  {
    tip: 'MX',
    ad: 'MX kaydı',
    kisa: 'Posta sunucusu',
    ozet: 'Alan adına gelen e-postayı hangi sunucunun karşılayacağını belirtir.',
    ornek: '10 mail.ornek.com',
    aciklama:
      'MX kaydı, alan adınıza gönderilen e-postaların hangi sunucuya teslim edileceğini gösterir. Her kaydın bir öncelik sayısı vardır; gönderen sunucu önce en küçük sayılı adresi dener, ulaşamazsa sıradakine geçer. MX kaydı yoksa ya da yanlışsa alan adınıza hiç e-posta ulaşmaz.',
    ipucu:
      'MX kayıtları bir CNAME değil, doğrudan A kaydı olan bir sunucu adını göstermelidir; CNAME hedefi çoğu posta sunucusunda reddedilir.',
  },
  {
    tip: 'NS',
    ad: 'NS kaydı',
    kisa: 'İsim sunucusu',
    ozet: 'Alan adının DNS kayıtlarını hangi sunucuların yönettiğini gösterir.',
    ornek: 'ns1.sunucumweb.com',
    aciklama:
      'NS kayıtları, bir alan adının bölgesinden hangi isim sunucularının sorumlu olduğunu belirtir. Alan adını başka bir hosting firmasına taşırken değiştirilen ilk kayıt budur ve değişikliğin yayılması diğer kayıtlara göre daha uzun sürebilir. Uzantının kök sunucularındaki kayıtla panelinizdeki kaydın aynı olması gerekir.',
    ipucu:
      'İki isim sunucusundan azını tanımlamayın; tek sunucu kesintiye uğradığında alan adı tamamen çözümlenemez hâle gelir.',
  },
  {
    tip: 'TXT',
    ad: 'TXT kaydı',
    kisa: 'Metin kaydı',
    ozet: 'Serbest metin tutar; SPF, DKIM ve doğrulama kayıtları burada durur.',
    ornek: 'v=spf1 include:_spf.ornek.com -all',
    aciklama:
      'TXT kaydı alan adına serbest metin eklemenizi sağlar. Bugün en çok e-posta güvenliği için kullanılıyor: SPF gönderim yetkisini, DKIM imza anahtarını, DMARC ise doğrulamayı geçemeyen iletilere ne yapılacağını tanımlar. Google, Microsoft ve benzeri servislerin alan adı sahipliği doğrulamaları da TXT kaydıyla yapılır.',
    ipucu:
      'Bir alan adında yalnızca tek bir SPF kaydı bulunmalıdır; ikinci bir SPF eklendiğinde doğrulama tamamen geçersiz sayılır.',
  },
  {
    tip: 'SOA',
    ad: 'SOA kaydı',
    kisa: 'Bölge bilgisi',
    ozet: 'Bölgenin yetkili sunucusunu, seri numarasını ve yenileme sürelerini taşır.',
    ornek: 'ns1.ornek.com hostmaster.ornek.com 2026081801',
    aciklama:
      'SOA kaydı her bölgede tek olan yönetim kaydıdır. Birincil isim sunucusunu, yetkili e-posta adresini, bölgenin seri numarasını ve ikincil sunucuların ne sıklıkla senkronize olacağını tutar. Bir kayıt değiştirdiğinizde seri numarasının artması gerekir; artmıyorsa ikincil sunucular değişikliği fark etmez.',
    ipucu:
      'Sorun yaşadığınızda seri numarasını iki farklı isim sunucusunda karşılaştırın; farklıysa bölgeler arasında senkronizasyon sorunu var demektir.',
  },
  {
    tip: 'SRV',
    ad: 'SRV kaydı',
    kisa: 'Servis kaydı',
    ozet: 'Bir servisin hangi sunucuda ve hangi portta çalıştığını duyurur.',
    ornek: '_sip._tcp.ornek.com 10 5 5060 sip.ornek.com',
    aciklama:
      'SRV kaydı, adres bilgisine port ve öncelik de ekler. SIP telefon santralleri, XMPP mesajlaşma, Microsoft 365 otomatik yapılandırma ve bazı oyun sunucuları istemcinin doğru adrese bağlanması için bu kaydı okur. Ad biçimi servis ve protokol öneki içerir: `_servis._protokol.alanadi`.',
    ipucu:
      'Öncelik değeri küçük olan önce denenir; aynı öncelikteki kayıtlar arasında yük, ağırlık değerine göre paylaştırılır.',
  },
  {
    tip: 'CAA',
    ad: 'CAA kaydı',
    kisa: 'Sertifika yetkisi',
    ozet: 'Alan adına hangi sertifika sağlayıcılarının SSL verebileceğini belirler.',
    ornek: '0 issue "letsencrypt.org"',
    aciklama:
      'CAA kaydı, alan adınız için sertifika üretme yetkisini belirli sağlayıcılarla sınırlar. Sertifika makamları belge düzenlemeden önce bu kaydı kontrol etmek zorundadır; listede olmayan bir sağlayıcı talebi reddeder. Böylece izniniz dışında düzenlenmiş bir sertifikayla yapılabilecek saldırıların önü kapanır.',
    ipucu:
      'CAA tanımlarken kullandığınız tüm sağlayıcıları listeleyin; eksik bıraktığınız sağlayıcı yenileme sırasında sertifikayı üretemez.',
  },
  {
    tip: 'PTR',
    ad: 'PTR kaydı',
    kisa: 'Ters DNS',
    ozet: 'Bir IP adresinin hangi sunucu adına ait olduğunu gösterir.',
    ornek: '8.8.8.8 → dns.google',
    aciklama:
      'PTR kaydı A kaydının tersini yapar: adresten ada gider. Kayıt, alan adının bölgesinde değil IP bloğunun sahibi tarafından tanımlanır, yani sunucu sağlayıcınızdan istemeniz gerekir. Posta sunucularında en çok bakılan kayıtlardan biridir; PTR tanımı olmayan sunucudan gönderilen iletiler sıklıkla reddedilir veya spam sayılır.',
    ipucu:
      'Bu tipte alan adı yerine doğrudan IP adresi girin; sorgu otomatik olarak in-addr.arpa biçimine çevrilir.',
  },
];

export const dnsTipBul = (tip) =>
  DNS_TIPLERI.find((t) => t.tip === String(tip || '').toUpperCase()) || null;

export const DNS_TIP_KODLARI = DNS_TIPLERI.map((t) => t.tip);
