# Devam notu — yeni sohbete başlarken oku

Bu dosya önceki oturumun sonunda yazıldı. Sırayla oku:
`DEVAM.md` (bu dosya) → `TASARIM-KURALLARI.md` → `lib/engines/README.md` → `TASIMA.md`.

Çalışma ağacı temiz, her şey `main` dalında.

---

## 1. Nerede kaldık

| Bölüm | Durum |
|---|---|
| Ana sayfa, üst menü, mega menü, footer | Bitti |
| Şirket Profili (`/hakkimizda`) | Bitti — gerçek kabin fotoğraflarıyla deste slaytı |
| Legal (`/legal`) | Bitti — sözleşmeler + ticari bilgiler tek sayfa |
| İletişim (`/iletisim`) | Bitti — gerçek form, mesai rozeti, sosyal medya |
| Yumuşak kaydırma (Lenis) | Bitti — sadece ince imleç, dokunmatikte kapalı |
| Google yorum rozeti | Altyapı hazır, Places API anahtarı bekliyor |
| **Araçlar 2.0** | **BİTTİ** — aşağıda ayrıntısı |
| **Ürün sayfaları** | **YAPILMADI** — 12 sayfa hâlâ eski `ProductPage.jsx` şablonunda |
| **SEO uygulaması** | Kısmen — `sitemap.js` ve DNS canonical'ları yazıldı, gerisi duruyor |

### Araçlar 2.0'da ne yapıldı (2026-08-18)

- **DNS kayıt tipi seçici**: A, AAAA, CNAME, MX, NS, TXT, SOA, SRV, CAA, PTR + "Tümü".
- **SEO URL şeması**: `/araclar/dns/{alan}` ve `/araclar/dns/{alan}/{tip}` — sonuç
  sunucuda basılıyor (SSR), her kombinasyonun kendi `<title>`, açıklama ve
  canonical'ı var; hatalı biçim (büyük harf, `www.`) 308 ile normalize ediliyor.
  PTR'de IP girilirse `in-addr.arpa` çevrimi yapılıyor.
- **Yayılım kontrolü 4 → 9 çözümleyici** (Cloudflare, Google, AdGuard, NextDNS,
  DNS.SB, Crypto.sx, Tiar, Alibaba, DNSPod). Sorgular **sayısal tip koduyla**
  gönderiliyor — iki çözümleyici alfabetik tip adını yok sayıp A kaydı döndürüyordu.
- **Tip başına açıklama içeriği**: `content/site/dns-tipleri.js` (açıklama + örnek
  değer + pratik ipucu), tip sayfasının altında basılıyor.
- **localStorage sorgu geçmişi** (son 8 sorgu, çip olarak).
- **Yeni araç: kara liste (RBL)** — `/araclar/karaliste`. Alan adının A kaydı ve MX
  sunucularının IP'leri 12 DNSBL bölgesinde sorgulanıyor, listeleme sebebi ve PTR
  gösteriliyor.
- **Yeni araç: HTTP güvenlik başlıkları** — `/araclar/basliklar`. Zincir `http://`
  ile başlatılıp izleniyor (her atlamada `core/ag.js` süzgeci), HSTS/CSP/nosniff/
  çerçeveleme/referrer/izin başlıkları puanlanıyor, çerez bayrakları ve sürüm
  ifşası kontrol ediliyor.
- **Önbellek**: DNS SEO sayfaları `unstable_cache` ile (alan, tip) anahtarında
  15 dakika önbellekli. Motor zaman aşımı için `AbortSignal` kullandığından Next'in
  fetch önbelleği devreye girmiyor — bu yüzden sonucun kendisi önbelleğe alınıyor.
  İlk istek ~1,4 sn, sonrakiler ~95 ms.

---

## 2. Araçlarda kalan iş

Rakip taraması: dnschecker.org, mxtoolbox.com, whatsmydns.net, securityheaders.com,
intodns.com + yerel rakipler (natro, turhost, isimtescil).

| Araç | Durum | Not |
|---|---|---|
| Kayıt tipi seçici + `/{alan}/{tip}` SEO şeması | **Bitti** | Referans: kullanıcının kendi `dnschecker.website` projesi |
| Kara liste / RBL | **Bitti** | 12 bölge; Spamhaus genel çözümleyicileri reddediyor, ayrıca işaretli |
| HTTP güvenlik başlıkları | **Bitti** | SSRF süzgeci her atlamada uygulanıyor |
| DNS yayılım (9 çözümleyici) | **Bitti** | Harita görselleştirmesi yok, liste hâlinde |
| **DNS sağlık denetimi** | Yapılmadı | intodns karşılığı: NS tutarlılığı, glue kaydı, SOA değerleri, TTL makullüğü → puanlı rapor |
| **Ping / port durumu** | Yapılmadı | Yalnız yaygın portlar, oran sınırlı, özel ağ engelli. Kötüye kullanım riski var |
| **Alan adı yaşı / otorite özeti** | Yapılmadı | WHOIS tescil tarihinden yaş + mevcut verilerin özeti |

Her yeni araç: `lib/engines/tools/<ad>.js` motoru + `ARACLAR` kayıt defterine giriş +
`content/site/araclar.js`'e sayfa metni. Motor kuralları `lib/engines/README.md`'de —
motorlar birbirini import etmez, `core/` kullanır, throw etmez, `{ok,data}`/`{ok,error}` döner.

### Referans proje notları (dnschecker.website)

Kaynak kopyası `../dnschecker-referans/` (git dışında). Alınanlar: kayıt tipi listesi
(`config.php:11`), `/{dil}/{alan}/{tip}` URL şeması ve 301 normalizasyonu
(`config.php:31,44-56`), tip açıklamaları (`lang/tr.json` → `rec_*_desc`),
localStorage sorgu geçmişi.

**Alınmayanlar:** reCAPTCHA sorgu kapısı (bizde IP başına oran sınırı var), Discord
webhook bildirimi, ip-api.com geo çağrısı, `checks.json`/`stats.json` log dosyası,
sahte ziyaretçi sayacı (`$queryCount = $visitorCount * 3.5`), dekoratif 18 noktalı
"dünya haritası" (aslında yalnız 2 çözümleyiciye soruyor).

> ⚠️ `dnschecker-referans/api.php` içinde **canlı Discord webhook adresi ve reCAPTCHA
> gizli anahtarı düz metin** duruyor, `config.php`'de Umami ID var. Bu satırlar
> SunucumWEB deposuna taşınmadı; kullanıcıya anahtarları yenilemesi söylendi.

### Araçlar bölümünün dosya haritası

```
app/araclar/page.jsx                        hub
app/araclar/[arac]/page.jsx                 statik araç sayfaları (dns hariç)
app/araclar/dns/page.jsx                    DNS aracı giriş sayfası
app/araclar/dns/[alan]/page.jsx             tüm kayıt tipleri, SSR
app/araclar/dns/[alan]/[tip]/page.jsx       tek tip, SSR
app/api/araclar/[arac]/route.js             POST, oran sınırı 20/dk
components/site/ToolsPage.jsx               hub + AracKabugu + DigerAraclar
components/site/DnsToolPage.jsx             DNS sayfa düzeni ve SEO metinleri
components/site/DnsRapor.jsx                DNS sonuç görünümü (sunucuda basılabilir)
components/site/tool-ui.jsx                 ortak Kutu/Satir/Rozet/Bos
components/site/ToolRunner.jsx              form + diğer araçların sonuç görünümü
content/site/araclar.js                     ARAC_LISTESI (7 kayıt)
content/site/dns-tipleri.js                 10 tipin açıklama içeriği
lib/dns-yol.js                              alan/tip normalleştirme, yol üretimi
lib/dns-onbellek.js                         unstable_cache sarmalayıcı
lib/engines/tools/{dns,whois,ssl,eposta,ip,blacklist,basliklar}.js
lib/engines/core/{ag,flags,http,ratelimit,rdap,result,text,whois43}.js
```

`ToolRunner.jsx` hâlâ büyük (6 aracın görünümü bir arada). Yeni araç eklerken
görünümleri `components/site/sonuc/<arac>.jsx` altına bölmek gerekecek.

---

## 3. Ondan sonraki işler (sırayla)

1. **Ürün sayfaları** — 12 sayfa hâlâ eski `ProductPage.jsx` şablonunda,
   içerik `content/site/products.js`. Ana sayfa/hakkımızda/iletişim seviyesine
   çekilecek. Fiyatlar temsilî, kullanıcı gerçeğini verecek.
2. **SEO uygulaması** — `app/sitemap.js` yazıldı (`lib/seo.js` içinde `SITE_URL`,
   `mutlakUrl`, `kanonik` yardımcıları var, DNS sayfaları canonical veriyor).
   Kalanlar: `metadataBase`, diğer sayfaların canonical'ları,
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

## 4.5 Akıllı ölçekleme geçişi (yarım kaldı)

`app/globals.css` içinde akışkan ölçek sınıfları tanımlı: `tipo-dev` (h1),
`tipo-bolum` (h2), `tipo-giris` (giriş metni), `tipo-metin`. Hepsi `clamp()`
ile ekran genişliğine göre büyüyüp küçülüyor. Ayrıca 1800 px üstü ekranlarda
`.max-w-7xl` 92rem'e açılıyor, içerik 1280 pikselde takılı kalmıyor.

**Geçiş yapılan sayfalar:** legal, hakkımızda, veri merkezi bölümü.
**Geçmesi gerekenler:** ana sayfa, ürün sayfaları, araçlar, iletişim, alan adı.
Oralarda hâlâ `text-3xl sm:text-4xl` gibi sıçramalı ölçek var.

---

## 5. Mimari hatırlatmalar ve tuzaklar

- Motorlar `lib/engines/` altında, **birbirini import etmez**; ortak şeyler
  `core/` içinde (`http`, `ratelimit`, `result`, `rdap`, `whois43`, `ag`, `flags`).
- **DoH sorgularında tip adını değil sayısal kodu gönder** (`TIPLER` haritası).
  Crypto.sx ve Tiar gibi çözümleyiciler `type=MX` yazısını yok sayıp sessizce
  A kaydı döndürüyor; "kayıt yok" sanılıyordu.
- **`fetchWithTimeout` `AbortSignal` kullanıyor, bu yüzden Next o fetch'i
  önbelleğe almaz.** Sunucuda basılan sayfalarda sonucu `unstable_cache` ile
  sarmalayın (`lib/dns-onbellek.js` örnek), yoksa her istek dış sorgu tetikler.
- **Giden bağlantı `ETIMEDOUT` veriyorsa önce ham TCP'yi dene** (`net.connect`).
  Port açıksa sebep Node 20'nin Happy Eyeballs'ıdır: her adres için yalnız 250 ms
  bekler, yavaş sunucularda hepsi düşer. `core/http.js` bunu
  `setDefaultAutoSelectFamilyAttemptTimeout(2500)` ile açıyor. Uzun süre bunu
  "sunucuda IPv6 yok" sandık, IPv6'yla ilgisi yoktu.
- Kara liste sorgularında `127.255.255.25x` yanıtları **listeleme değil hata
  kodudur** (genel çözümleyiciden sorgu reddi). Spamhaus bu yüzden hep bu kodu
  döndürür; "listede" saymayın.
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
- **Yatay taşma sıfır tolerans** (kullanıcının koyduğu kural). Izgara sütununu
  `minmax(0,1fr)`, çocuğu `min-w-0` yap; kapsayıcı dolgusundan büyük negatif
  kenar boşluğu (`-mx-5` + `px-5` iç içe ızgarada) hücreyi şişirip sayfayı
  kaydırır. Denetim yöntemi: gizli bir `<iframe>` içinde sayfayı farklı
  genişliklerde açıp `documentElement.scrollWidth` karşılaştır — tek çağrıda
  onlarca kombinasyon test edilir.
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
