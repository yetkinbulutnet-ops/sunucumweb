# Devam notu — yeni sohbete başlarken oku

Bu dosya önceki oturumun sonunda yazıldı. Sırayla oku:
`DEVAM.md` (bu dosya) → `TASARIM-KURALLARI.md` → `lib/engines/README.md` → `TASIMA.md`.

Son commit: `b5d8605`. Çalışma ağacı temiz, her şey `main` dalında ve canlıda.

---

## 1. Nerede kaldık

| Bölüm | Durum |
|---|---|
| Ana sayfa, üst menü, mega menü, footer | Bitti |
| Şirket Profili (`/hakkimizda`) | Bitti — gerçek kabin fotoğraflarıyla deste slaytı |
| Legal (`/legal`) | Bitti — sözleşmeler + ticari bilgiler tek sayfa |
| İletişim (`/iletisim`) | Bitti — gerçek form, mesai rozeti, sosyal medya |
| Araçlar (`/araclar`) | 5 araç çalışıyor: DNS, WHOIS, SSL, e-posta, IP |
| Yumuşak kaydırma (Lenis) | Bitti — sadece ince imleç, dokunmatikte kapalı |
| Google yorum rozeti | Altyapı hazır, Places API anahtarı bekliyor |
| **Araçlar 2.0 (bu notun konusu)** | **YAPILACAK — sıradaki iş** |
| **Ürün sayfaları** | **YAPILMADI** — 12 sayfa hâlâ eski `ProductPage.jsx` şablonunda |
| **SEO uygulaması** | **YAPILMADI** — 5. altın kural yazıldı, uygulanmadı |

---

## 2. SIRADAKİ İŞ — Araçlar 2.0

Hedef: `/araclar` bölümünü rakip seviyesine çıkarmak. İki ayağı var —
(a) **DNS aracını kullanıcının kendi projesindeki kalıba geçirmek**,
(b) **rakiplerde olup bizde olmayan araçları eklemek**.

### 2.1 Referans proje: dnschecker.website (kullanıcının kendi ürünü)

Kaynak kodun kopyası: `../dnschecker-referans/` (git dışında, kasıtlı).
PHP, ~104 KB. Bakılacak dosyalar: `config.php`, `index.php`, `api.php`,
`inc/functions.php`, `lang/tr.json`.

**Kopyalanacak iki şey:**

1. **Kayıt tipi seçici** — `config.php:11`
   ```php
   $RECORD_TYPES = ['A','AAAA','MX','NS','TXT','CNAME','SOA','PTR','SRV','CAA'];
   ```
   Bizim DNS aracımız şu an 9 tipi **birden** sorguluyor (`lib/engines/tools/index.js`
   içindeki `DNS_TIPLERI`). Rakipler gibi **tip seçmeli** olacak: varsayılan `A`,
   yatay sekme/çip şeridi, ayrıca "Tümü" seçeneği (bugünkü davranış) kalsın.

2. **SEO URL şeması — asıl değerli kısım.** Referansta:
   ```
   /{dil}/{alan}/{tip}   →  /tr/google.com/mx
   ```
   Başlık `config.php:31` içinde üretiliyor:
   `google.com (MX) DNS Records — DNS Checker`. Yanlış biçimli istek (büyük harf
   tip, farklı yazım) `config.php:44-56`'da **301 ile normalize** ediliyor.
   Canonical her zaman küçük harfli tek biçim.

   **Bizdeki karşılığı:** `/araclar/dns/{alan}/{tip}`
   - `app/araclar/dns/[alan]/[tip]/page.jsx` — yeni route
   - `generateMetadata` ile dinamik title/description/canonical
     (`sunucumweb.com MX kayıtları — DNS sorgulama | SunucumWEB`)
   - Sayfa **sunucuda sorguyu çalıştırıp sonucu HTML'e basmalı** (SSR/ISR),
     yoksa arama motoru boş sayfa görür. `revalidate` 300-900 sn arası uygun.
   - Formdan sorgu yapılınca `router.push('/araclar/dns/'+alan+'/'+tip)` ile
     bu URL'e gidilsin — her sorgu paylaşılabilir/indekslenebilir adres üretsin.
   - Hatalı biçim (büyük harf, `www.`, sonda nokta) → `redirect()` ile 301.
   - `dynamicParams = true` gerekir; `generateStaticParams` ile sadece popüler
     alanlar (kendi alanlarımız + birkaç örnek) önceden basılsın.
   - **`app/sitemap.js`'e** bu şemadan üretilmiş bir örnek küme girsin
     (tüm kombinasyonlar değil — kendi alan adlarımız × 10 tip yeter).

3. **Tip başına açıklama metni** — referansta `index.php:106` + `lang/tr.json`
   içinde `rec_a_desc`, `rec_mx_desc` … Her tip için 2-3 cümle. Bizde
   `content/site/araclar.js`'e `DNS_TIP_ACIKLAMALARI` olarak girecek; tip
   sayfasının altında "MX kaydı nedir?" bloğu olarak basılacak. Bu metinler
   sayfanın indekslenmesini sağlayan asıl içerik, geçiştirme.

4. **Sorgu geçmişi** — referansta localStorage (`historyRead/historyWrite`).
   Bizde de: son 10 sorgu, çip olarak form altında, tek tıkla tekrar.

**Referanstan ALINMAYACAKLAR:** reCAPTCHA sorgu kapısı (bizde IP başına oran
sınırı var, yeterli), Discord webhook bildirimi, ip-api.com geo çağrısı,
`checks.json`/`stats.json` dosyasına log yazma, sahte ziyaretçi sayacı
(`$queryCount = $visitorCount * 3.5` — bunu kopyalama, uydurma sayı).

> ⚠️ `dnschecker-referans/api.php` içinde **canlı Discord webhook adresi ve
> reCAPTCHA gizli anahtarı düz metin** duruyor, `config.php`'de Umami ID var.
> Klasör kasıtlı olarak git dışında. Bu satırları SunucumWEB deposuna taşıma.
> Kullanıcıya o anahtarları yenilemesi söylendi.

### 2.2 Rakiplerden bakılıp eklenecek araçlar

Kullanıcı "tüm araçları rakiplerden bakıp geliştir" dedi. Bakılacak rakipler:
dnschecker.org, mxtoolbox.com, whatsmydns.net, ssllabs, securityheaders.com,
intodns.com, natro/turhost/isimtescil'in araç sayfaları (yerel rakip dili için).

Öncelik sırasıyla eklenecekler:

| Araç | Neden | Not |
|---|---|---|
| **Blacklist / RBL kontrolü** | mxtoolbox'ın en çok kullanılan aracı | MX IP'lerini ~20 DNSBL bölgesinde sorgula (Spamhaus zen, SpamCop, Barracuda…). Saf DNS sorgusu, API anahtarı gerekmez |
| **HTTP başlık + güvenlik denetimi** | securityheaders.com karşılığı | HSTS, CSP, X-Frame-Options, referrer-policy + yönlendirme zinciri + sunucu imzası. **`core/ag.js` süzgeci ZORUNLU** (SSRF) |
| **DNS yayılım haritası** | whatsmydns.net karşılığı | Şu an 4 çözümleyici var (`dns.js:COZUMLEYICILER`). Kıtalara yayılmış 12-20 genel çözümleyiciye çıkar, harita/liste göster |
| **DNS sağlık denetimi** | intodns.com karşılığı | NS tutarlılığı, glue kaydı, SOA değerleri, açık özyineleme, TTL makullüğü → puanlı rapor |
| **Ping / port durumu** | Hosting firması için doğal | Sadece yaygın portlar (80/443/21/22/25/3306), oran sınırlı, özel ağ engelli. Kötüye kullanım riski var, dikkatli |
| **Alan adı yaşı / otorite özeti** | Uzun kuyruk SEO | WHOIS tescil tarihinden yaş + mevcut verilerin özeti |

Her yeni araç: `lib/engines/tools/<ad>.js` motoru + `ARACLAR` kaydına giriş +
`content/site/araclar.js`'e sayfa metni. Motor mimarisi kuralları
`lib/engines/README.md`'de — motorlar birbirini import etmez, `core/` kullanır,
throw etmez, `{ok,data}`/`{ok,error}` döner.

### 2.3 Bu işin dosya haritası (bugünkü hâl)

```
app/araclar/page.jsx                 11 sat.  hub
app/araclar/[arac]/page.jsx          23 sat.  araç sayfası (statik param)
app/api/araclar/[arac]/route.js      37 sat.  POST, oran sınırı 20/dk
components/site/ToolsPage.jsx       105 sat.  hub + detay kabuğu
components/site/ToolRunner.jsx      526 sat.  form + 5 aracın sonuç görünümü
content/site/araclar.js              72 sat.  ARAC_LISTESI (5 kayıt)
lib/engines/tools/index.js          121 sat.  ARACLAR kayıt defteri
lib/engines/tools/{dns,whois,ssl,eposta,ip}.js
lib/engines/core/{ag,flags,http,ratelimit,rdap,result,text,whois43}.js
```

`ToolRunner.jsx` 526 satır ve 5 aracın görünümünü birlikte taşıyor. Araç sayısı
10'a çıkarken **araç başına görünüm bileşenine bölünmeli**, yoksa dosya
yönetilemez hâle gelir.

---

## 3. Ondan sonraki işler (sırayla)

1. **Ürün sayfaları** — 12 sayfa hâlâ eski `ProductPage.jsx` şablonunda,
   içerik `content/site/products.js`. Ana sayfa/hakkımızda/iletişim seviyesine
   çekilecek. Fiyatlar temsilî, kullanıcı gerçeğini verecek.
2. **SEO uygulaması** — `metadataBase`, `app/sitemap.js`, canonical'lar,
   JSON-LD (Organization / LocalBusiness / BreadcrumbList / Service / FAQPage),
   güvenlik başlıkları, `next/image` geçişi, font self-host.
   Referans dokümanlar: `Desktop\Altyapı Dokuman\NEXTJS\` altındaki 3 PDF.
3. `public/` temizliği (eski siteden kalan ~48 MB kullanılmayan varlık).

---

## 4. Kullanıcıdan gelmesi gerekenler

| Konu | Ne lazım |
|---|---|
| Google yorum rozeti | Places API (New) anahtarı + Place ID → `/etc/sunucumweb-demo.env` |
| İletişim formu | SMTP hesabı (Mailu aynı makinede) — şu an mesajlar sunucu günlüğüne yazılıyor, kalıcı değil |
| Sosyal medya | Gerçek hesap adresleri (Instagram `sunucumwebb`, diğerleri tahminî) |
| Fiyatlar, rakamlar | %99.9 / 10.000+ / <5dk ve tüm paket fiyatları temsilî |
| Groq anahtarı | Canlıya çıkmadan yenilenecek |
| dnschecker anahtarları | Discord webhook + reCAPTCHA gizli anahtarı yenilenecek |

### Kendi alan adımızda duran iki gerçek sorun
- **DMARC kaydı yok** → `_dmarc.sunucumweb.com TXT "v=DMARC1; p=none; rua=mailto:..."`
- **SPF `~all`** → katıya (`-all`) çekilmeli

---

## 5. Mimari hatırlatmalar ve tuzaklar

- Motorlar `lib/engines/` altında, **birbirini import etmez**; ortak şeyler
  `core/` içinde (`http`, `ratelimit`, `result`, `rdap`, `whois43`, `ag`, `flags`).
- `core/ag.js` özel ağ süzgeci: kullanıcıdan gelen **her** hedefte zorunlu.
  Yoksa araçlarımız iç ağ taramasında kullanılır.
- Sunucuda **IPv6 çıkışı yok** (`ENETUNREACH`). Giden bağlantılarda IPv4
  adresine bağlan (SSL aracında yapıldı), yoksa zaman aşımına düşer.
- Yeni Tailwind sınıfı eklediysen `npm run build:css` çalıştır — yoksa sınıf
  derlenmez. Birkaç kez bu tuzağa düştük.
- `npm run build`'i `npm run dev` açıkken **çalıştırma** — ikisi de `.next/`
  kullanır, dev server bozulur.
- Tarayıcı panelinde ekran görüntüsü yok; doğrulama DOM üzerinden
  (`mcp__Claude_Browser__javascript_tool`). Pane gizliyken `requestAnimationFrame`
  durur, lazy görseller yüklenmez — "çalışmıyor" sanma.
- Tema değişimini elle `classList.toggle('dark')` ile test etme; `tema-kilit`
  devreye girmediği için renkler donar. Gerçek düğmeyi kullan.
- Sabit renk (`bg-white`, `text-slate-600`, hex) yazma — semantik token kullan:
  `bg-page/surface/surface2`, `text-strong/body/muted`, `border-line`.
  `transition-all` da kullanma (Chromium'da tema değişince renk donuyor).

## 6. Çalıştırma ve yayınlama

```bash
cd "C:\Users\alike\Desktop\SunucumWEB Site\sunucumweb-next"
npm run dev
```

Yayın: `git push` → GitHub Actions imajı derler (~4 dk) → sunucuda
`sudo sunucumweb-guncelle`. Ayrıntı `TASIMA.md` içinde.
Demo: https://sunucumweb.demo.yetkin.web.tr (arama motorlarına kapalı).
