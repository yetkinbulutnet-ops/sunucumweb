export const ARAC_LISTESI = [
  {
    slug: 'dns',
    baslik: 'DNS Kayıt Sorgulama',
    kisa: 'DNS sorgulama',
    ozet: 'Kayıt tipini seçin; A, AAAA, CNAME, MX, NS, TXT, SOA, SRV, CAA ve PTR kayıtlarını dokuz çözümleyiciden canlı sorgulayın.',
    icon: 'server',
    girdiEtiketi: 'Alan adı',
    ornek: 'sunucumweb.com',
    aciklama:
      'DNS kayıtları, alan adınızın hangi sunucuya ve hangi posta servisine yönlendiğini belirler. Kayıt değişikliklerinin yayılması genellikle birkaç dakika ile birkaç saat arasında sürer; bu araç aynı sorguyu farklı bölgelerdeki dokuz genel çözümleyiciye göndererek değişikliğin nereye ulaştığını gösterir.',
    seo: 'DNS kayıt sorgulama aracı: alan adının A, MX, NS, TXT ve CAA kayıtlarını anında görüntüleyin.',
  },
  {
    slug: 'whois',
    baslik: 'WHOIS Sorgulama',
    kisa: 'WHOIS',
    ozet: 'Alan adının kayıt firması, kayıt ve bitiş tarihleri ile isim sunucularını gösterir.',
    icon: 'search',
    girdiEtiketi: 'Alan adı',
    ornek: 'sunucumweb.com',
    aciklama:
      'Sorgu, ilgili uzantının resmî RDAP sunucusundan yapılır. Kayıt sahibi bilgileri gizlilik hizmeti nedeniyle çoğu uzantıda maskelenir. .tr uzantıları RDAP desteklemediği için nic.tr üzerinden sorgulanmalıdır.',
    seo: 'WHOIS sorgulama: alan adının kayıt firması, tescil ve bitiş tarihi ile isim sunucularını öğrenin.',
  },
  {
    slug: 'ssl',
    baslik: 'SSL Sertifika Kontrolü',
    kisa: 'SSL kontrolü',
    ozet: 'Sertifikanın geçerliliğini, sağlayıcısını ve bitiş tarihine kalan gün sayısını kontrol eder.',
    icon: 'lock',
    girdiEtiketi: 'Alan adı',
    ornek: 'sunucumweb.com',
    aciklama:
      'Araç, alan adının 443 portuna bağlanıp sunucunun sunduğu sertifikayı okur. Süresi dolmuş ya da alan adıyla eşleşmeyen sertifikalar tarayıcıda güvenlik uyarısına yol açar; bitişe 30 günden az kaldıysa yenileme zamanı gelmiş demektir.',
    seo: 'SSL sertifika kontrolü: sertifikanın geçerliliğini, sağlayıcısını ve kalan gün sayısını sorgulayın.',
  },
  {
    slug: 'eposta',
    baslik: 'E-posta Kayıt Kontrolü',
    kisa: 'E-posta kayıtları',
    ozet: 'MX, SPF ve DMARC kayıtlarını kontrol eder; eksik ayarları uyarı olarak bildirir.',
    icon: 'mail',
    girdiEtiketi: 'Alan adı',
    ornek: 'sunucumweb.com',
    aciklama:
      'MX kaydı gelen postanın hangi sunucuya düşeceğini, SPF ve DMARC kayıtları ise sizin adınıza kimin posta gönderebileceğini belirler. SPF veya DMARC eksik olan alan adları adına sahte e-posta gönderilmesi kolaylaşır ve gönderdiğiniz iletiler spam klasörüne düşebilir.',
    seo: 'E-posta kayıt kontrolü: alan adının MX, SPF ve DMARC kayıtlarını denetleyin.',
  },
  {
    slug: 'karaliste',
    baslik: 'Kara Liste (RBL) Kontrolü',
    kisa: 'Kara liste',
    ozet: 'Alan adınızın ve posta sunucularınızın IP adreslerini 12 spam kara listesinde sorgular.',
    icon: 'ban',
    girdiEtiketi: 'Alan adı veya IP adresi',
    ornek: 'sunucumweb.com',
    aciklama:
      'Spam kara listeleri (RBL / DNSBL), spam gönderdiği tespit edilen IP adreslerini tutar. Posta sunucunuzun adresi bu listelerden birine düştüyse gönderdiğiniz iletiler karşı tarafa hiç ulaşmaz ya da doğrudan spam klasörüne düşer. Bu araç alan adınızın A kaydındaki ve MX sunucularınızdaki IP adreslerini on iki listede birden sorgular; listede görünen adres için listeleme sebebini de gösterir.',
    seo: 'Kara liste kontrolü: IP adresinizin spam kara listelerinde olup olmadığını ücretsiz sorgulayın.',
  },
  {
    slug: 'basliklar',
    baslik: 'HTTP Güvenlik Başlıkları',
    kisa: 'Güvenlik başlıkları',
    ozet: 'Sitenizin gönderdiği güvenlik başlıklarını denetler, yönlendirme zincirini ve çerez ayarlarını gösterir.',
    icon: 'shield',
    girdiEtiketi: 'Alan adı',
    ornek: 'sunucumweb.com',
    aciklama:
      'Web sunucunuzun yanıtla birlikte gönderdiği başlıklar, tarayıcının sitenizi nasıl koruyacağını belirler. HSTS bağlantıyı HTTPS ile sınırlar, Content-Security-Policy betik çalıştırma saldırılarının etkisini azaltır, çerçeveleme koruması sayfanızın başka bir sitenin içine gömülmesini engeller. Araç sitenizin yönlendirme zincirini izler, son yanıttaki başlıkları denetler ve eksikleri puanlayarak listeler.',
    seo: 'HTTP güvenlik başlığı denetimi: HSTS, CSP, X-Frame-Options ve çerez ayarlarınızı ücretsiz kontrol edin.',
  },
  {
    slug: 'ip',
    baslik: 'IP Sorgulama',
    kisa: 'IP sorgulama',
    ozet: 'Kendi IP adresinizi gösterir; girdiğiniz IP için ters DNS (PTR) kaydını sorgular.',
    icon: 'globe',
    girdiEtiketi: 'IP adresi',
    ornek: '8.8.8.8',
    girdiOpsiyonel: true,
    aciklama:
      'Alan boş bırakılırsa siteye bağlandığınız IP adresi gösterilir. Ters DNS kaydı, bir IP adresinin hangi sunucu adına ait olduğunu belirtir; posta sunucularında PTR kaydının doğru tanımlanmış olması teslim edilebilirlik için önemlidir.',
    seo: 'IP sorgulama: kendi IP adresinizi görün, herhangi bir IP için ters DNS kaydını öğrenin.',
  },
];

export const aracBul = (slug) => ARAC_LISTESI.find((a) => a.slug === slug) || null;

export const ARACLAR_SAYFA = {
  eyebrow: 'Araçlar',
  baslik: 'Ağ ve alan adı araçları',
  lede:
    'Alan adı, DNS, sertifika ve e-posta ayarlarınızı kontrol etmek için kullandığımız araçları müşterilerimizin ve ziyaretçilerin kullanımına açtık. Hepsi ücretsiz, üyelik gerektirmiyor.',
};
