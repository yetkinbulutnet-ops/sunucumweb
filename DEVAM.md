# Devam notu — yeni sohbete başlarken oku

Sırayla oku: `DEVAM.md` (bu dosya) → `TASARIM-KURALLARI.md` → `lib/engines/README.md` → `TASIMA.md`.

Son güncelleme: 2026-08-25. **Canlı: https://sunucumweb.com (`.17`). ⚠️ ARTIK SADECE 2 ortam: local + `.17` — cPanel/Docker demoları BIRAKILDI (golden rule). Deploy yalnızca `.17`, kaynak-sız.**

**Son iş (2026-08-25) — Hız Testi tasarımı: kullanıcı görsel seçeneklerden A'yı seçti (`.17`):** Kullanıcı gauge'ı
defalarca beğenmedi ("bok gibi", "yazılar üst üste", "kötü duruyor"). Tahmin etmeyi bırakıp `mcp visualize show_widget`
ile **3 sade tasarım** (A kadran / B büyük-rakam / C çubuklar) görsel sunuldu; kullanıcı **A (sade yarım-daire kadran)**
seçti. `HizTesti.jsx` gauge artık **tek 180° yay + kocaman merkez rakam (SVG → ölçekli, çakışma yok)**; tik/ibre/disk/
merkez-buton YOK; **Başla butonu yayın altında**. Helper `yariYol(kesir)` semicircle path + `hizKesir()` non-linear
0–1 fraksiyon. Ölçüm/paylaşım/doğruluk DEĞİŞMEDİ. Doğrulandı (CF): 200, `?v=hash` CSS. **DERS: aynı bileşeni 4x
tahminle yapmaktansa görsel seçenek sun, kullanıcı seçsin.**

**Son iş (2026-08-25) — Hız Testi: sonuç paylaşımı (24s TTL) + ölçüm doğruluğu (`.17`):** Kullanıcı istedi:
paylaşa basınca o sonuca özel link oto-kopyalansın, 24 saat geçici saklansın (oto-sil), doğruluk max olsun.
**Paylaşım:** yeni `app/api/araclar/hiz-testi/sonuc` — POST sonucu `.hiz-sonuc/<id>.json`'a yazar (24s TTL, her
POST'ta lazy temizlik, **IP SAKLANMAZ** — sadece hız+ISP+ülke+tarih), GET `?id=` ile getirir. Paylaş → POST →
`${origin}/araclar/hiz-testi?s=<id>` linki panoya **oto-kopya** (clipboard + execCommand fallback). `?s=` ile
açılınca paylaşılan sonuç gösterilir (banner "ISP · X önce" + 'Kendi Testini Yap'). `lib/hiz.js` ortak ISP/ülke
helper (bilgi+sonuç kullanır). Store `.hiz-sonuc` **gitignore + tar-exclude**; deploy'da diff-delete'ten korunur
(bir kez oluşunca before.txt'te → otomatik). **Doğruluk:** TCP slow-start **ısınma penceresi (1.2s) ölçümden
HARİÇ** (steady-state throughput → hızlı hatları olduğundan düşük göstermez), indirme **6 paralel akış**, ping
14 örnek (ilk 3 ısınma atılır). Doğrulandı (CF): POST/GET çalışıyor, gerçek ISP (AS-TURKSAT) saklanıyor, geçersiz id 404.

**Son iş (2026-08-25) — Hız Testi Ookla tarzı SADELEŞTİRİLDİ + yazı-üst-üste bug'ı çözüldü (`.17`):**
Kullanıcı "tasarım bok gibi, yazılar üst üste, daha basit şık ookla gibi olsun" dedi. **KÖK NEDEN:** merkez
sayı HTML overlay'di (sabit 52px), tik yazıları SVG'ydi (viewBox ile ölçekli) → mobilde ölçek uyuşmazlığı →
üst üste binme. **ÇÖZÜM:** merkez sayı+birim **SVG `<text>`'e taşındı** (her şey birlikte ölçeklenir, çakışma
imkânsız). Ayrıca: ortada **BAŞLA butonu** (Ookla imzası, idle/hata'da), ibre merkez `fill-surface` diskin
arkasından çıkıyor, tik SAYILARI azaltıldı [0,10,50,100,500,1K] (marklar hepsinde), progress bar KALDIRILDI,
tek satır durum metni. `HizTesti.jsx` baştan yazıldı. Doğrulandı (CF): sayfa 200, `tailwind.css?v=hash` yeni
SVG sınıflarını (`fill-strong`/`stroke-brand-500`) taşıyor → CF purge GEREKMEDİ (versiyonlama çalışıyor).

**Son iş (2026-08-25) — Hız Testi speedtest.net tarzı YENİDEN TASARLANDI (`.17`):** Kullanıcı ilk sürümü
"çok temel" buldu → **animasyonlu ibreli gauge** (rAF ile DOM-sürümlü ibre/yay/sayı, non-linear skala 0–1000
+ tick/etiket + renkli yay dolumu + aktifken glow; **`memo`** ile faz-içi `setIlerleme` re-render'ında rAF
sahipliği korunur — yoksa React JSX ilk değerine sıfırlar; `gosRef` ile temiz faz sıfırlama), **sayaç
animasyonlu** metrik kartları (`useSayac` easing), **bağlanılan sunucu + sağlayıcı paneli** (yeni uç
`app/api/araclar/hiz-testi/bilgi`: CF `x-swb-asn` → Team Cymru `AS{n}.asn.cymru.com` TXT ile ISP adı +
`cf-connecting-ip` + `cf-ipcountry`; dış API/anahtar YOK, `saglayiciTemizle` " - " dedupe), **Sonucu Paylaş**
(Web Share API + pano fallback). `transition-all` YOK. `HizTesti.jsx` baştan yazıldı. Doğrulandı (CF):
sağlayıcı gerçek algılandı (AS-TURKSAT / 94.54.60.9 / TR), sayfa 200, indir 1MB octet-stream.

**Son iş (2026-08-25) — İnternet Hız Testi aracı CANLI (`.17`):** Araçlar'a 8. araç. `/araclar/hiz-testi`
statik server sayfa (DNS gibi `[arac]` generateStaticParams'tan dışlandı, kendi route'u) + client widget
`components/site/HizTesti.jsx`: paralel indirme (`fetch`+stream reader), yükleme (`XMLHttpRequest`
`upload.onprogress` ile canlı bayt), ping + jitter, süre+bayt tavanı, iptal, reduced-motion, dark-mode
(semantic token + `stroke-brand-500` gauge), `min-w-0`/`truncate` taşma-guard, `data-umami-event`.
API uçları `app/api/araclar/hiz-testi/{indir,yukle,ping}`: indir = incompressible octet-stream akışı
(`no-transform`, reused 64KB random blok, ≤60MB/istek), yukle = gövdeyi stream ile say+boşalt, ping = 204.
Ölçüm kendi sunucumuza karşı (hosting firması için marka değeri). `content/site/araclar.js` kaydı (icon
`gauge`). Doğrulandı (CF üzerinden): sayfa 200, ping 204 DYNAMIC, indir 1MB=1048576 octet-stream, yukle
doğru sayıyor. Sitemap'e otomatik eklendi → IndexNow bildirdi.

**Son iş (2026-08-25) — SEO crawler muafiyeti CANLI (`.17`):** SEO checker'lar (Seobility ekran
görüntüsü) Hetzner/AWS/OVH gibi datacenter IP'lerinden taradığı için güvenlik geçidine takılıp
`/guvenlik` challenge sayfasını analiz ediyordu (Seobility on-page %0, meta %0). Çözüm: `lib/guvenlik.js`
`SEO_ARAC_UA_RE` — Seobility/Ahrefs/Semrush/Moz(dotbot,rogerbot)/Majestic/Screaming Frog/SISTRIX/
DataForSEO/SE Ranking/WebPageTest vs. UA ile challenge'dan muaf; `muafBotUA() = MUAF_UA_RE || SEO_ARAC_UA_RE`.
Hard-block (BLOKLU) muafiyetten önce olduğu için kötü ASN taklit etse de engelli kalır. Doğrulandı:
Seobility/Ahrefs/ScreamingFrog 200 gerçek sayfa, Chrome+datacenter hâlâ 302→/guvenlik. CF purge gerekmez.

**Son iş (2026-08-25) — IndexNow oto-ping CANLI (`.17`):** `app/api/indexnow/route.js` (GET tam-sitemap
ping + POST `{urls:[...]}` hedefli/CMS) + `lib/indexnow.js` (`siteHaritasiUrlleri` kendi `/sitemap.xml`'ini
`127.0.0.1:PORT`'tan çekip `<loc>` parse eder — **kaynak-sız uyumlu**, `getManifest` runtime'da çağrılmaz;
`indexNowGonder` → `api.indexnow.org` toplu POST, host/keyLocation `SITE_URL`'den). Auth
`INDEXNOW_TOKEN`||`CRON_TOKEN` (`x-cron-token`/`?key=`), token'sız **401**, `SITE_INDEXABLE!=1` no-op.
Dedup `.next/BUILD_ID` (yeni build=1 ping, reboot/crash=ping yok; `?zorla=1` zorlar). **Oto-tetik:** systemd
drop-in `/etc/systemd/system/sunucumweb.service.d/indexnow.conf` `ExecStartPost` → her deploy restart'ında
ping. **CF purge gerekmez** (dinamik `no-store`, `cf-cache-status: DYNAMIC`). Doğrulandı: 82 URL gönderildi
(`ok:true`), dedup + 401 + ana sayfa 200. Detay: memory `sunucumweb-son-durum` "INDEXNOW OTO-PING".

**Son iş (2026-08-24, tasarım listesi — YEREL, henüz deploy edilmedi):** Kullanıcının 5 maddelik
tasarım listesi bitti, `localhost:3000`'de 320–1920 taşmasız doğrulandı. cPanel deploy ile canlıya çıkacak.
1. **Ürün hero'ları ürüne özel** (`ProductPage.jsx`): donanım ürünleri (VDS/Premium/Dedicated/GPU/
   Barındırma/IP) gerçek görselini premium çerçevede + yüzen spec çipleriyle; hosting ürünleri fotoğraf
   yerine "canlı site + performans paneli" (tarayıcı mockup + LiteSpeed/uptime). Ürüne özel vurgu tonu
   (`HERO_TON`, dekoratif translucent glow — koyu modda güvenli) + artık kullanılan `heroStats`.
   Yeni bileşenler: `HeroVisual`/`DonanimGorsel`/`HostingGorsel`. `HERO_GORSEL` map.
2. **Ana sayfa hero slider yenilendi** (`HomePage.jsx` `Hero`+`SLIDES`): demo içerik/stok görsel gitti.
   Full-bleed yerine **split hero** — koyu markalı zemin (grid+glow) + solda somut gerçek metin
   (NVMe/cPanel/root/DDoS/WHOIS) + sağda **gerçek veri merkezi fotoğrafı** (`/img/galeri/*.webp`,
   About'ta beğenilen portre foto'lar, aspect-[4/5] çerçeve, crossfade). Mobilde de görünür (copy→foto).
   Rotasyon/dokunma/dots mantığı korundu. Eski `/img/slider/*.jpg` artık kullanılmıyor.
3. **Ana sayfa kurumsallık** (`HomePage.jsx` `AltyapiVitrin`): gerçek galeri foto'larıyla (kabin-dellemc/
   gpu/acik) "Altyapımız" bölümü — Tier-3/7-24 NOC/yedekli omurga/İstanbul rozeti. Neden↔Paketler arası.
4. **Alan adı ölü alanları** (`DomainPage.jsx`): dar ortalı hero → iki kolon. Sağda mode'a göre
   `SonucKart` (register: canlı uygunluk listesi) / `TransferKart` (transfer durumu adımları).
5. **Site geneli kurumsal görseller**: 2/3 üzerinden gerçek foto'lar (hero + AltyapiVitrin + ürün
   hero'ları) eklendi. Not: yeni gerçek 16:9 foto gelirse full-bleed hero'ya da dönülebilir.

**Bonus (kaynağında düzeltildi):** 320px'te TÜM sitede gizli header taşması varmış (logo+sağ küme
sığmıyordu, `scrollWidth 347>320`). `chrome.jsx` SiteHeader: logo `max-w-[44vw] sm:max-w-none`, base
padding `px-3`, gap `gap-2 sm:gap-3`. Artık 320'de her sayfa temiz. **Not:** dev'de `html.dark` hidrasyon
uyarısı + Tawk `i18next` hatası ÖNCEDEN VARDI, benim değişikliklerimle ilgisi yok (theme no-flash scripti).

**Önceki iş (2026-08-23, commit `875553e`):** 8 iş bitti, canlıdan doğrulandı.
1. **Footer üstü Atatürk sözü + imza** — `chrome.jsx` `AtaturkSoz` (SiteShell'de AltyapiSerit
   ile SiteFooter arası). "Hayatta en hakiki mürşit ilimdir, fendir." + `public/img/ataturk-imza.webp`.
   İmza BEYAZ webp; `invert dark:invert-0` → light'ta siyah, dark'ta beyaz (iki modda da görünür).
2. **Trustpilot puan rozeti** — footer alt bölümünde Google rozetiyle **aynı satırda** (solda
   alt alta, BTK sağda; eski ayrı satır + fazladan divider kaldırıldı). `TrustpilotKutu`, Google
   rozeti stilinde **ÖZEL rozet** (Trustpilot yeşil yıldız + puan + 5 yeşil kutu + yorum sayısı
   + wordmark), canlı yorum sayfasına link. Puan `TRUSTPILOT` sabitinden (`puan:3.8, adet:2`),
   **MANUEL güncellenir**. NEDEN özel rozet: Trustpilot'un puan gösteren TrustBox'ları (Mini/Micro)
   **ücretli plan** gerektiriyor; ücretsiz planda sadece logo çıkıyor (denendi, doğrulandı).
   Paid plana geçilirse resmi Mini widget (`53aa8807dec7e10d38f59f32`) kullanılabilir. businessunit
   id `69a9e79d1a30a0453db1e580`.
3. **Dedicated görseli** `public/img/urun/dedicated.webp` — ProductPage `SLUG_GORSEL` + mega menü.
4. **Hazır Yazılım Satın Al** `/iletisim`'de kaldı (kod zaten `satinAlUrl || '/iletisim'`).
5. **Umami analitiği tüm sitede** — `app/layout.jsx` `next/script afterInteractive`. Önemli
   aksiyonlara `data-umami-event` (Satın Al/Sepete Ekle, Demo, Hemen Başla, Para Birimi,
   Telefon, Müşteri Paneli). **TASARIM-KURALLARI.md'ye 9. altın kural eklendi.**
6. **IP Kiralama** (`ip-kiralama.webp`) + **Sunucu Barındırma** (`sunucu-barindirma.webp`)
   mega menü ikonları — Veri Merkezi grubu.
7. **Varsayılan para birimi USD** — `CurrencyProvider.jsx` başlangıç USD (localStorage öncelikli).
8. **Para birimi seçici DROPDOWN** — yan yana toggle yerine tek butonlu açılır liste
   (`ParaBirimiSecici`, dış tık/Esc kapatır, `z-[70]`, mega menü/BaslaModal ile çakışmıyor).

**Ek istekler (2026-08-23):**
- Footer altı derli toplu: Google + Trustpilot rozetleri tek satırda solda alt alta, BTK sağda
  (Trustpilot'un ayrı satırı + fazladan divider kaldırıldı). Google & Trustpilot'ta görünen
  **yorum sayısı gizlendi** (puan + yıldız kaldı, aria-label'da sayı erişilebilirlik için duruyor).
- **Durum/Status → `status.sunucumweb.com`**: yeni `app/api/durum/route.js` proxy (`?status`).
  `DurumRozeti` (footer) + yeni `DurumWidget.jsx` (ana sayfa "Sistem Durumu" bölümü) bundan besleniyor;
  TopBar + mobil "Ağ Durumu" linkleri status sayfasına. Widget native (servis/uptime/ping/sparkline,
  temaya uyumlu, servis sayısından bağımsız).
  - **Tuzak:** `widget.php` `X-Frame-Options: SAMEORIGIN` → dış domainden iframe gömülemez (native yapıldı).
  - **Tuzak:** API `Access-Control-Allow-Origin: *` başlığını ÇİFT gönderiyor → tarayıcı reddediyor;
    doğrudan client fetch çalışmaz, **sunucu-sunucu proxy şart** (`/api/durum`).

- **Kampanyalar sayfası** (`/kampanyalar`, Kurumsal altında): `app/kampanyalar/page.jsx`
  (metadata + ItemList/Offer JSON-LD) → `KampanyalarPage.jsx` (client, SiteShell). Veri
  `content/site/kampanyalar.js` (3 demo kampanya). Kart: indirim rozeti, para birimine uyumlu
  fiyat, kupon kopyalama (clipboard + execCommand fallback), son tarih, CTA, boş-durum. Menü
  (Kurumsal mega + footer) + sitemap güncellendi; `tag/gift/percent` ikonları eklendi.
  - **Tuzak (useParabirimi):** fiyat hook'u SiteShell'in İÇİNDEki alt bileşende çağrılmalı,
    sayfanın üst gövdesinde değil (provider'ı SiteShell verir; üstte TRY fallback döner).

- **Tawk.to canlı destek** (global): `app/layout.jsx` `next/script afterInteractive` (Umami yanında).
  Mobil "Canlı Destek" butonu `window.Tawk_API?.toggle?.()` ile açar. **10. altın kural** eklendi
  (her yapı Tawk uyumlu: tek betik, sağ alt köşe boş, sohbet Tawk_API'den).

**SEO — DETAYLI OPTİMİZASYON (2026-08-24, sürüyor):** CMS uzun vadeye bırakıldı; içerik statik,
odak detaylı SEO. **Faz 1 bitti+canlı** (commit `8351bdd`):
- `lib/seo.js` → `sayfaMeta({baslik,aciklama,yol,ogGorsel,tip})` merkezi meta üretici (canonical +
  OG/Twitter + varsayılan görsel). Yeni sayfalarda **bunu kullan**.
- `lib/semalar.js` → şema kütüphanesi: `firmaSemasi()` (Organization+LocalBusiness), `ekmekKirintisi()`
  (BreadcrumbList), `sssSemasi()` (FAQPage), `urunSemasi()` (Product+AggregateOffer). `components/site/Sema.jsx`
  = `<Sema veri={...}>` JSON-LD renderer (tek obje ya da dizi).
- `public/og.png` (1200×630 marka görseli, sharp ile üretildi). layout: LocalBusiness (adres/tel/
  contactPoint/priceRange/areaServed) + varsayılan OG. `app/manifest.js` (webmanifest).
- PageHero → BreadcrumbList (tüm iç sayfalar). ProductPage → Product+Offer+FAQ+Breadcrumb.
  HomePage/DomainPage → FAQPage. Slug router generateMetadata → `sayfaMeta` (canonical+OG her sayfada).
  Doğrulandı: tüm sayfalarda JSON-LD geçerli, canonical `sunucumweb.com`, og:image çıkıyor.
**Faz 2 bitti+canlı** (commit `a3def01`): layout `title.template '%s | SunucumWEB'` (ana sayfa default eksiz);
`content/site/products.js` → `SEO_BASLIK` haritası (10 ürüne anahtar-kelime odaklı başlık, slug router kullanıyor);
kampanyalar/hazir-yazilim(hub+detay)/araclar(hub+detay)/legal → `sayfaMeta` (canonical+OG+twitter, çift ek temizlendi).
Doğrulandı: her sayfada benzersiz optimize başlık + tek marka eki + og:image.
**Faz 3 bitti+canlı** (commit `783b0d7`): `next.config` **Permissions-Policy** (proxy X-Frame/nosniff/
XSS/Referrer ekliyor → sadece proxy'nin eklemediği eklendi, canlıda tam 1 kez, ÇİFT YOK); `sitemap.js`
statik `lastModified 2026-08-24` (new Date() değil); layout dış origin **dns-prefetch** (Tawk/Umami/status).
Denetim: tüm görsellerde alt + width/height mevcut, ana sayfa hero LCP zaten `eager + fetchPriority=high`.
**SEO 3 FAZ TAMAMLANDI.** aggregateRating eklenmedi (Google policy riski).

**YW-SEOSTD standart uyumu** (commit `2bac6b1`) — `Desktop/Altyapı Dokuman/NEXTJS/` 3 resmi PDF ile karşılaştırıldı;
kalan kod-tarafı boşluklar kapatıldı: `public/llms.txt` (AI/GEO), `app/error.jsx`+`global-error.jsx`, favicon seti
(apple-touch + android-chrome 192/512, layout icons + manifest), **HSTS** (yalnız production/indexlenebilir branch;
demo yetkin.web.tr kardeş alt alanlarını etkilemesin). **KULLANICIDAN GEREKEN:** GTM/GA4 container ID, GSC/Bing/Yandex
doğrulama kodları, IndexNow anahtarı, SPF/DKIM/DMARC (DNS). **Bilinçli sapma:** next/image yok (ham `<img>`+WebP,
CWV karşılanıyor ama otomatik AVIF/srcset yok) — gelecek refaktör. Detay: memory `sunucumweb-yetkinweb-standartlari`.

**Önceki iş (2026-08-22):** Mega menü ikonları SVG'lerle yenilendi; ISP/ABD sunucu silindi;
Hazır Yazılım menüsü+sayfası eklendi; ürün sayfaları gerçek veriyle yayında; SEO teknik tamam.

---

## 1. Sayfa sayfa durum

| Sayfa / bölüm | Durum | Not |
|---|---|---|
| Ana sayfa | **Bitti — zenginleştirildi** | Hero + ürün bulucu + kategoriler; alt kısma temsilî paket vitrini, hazır yazılım vitrini, referans logo şeridi ve SSS eklendi |
| **Şirket Profili** (`/hakkimizda`) | **BİTTİ — DOKUNMA** | Kullanıcı beğendi. 3B küre, marka slider'ı, sayaçlar |
| **Legal** (`/legal`, `/legal/{belge}`) | **BİTTİ — DOKUNMA** | Kenar çubuklu, şirket bilgileri varsayılan |
| İletişim (`/iletisim`) | Çalışıyor | Form SMTP yokken günlüğe yazıyor |
| Araçlar (`/araclar` + 8 araç) | Bitti | İnternet Hız Testi (client ölçüm), DNS SEO şeması, kara liste, güvenlik başlıkları |
| Alan adı (`/alan-adi`, `/transfer`) | **Bitti** | Demo metin temizlendi; uzantılar + nasıl çalışır + avantajlar + SSS ile dolu/profesyonel yapı |
| **Hazır Yazılım** (`/hazir-yazilim` + `/hazir-yazilim/[slug]`) | **BİTTİ** | scriptevim.com'dan taşınan **42 gerçek ürün** (banner görselli + **gerçek demo URL'leri**). Liste kartı: banner + eski/yeni fiyat + **İncele + Demo** butonları. Detay: banner + açıklama + özellik + **Sepete Ekle + Demoyu Gör** + benzer ürünler (Satın Al / Hemen Ara yok). Görseller `public/img/yazilim/*.webp`. Veri `content/site/yazilimlar.js` (fiyat + eskiFiyat + demoUrl). Demolar ohesap.com / tahminbaz.com.tr / *.scriptevim.com |
| 10 ürün sayfası (Hosting/Sunucu/Veri Merkezi) | **BİTTİ — yayında** | Yenilenmiş `ProductPage.jsx`. **Gerçek sunucumweb.com verisi** (`content/site/urun-planlari.js`, 53 paket — router PRODUCTS ile birleştirir). Hosting: kartlar **yan yana** + kategorili **karşılaştırma tablosu**; Sunucu/Veri Merkezi: planlar **alt alta** satır. Aylık/yıllık toggle, Sepete Ekle, eski/yeni fiyat+indirim, fiyatsız (IP)→"görüşün". Sadece **isp/abd** `YAPIM_ASAMASI`'nda |
| SEO uygulaması | **İyileştirildi** | `metadataBase`, OG/Twitter (tr_TR), site geneli Organization + WebSite JSON-LD (layout); hazir-yazilim ItemList/SoftwareApplication JSON-LD; sitemap güncel |

---

## 2. Mimari — nerede ne var

```
app/
  [[...slug]]/page.jsx        slug yönlendirici (ana sayfa, alan-adi, transfer);
                              YAPIM_ASAMASI seti -> YapimAsamasi (ürün sayfaları)
  hazir-yazilim/page.jsx      YENİ statik rota (server): metadata + JSON-LD + HazirYazilimPage
  hazir-yazilim/[slug]/page.jsx  YENİ inceleme rotası: 42 slug static params + Product JSON-LD
  hakkimizda  → [[...slug]] içinden AboutPage
  legal/[[...belge]]/page.jsx kenar çubuklu yasal sayfa
  araclar/…                   araç sayfaları + DNS SEO rotaları
  api/…                       araclar, iletisim, domain, ai, health, google-reviews
  sitemap.js, robots.js, globals.css, layout.jsx

components/site/
  chrome.jsx        SiteHeader (üst bar + mega menü + sepet), SiteFooter, Icon, CtaBand,
                    SiteShell (AltyapiSerit + footer burada), PageHero, MENU, ARAC_MENU
  HomePage.jsx      hero slider + ürün bulucu + kategoriler
  AboutPage.jsx     şirket profili (DOKUNMA)
  VeriMerkeziKure.jsx / VeriMerkeziBolumu.jsx   3B küre + iniş kartı (DOKUNMA)
  SayacKartlari.jsx animasyonlu rakam kartları
  LogoSerit.jsx / LogoKutusu.jsx   kayan logo şeritleri (marka + altyapı)
  AltyapiSerit.jsx  footer üstü altyapı şeridi, her sayfada
  LegalHubPage.jsx  yasal sayfa (DOKUNMA)
  ProductPage.jsx   ürün sayfası şablonu (şu an render edilmiyor; ürünler yayına
                    çıkınca [[...slug]] içinde tekrar bağlanacak)
  YapimAsamasi.jsx  "yapım aşamasında" ekranı (ürün sayfaları buraya yönleniyor)
  HazirYazilimPage.jsx  hazır yazılım kataloğu (sidebar + arama + sıralama + pagination)
  DomainPage.jsx    alan-adi / transfer (yenilendi, demo metinsiz, dolu yapı)
  ContactPage.jsx, DomainAI.jsx, KabinSlider.jsx, ToolsPage.jsx, ToolRunner.jsx,
  DnsToolPage.jsx, DnsRapor.jsx, tool-ui.jsx, CartProvider.jsx, AddToCartButton.jsx

content/site/
  products.js       ürün içeriği (fiyatlar temsilî; şablon yeniden bağlanınca kullanılacak)
  yazilimlar.js     hazır yazılım kataloğu: kategoriler + temsilî ürünler
  araclar.js        7 araç
  dns-tipleri.js    10 DNS kayıt tipi açıklaması
  dunya-maskesi.js  0.5° kara maskesi (base64)
  hakkimizda.js     şirket profili içeriği
  legal.js + legal/*.html
  markalar.js       MARKALAR (9 referans) + ALTYAPI (8 logo)

lib/
  seo.js            SITE_URL, mutlakUrl, kanonik
  dns-yol.js, dns-onbellek.js
  content.js        manifest + eski html okuma
  engines/          tools, domain-ai, domain-availability, cart, theme, mesai,
                    scroll-lock, smooth-scroll, google-reviews, contact, product-finder
                    core/ → http, ratelimit, result, rdap, whois43, ag (SSRF), flags, text
```

**Renkler semantik:** `bg-page/surface/surface2`, `text-strong/body/muted`, `border-line`,
`bg-brandsoft`, `text-brandtext`. Sabit renk (`bg-white`, hex) yazma — koyu mod bozulur.
`transition-all` kullanma (Chromium'da tema değişince renk donuyor).

**Akışkan ölçek:** `tipo-dev` (h1), `tipo-bolum` (h2), `tipo-giris`, `tipo-metin`.
1800 px üstünde `.max-w-7xl` 92rem'e açılıyor. Geçenler: legal, hakkımızda, veri merkezi.
Geçmeyenler: ana sayfa, ürünler, araçlar, iletişim, alan adı.

---

## 3. Bağlayıcı kurallar

`TASARIM-KURALLARI.md` içindeki **7 altın kural** + kullanıcının koyduğu 3 çalışma kuralı:

1. **Ekran görüntüsüyle kanıtlama yok.** Doğrulamayı sessizce yap, tek cümleyle söyle.
2. **Her OS ve tarayıcıda %100 çalışacak** (macOS, iOS, Android, Linux, Windows) —
   animasyonlar ve WebGL dahil; geri düşüş, `prefers-reduced-motion`, dokunmatik.
3. **Yatay taşma sıfır tolerans** + akıllı ölçekleme (büyük ekranda küçük,
   küçük ekranda kocaman durmayacak).

### Taşma denetimi (her bölüm bitiminde çalıştır)

Gizli bir `<iframe>` içinde sayfayı farklı genişliklerde açıp ölç — tek çağrıda onlarca
kombinasyon:

```js
const c = document.createElement('iframe');
c.style.cssText = 'position:fixed;left:-9999px;top:0;height:900px;border:0';
document.body.appendChild(c);
const yukle = (u, g) => new Promise(r => { c.style.width = g+'px'; c.onload = () => setTimeout(r, 300); c.src = u; });
for (const s of ['/', '/legal', '/hakkimizda']) for (const g of [320,375,768,1440,1920]) {
  await yukle(s, g);
  if (c.contentDocument.documentElement.scrollWidth > g + 1) console.log('TAŞMA', s, g);
}
```

---

## 4. Çalıştırma ve yayınlama

```bash
cd "C:\Users\alike\Desktop\SunucumWEB Site\sunucumweb-next"
npm run dev
```

- `npm run build`'i dev açıkken **çalıştırma** (ikisi de `.next/` kullanır).
- Yeni Tailwind sınıfı eklediysen `npm run build:css`.
- Doğrulama için `npm run start` (üretim) daha sağlıklı.

**Yayın:** `git push` → GitHub Actions imajı derler (~4 dk) → sunucuda `sudo sunucumweb-guncelle`.

```bash
ssh -i cpanel_key -p 6060 ali@45.196.28.7
sudo sunucumweb-guncelle
```

⚠️ **Dağıtım tuzağı:** Arka arkaya iki push yapılınca "yeni imaj geldi mi" kontrolünü
imaj **kimliğine** göre yapmak bir önceki commit'in imajını dağıttırır. İmajın **içinde**
beklenen değişiklik var mı diye bak:

```bash
sudo docker run --rm --entrypoint sh ghcr.io/yetkinbulutnet-ops/sunucumweb:latest \
  -c 'grep -rl "aradigin-sinif" /app/.next/server | head -1'
```

---

## 5. Tuzaklar (hepsi bizzat yaşandı)

- **Izgara/esnek kutu çocuklarında `min-width:auto` varsayılan** → uzun içerik hücreyi
  şişirir, sayfa kayar. Sütunu `minmax(0,1fr)`, çocuğu `min-w-0` yap.
- **Kapsayıcı dolgusundan büyük negatif kenar boşluğu** (`-mx-5` + `px-5`) ızgarada taşırır.
- **`renderer.setSize(g, y, false)`** → canvas CSS boyutu ayarlanmaz, yüksek DPI ekranda
  kutu 2-3 katına çıkar. Üçüncü parametreyi verme.
- **DoH sorgularında tip adı değil sayısal kod gönder** — bazı çözümleyiciler `type=MX`
  yazısını yok sayıp A kaydı döndürüyor.
- **`AbortSignal` kullanan fetch Next tarafından önbelleğe alınmaz** → SSR sayfada sonucu
  `unstable_cache` ile sarmala (`lib/dns-onbellek.js`).
- **Giden bağlantı `ETIMEDOUT` veriyorsa önce ham TCP dene.** Port açıksa sebep Node 20'nin
  Happy Eyeballs'ı (her adrese 250 ms). `core/http.js` bunu 2500 ms'e çıkarıyor.
- **DNSBL'de `127.255.255.25x` listeleme değil, hata kodudur.**
- **Tarayıcı paneli bu ortamda hep gizli** → `document.hidden` true, `requestAnimationFrame`
  durur, lazy görseller ve IntersectionObserver ile mount edilen bileşenler tetiklenmez.
  "Çalışmıyor" sanma; layout ölçümü yine de doğru çalışır.
- **Tema değişimini elle `classList.toggle('dark')` ile test etme** — `tema-kilit` devreye
  girmediği için renkler donar, gerçek düğmeyi kullan.

---

## 6. Kullanıcıdan gelmesi gerekenler

| Konu | Ne lazım |
|---|---|
| Google yorum rozeti | Places API (New) anahtarı + Place ID → `/etc/sunucumweb-demo.env` |
| İletişim formu | SMTP hesabı (Mailu aynı makinede) — mesajlar şu an günlüğe yazılıyor |
| Sosyal medya | Gerçek hesap adresleri |
| Rakamlar | %99.9 / 10.000+ / <5dk temsilî — üç kez soruldu, cevap gelmedi |
| Kabul Edilebilir Kullanım Politikası | Gerçek metin (eski belge Kullanım Koşulları'yla %99.8 aynıydı, kaldırıldı) |
| Groq + dnschecker anahtarları | Canlıya çıkmadan yenilenecek |
| Kendi alan adımız | DMARC kaydı yok, SPF `~all` (katıya çekilmeli) |
