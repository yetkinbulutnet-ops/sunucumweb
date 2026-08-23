# Devam notu — yeni sohbete başlarken oku

Sırayla oku: `DEVAM.md` (bu dosya) → `TASARIM-KURALLARI.md` → `lib/engines/README.md` → `TASIMA.md`.

Son güncelleme: 2026-08-23. Çalışma ağacı temiz, her şey `main` dalında ve canlıda.
Demo: https://sunucumweb.demo.yetkin.web.tr (arama motorlarına kapalı)

**Son iş (2026-08-23, commit `875553e`):** 8 iş bitti, canlıdan doğrulandı.
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
| Araçlar (`/araclar` + 7 araç) | Bitti | DNS SEO şeması, kara liste, güvenlik başlıkları |
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
