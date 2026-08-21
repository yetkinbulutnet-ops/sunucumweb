# Tasarım Altın Kuralları

> Bu dosya bağlayıcıdır. Siteye eklenen **her yeni bölüm, bileşen ve sayfa** buradaki
> kuralların **hepsini** sağlamak zorundadır. CMS geldiğinde de bu kurallar geçerli olacak.

---

## 1. ALTIN KURAL — Her şey hem açık hem koyu modda tasarlanır

Bir bileşen yazılırken **iki mod birden** düşünülür. "Sonra koyu moda bakarız" yoktur.

**Sabit renk YASAK.** Bunları asla kullanma:
`bg-white` · `text-slate-600` · `text-ink` · `border-slate-100` · `#0f2942` · `bg-brand-50`

**Bunları kullan** (renkler `app/globals.css`'teki değişkenlerden gelir, tema değişince
otomatik uyar — `dark:` yazmana gerek kalmaz):

| Amaç | Sınıf |
|---|---|
| Sayfa zemini | `bg-page` |
| Kart / panel zemini | `bg-surface` |
| Vurgulu bölüm zemini | `bg-surface2` |
| Ayırıcı çizgi / kenarlık | `border-line` |
| Başlık metni | `text-strong` |
| Gövde metni | `text-body` |
| Soluk / ikincil metin | `text-muted` |
| Marka tonlu zemin (ikon kutusu vb.) | `bg-brandsoft` |
| Marka tonlu metin | `text-brandtext` |
| Marka tonlu kenarlık | `border-brandline` |

**İstisna:** Bilerek her iki modda da koyu kalması gereken bölümler (`bg-ink` paneller,
footer, CTA şeridi). Oralarda `text-white` / `text-slate-300` kullanmak doğrudur.

**Chromium tuzağı:** Zemini `var()` ile gelen bir elemana `transition` verirsen, tema
değişince renk **eski değerde donup kalır**. Bu yüzden `transition-all` kullanma;
sadece gerekeni yaz (`transition-shadow`, `transition-transform`, `transition-colors`).

**Kontrol:** Bir bölüm bitince iki modda da aç, metin kontrastının en az 3:1 olduğunu doğrula.

---

## 2. ALTIN KURAL — Görsellerde her zaman sabit çözünürlük

Her görsel alanının **standart bir boyutu** vardır. Yüklenen görsel o boyuta kırpılır.
Böylece mobilde/masaüstünde kayma (layout shift) olmaz ve CMS'te editör ne yükleyeceğini bilir.

| Alan | Boyut | Oran |
|---|---|---|
| **Slider / hero banner** | **1920 × 1080** | 16:9 |
| Sayfa içi geniş görsel | 1600 × 900 | 16:9 |
| Kart görseli | 800 × 600 | 4:3 |
| Blog / haber kapağı | 1200 × 630 | 1.91:1 |
| Kare görsel (ekip, logo) | 600 × 600 | 1:1 |
| Avatar | 200 × 200 | 1:1 |

**Uygulama kuralları:**
- Görsel kabı **her zaman** `aspect-[16/9]` gibi sabit oranlı olur — yükseklik içeriğe göre değişmez.
- Görsele `object-cover` verilir, kap `overflow-hidden` olur.
- Metin görselin üstüne binecekse **mutlaka karartma katmanı** konur, yoksa metin okunmaz.
- Görseller `public/img/<bolum>/` altında, **hedef boyuta önceden küçültülmüş** halde durur.
  Tarayıcıya 6000px'lik dosya gönderilmez.

---

## 3. ALTIN KURAL — Akıllı responsive (orantılı ölçekleme)

Site büyük ekranda **orantılı büyür**, küçük ekranda **orantılı küçülür**. Sabit piksel
değerleriyle tasarlanmaz.

- Tipografi kademeli: `text-3xl sm:text-4xl lg:text-5xl` — tek bir sabit boyut değil.
- Boşluklar kademeli: `py-16 lg:py-24` — her yerde aynı `py-20` değil.
- Kaplar: `max-w-7xl mx-auto px-5 lg:px-8` — geniş ekranda içerik dağılmaz, dar ekranda yapışmaz.
- Izgaralar kademeli daralır: `grid sm:grid-cols-2 lg:grid-cols-4`.
- **Yatay taşma YASAK.** Her değişiklikten sonra `scrollWidth <= innerWidth` doğrulanır.
- Uzun metin/tablo/kod taşacaksa **kendi içinde** kaydırılır (`overflow-x-auto`), sayfa kaymaz.
- Test edilecek genişlikler: **375 · 768 · 1280 · 1920**

---

### Yatay taşma: sıfır tolerans

**Hiçbir ekran genişliğinde sayfa yatay kaymaz.** `document.scrollWidth`
her zaman `window.innerWidth`'e eşit olmalı. Denetim 320 / 375 / 414 / 768 /
1024 / 1440 / 1920 / 2560 px'te yapılır, hem açık hem koyu modda.

Sık düşülen tuzaklar:
- **Izgara ve esnek kutu çocuklarında `min-width: auto` varsayılandır.**
  Uzun metin ya da geniş çocuk hücreyi şişirir. Izgara sütununu
  `minmax(0,1fr)` yaz, çocuğa `min-w-0` ver.
- **Negatif kenar boşluğu (`-mx-*`) kapsayıcının dolgusundan büyükse taşırır.**
  Kenardan kenara kayan şerit isteniyorsa üst kutuda kırpma şart.
- **Kanvas/WebGL:** `renderer.setSize(g, y)` üçüncü parametresi `false`
  verilirse CSS boyutu ayarlanmaz, yüksek DPI ekranda kutu 2-3 katına çıkar.
- Sabit `w-[900px]` gibi genişlikler yerine `max-w-*` kullan.
- Uzun kelime/URL için `break-words`, tablo ve kod bloklarına
  `overflow-x-auto` ver; sayfa değil, kutunun kendisi kaysın.

### Akıllı ölçekleme

Tasarım ekran boyutuna göre **orantılı büyüyüp küçülür**: büyük ekranda
içerik minicik kalmaz, küçük ekranda kocaman durmaz.

- Başlık ve bölüm boşluklarında sabit sıçramalar yerine akışkan ölçek
  kullan: `clamp(alt, tercih + vw, üst)`. Tailwind'de `text-[clamp(...)]`
  ya da `tipo-*` yardımcı sınıfları (`app/globals.css`).
- Kapsayıcı 1280 px'te durmaz; 1600 px üstü ekranlarda üst sınır genişler.
- Dokunma hedefleri her ekranda en az 44x44 px kalır.

---

## 4. ALTIN KURAL — CMS'ten yönetilebilir, sürdürülebilir yapı

Site ileride **CMS'ten yönetilecek**: içerik eklenecek, çıkarılacak, silinecek, düzenlenecek.
Tasarım bu değişikliklerde **bozulmamalı**. "Şu an 3 tane var, 3'e göre tasarlarım" YASAK.

### İçerik koddan ayrılır
Her tekrarlanan blok **veri dizisinden** üretilir, elle kopyalanmaz.
Veri; `content/site/` altında ya da bileşenin en üstünde tek bir sabitte durur —
CMS geldiğinde tek yapılacak, o diziyi API'den beslemek.

```jsx
// DOĞRU: veri -> döngü            // YANLIŞ: elle üç kart yazmak
{KATEGORILER.map((k) => <Kart key={k.id} {...k} />)}
```

### Değişken sayıya dayanıklı ol
- **Izgaralar** eleman sayısından bağımsız çalışsın: `grid sm:grid-cols-2 lg:grid-cols-4`
  1 eleman da 9 eleman da düzgün dizilir. `lg:grid-cols-3` yazıp 4. eleman gelince
  ortalanan tek kart bırakma.
- **Yükseklikler eşitlensin:** `items-stretch` + kart içinde `flex flex-col` ve
  esneyen gövde (`flex-1`) — biri uzun metinli olunca sıra bozulmaz.
- **Sıfır durumu:** liste boş gelirse bölüm ya gizlenir ya da anlamlı bir boş mesaj
  gösterir; asla kırık/boş kutu bırakmaz.
- **Taşma:** uzun başlık `text-balance`, uzun URL/e-posta `break-words`,
  çok elemanlı satır `flex-wrap`.

### Alanlar isteğe bağlı olsun
Bir kartın rozeti, açıklaması veya görseli olmayabilir. Bileşen bunu **varsayarak**
yazılır: `{it.r && <Rozet .../>}`. Eksik alan tasarımı bozmaz, sadece o parça çıkmaz.

### Metin uzunluğuna dayanıklılık
CMS'ten girilen metin kısa da olabilir uzun da. Kartlar sabit yükseklik yerine
minimum yükseklik + esneme kullanır; başlıklar 2 satıra çıkabilir varsayılır.

### Kimlikler
Liste elemanlarının `key` değeri **kararlı bir kimlikten** gelir (slug/href),
dizideki sıradan (`index`) değil — CMS'te sıra değişince React karışmasın.

> **Kontrol sorusu:** "Bu bölüme CMS'ten 1 tane daha eklesem / birini silsem
> tasarım bozulur mu?" Cevap evet ise bölüm henüz hazır değildir.

---

## 5. ALTIN KURAL — Kod ve içerik %100 SEO uyumlu

Demo **asla indexlenmez**, ama yazılan her şey ana sitede birinci günden çalışacak
şekilde SEO uyumlu üretilir. Referans: YW-SEOSTD-NEXT-V1 dokümanı.

### Render
- SEO'ya konu her sayfa **Server Component** olarak render edilir. `use client`
  yalnızca etkileşimli alt bileşenlerde kullanılır.
- Sıralanması hedeflenen içerik **asla** `useEffect` + fetch ile basılmaz; veri
  sunucuda çekilir. Botun gördüğü HTML dolu olmalı.
- Varsayılan strateji SSG; sık değişen içerikte ISR (`revalidate`).

### Metadata
- Site adresi tek kaynaktan: `NEXT_PUBLIC_SITE_URL`. Alan adı koda gömülmez.
- Kök layout'ta `metadataBase` **zorunlu** — yoksa OG görselleri mutlak URL'ye
  çevrilmez, paylaşımlarda görsel çıkmaz.
- Her indexlenebilir sayfada `alternates.canonical` tanımlı.
- Başlık şablonu: `template: "%s | SunucumWEB"`.
- OG + Twitter kartları, `locale: "tr_TR"`.

### Semantik ve içerik
- Sayfa başına **tek `<h1>`**; başlıklar sırayla h1 → h2 → h3.
- `<header> <nav> <main> <article> <section> <footer>` kullanılır; her şey `div` değil.
- İç bağlantılar `next/link`, dış bağlantılar `<a>`.
- Görsellerde `alt` zorunlu; dekoratifse bilinçli `alt=""`.

### Sistem dosyaları
- `app/sitemap.js`, `app/robots.js`, `app/manifest.js` **kod ile** üretilir.
- `lastModified: new Date()` **yasak** — her derlemede "bugün" döner, Google lastmod'u
  yok saymaya başlar. İçeriğin gerçek güncelleme tarihi kullanılır.

### Yapılandırılmış veri
Organization, WebSite, BreadcrumbList, Service, FAQPage, LocalBusiness şemaları
JSON-LD olarak sunucuda basılır. Kullanıcı girdisi ham olarak şemaya yazılmaz.

### Performans (Core Web Vitals)
- Görsellerde `width`/`height` zorunlu → CLS önlenir.
- LCP görselinde `priority`/eager; ekran altındakiler lazy.
- Font `<link>` ile CDN'den çekilmez; self-host edilir, `display: swap`.
- Güvenlik başlıkları: HSTS, X-Frame-Options, X-Content-Type-Options,
  Referrer-Policy, Permissions-Policy.

> Demo'da indexleme `SITE_INDEXABLE=0` ile kapalıdır. Bu, SEO işini erteleme
> gerekçesi değildir — anahtar `1` yapıldığı an site tam uyumlu olmalıdır.

---

## 6. ALTIN KURAL — Yapay zekâ ile yapıldığı belli olmayacak

Ne içerik, ne tasarım, ne de kod "AI çıktısı" gibi durmayacak.

### Metin
- Doğal, yerel Türkçe. Kurumsal ama yapay değil.
- **Kaçınılacaklar:** "çözümlerimizle tanışın", "ihtiyaçlarınıza özel", "bir adım önde",
  "dijital dünyada yerinizi alın" gibi doldurma kalıplar; her cümlede sıfat yığını;
  üç maddeli simetrik listeler; abartılı vaat.
- **Tercih edilen:** somut bilgi (NVMe, 1 Gbps, İstanbul lokasyonu, 5 dakikada yanıt),
  kısa cümle, gereksiz süsleme yok. Bir cümle bilgi vermiyorsa silinir.
- Türkçe doğal olsun: "sizlere en iyi hizmeti sunmaktayız" değil, "7/24 destek veriyoruz".

### Tasarım
- Şablon kokan simetriden kaçınılır; bölümler birbirinin kopyası olmaz.
- Her bölüm aynı "ikon + başlık + üç kart" kalıbıyla kurulmaz.

### Kod
- **Yorum satırı yazılmaz.** Kod kendini anlatacak şekilde yazılır: açıklayıcı
  değişken/fonksiyon adları, küçük fonksiyonlar, net yapı.
- Neden'ler koda değil, bu dokümana ve `lib/engines/README.md`'ye yazılır.
- Aşırı savunmacı, gereksiz genel çözümler yerine işi yapan sade kod.
- Değişken ve fonksiyon adları proje diliyle tutarlı olur.

---

## 7. ALTIN KURAL — Her tarayıcıda, her işletim sisteminde aynı çalışır

Site sadece geliştirme yaptığımız Chrome'da değil; **Safari, Firefox, Edge, Samsung
Internet, Opera** ve **Windows, macOS, Linux, iOS, iPadOS, Android** üzerinde aynı
görünmek ve aynı çalışmak zorunda. "Bende çalışıyor" bir kabul kriteri değildir.

### Desteklenen taban
`package.json` içindeki **`browserslist`** tek doğruluk kaynağıdır; autoprefixer ön
ekleri buradan üretir. Taban: **Safari/iOS 15+, Chrome-Edge 100+, Firefox 100+,
Android 9+, Samsung Internet 18+**. Bu listeyi daraltmak = eski iPhone'ları kesmek.

> Varsayılan browserslist (`last 2 versions`) **yeterli değildi**: sadece iOS 18+
> hedeflediği için `-webkit-backdrop-filter` ve `-webkit-mask-image` üretilmiyordu,
> iOS 15–17 Safari'de bulanık başlık ve maskeli ızgaralar bozuk çıkıyordu.

### CSS
- Yeni bir özellik kullanmadan önce **caniuse tabanına bak**. Taban altındaysa ya
  `@supports` ile kademeli iyileştirme yaz ya da vazgeç.
- `100vh` **tek başına yasak** — iOS Safari'de adres çubuğu yüzünden taşar.
  `min-h-ekran` yardımcı sınıfı kullanılır (`100vh` + `@supports` ile `100dvh`).
- `backdrop-filter`, `mask-image`, `appearance` gibi ön ek isteyen özellikler elle
  yazılmaz; autoprefixer'a bırakılır ama **çıktı `public/tailwind.css` içinde
  doğrulanır**.
- Bulanıklık (`backdrop-blur`) tek başına okunabilirlik sağlamaz: altında **her zaman**
  yeterli opaklıkta bir zemin olur, blur desteklenmezse de metin okunur kalır.

### Dokunmatik (iOS / Android)
- `hover:` sınıfları dokunmatikte **yapışır**. `hoverOnlyWhenSupported` açıktır;
  hover yalnızca gerçek imleçte çalışır. Bir işlev sadece hover ile erişiliyorsa
  o işlev telefonda **yok** demektir — mutlaka tıkla/dokun karşılığı olur.
- Form alanlarında yazı boyu **16px'in altına düşmez** (`globals.css` iOS'ta
  `max(16px, 1em)` ile korur), yoksa Safari odaklanınca sayfayı zumlar.
- Kaydırılan panel/modal açıkken gövde kilidi **paylaşılan motordan** yapılır
  (`lib/engines/scroll-lock`). `document.body.style.overflow='hidden'` iOS'ta
  arkadaki sayfayı durdurmaz ve iki bileşen aynı anda açılırsa birbirini bozar.
- Kaydırılan kutulara `overscroll-contain` verilir; panel sonunda sayfa kaymaz.
- Yatay kayan içerikte (slider vb.) dokunmatik **kaydırma jesti** desteklenir,
  dikey kaydırma engellenmez (`touch-action: pan-y`).

### Animasyon ve 3B (WebGL)

- Animasyonlar da bu kuralın kapsamındadır: macOS, iOS, Android, Linux ve
  Windows'ta birebir aynı çalışmalı.
- WebGL kullanan her bileşen **geri düşüş** sunar: bağlam alınamazsa metin kartı
  gösterilir, sayfa çalışmaya devam eder.
- Çizim döngüsü bileşen ekranda değilken ve `document.hidden` iken durur.
- `prefers-reduced-motion` açıksa otomatik hareket kapanır, içerik erişilebilir
  kalır. `matchMedia` çağrısı korumalı yapılır.
- Dokunmatikte `touch-action: pan-y` verilir; 3B alanda yatay sürükleme çalışır
  ama sayfanın dikey kaydırması engellenmez.
- Ağır kütüphaneler (three.js vb.) `next/dynamic` + `ssr:false` ile ayrı parçaya
  alınır ve yalnızca bileşen ekrana yaklaşınca indirilir; ana paket büyümez.
- Yazı tipi/kanvas ölçümü tarayıcıya göre değişir; konum hesapları piksel değil
  oran üzerinden yapılır.

### JavaScript
- Tarayıcıya özel API'ler **korumasız çağrılmaz**: `navigator.clipboard` yalnızca
  HTTPS'te ve modern tarayıcıda vardır → `try/catch` + geri düşüş şart.
  `localStorage` gizli sekmede yazmayı reddedebilir → her erişim `try/catch`.
- `Date` metin ayrıştırma tarayıcıya göre değişir; tarihler sabit biçimde
  (`new Date(yıl, ay, gün)` ya da ISO) üretilir.
- Taban üstü sözdizimi/API (`Object.groupBy`, `Array.at`, lookbehind regex vb.)
  kullanılmaz; gerekiyorsa özellik yoklaması yapılır.

### Görsel ve tipografi
- Font yığını **sistem yedekleriyle** tanımlanır (`-apple-system`, `Segoe UI`,
  `Roboto`, `Noto Sans`…). Poppins yüklenmezse Linux'ta düzen dağılmaz.
- SVG içindeki `id`/`url(#...)` değerleri **benzersiz** olur (`useId`); aynı sayfada
  iki kopya varsa Firefox/Safari ilk tanımı kullanır ve ikincisi bozulur.
- Türkçe karakter için `<html lang="tr">` zorunlu — `text-transform: uppercase`
  ancak öyle `i → İ` yapar.

### Test
Bir bölüm bitince **en az** şu üçlüde denenir: Chromium (Windows), WebKit (iOS
Safari), Gecko (Firefox). Elde cihaz yoksa tarayıcı geliştirici araçlarının cihaz
emülasyonu + `Responsive` modu ile 375/768/1280/1920 ölçülür; blur, maske, sticky
başlık, modal kilidi ve form odaklanma davranışı ayrıca kontrol edilir.

---

## Bölüm bitince kontrol listesi

- [ ] Açık modda düzgün
- [ ] Koyu modda düzgün (sabit renk kullanılmamış)
- [ ] Görseller sabit oranlı kapta, `object-cover`
- [ ] 375px'te yatay taşma yok
- [ ] 1920px'te içerik dağılmıyor, orantılı büyümüş
- [ ] `transition-all` kullanılmamış
- [ ] İçerik veri dizisinden üretiliyor (CMS'e hazır)
- [ ] Eleman sayısı değişse tasarım bozulmuyor
- [ ] Tek h1, semantik etiketler, canonical, görsellerde alt/width/height
- [ ] Metin doğal Türkçe, doldurma kalıp yok
- [ ] Kodda yorum satırı yok
- [ ] Safari/iOS'ta da çalışıyor (blur, maske, sticky, modal kilidi)
- [ ] Dokunmatikte hover yapışması yok, her işlev tıklamayla da erişilebilir
- [ ] Form alanları 16px+ (iOS zum yok), `100vh` yerine `min-h-ekran`
- [ ] Tarayıcıya özel API'ler `try/catch` + geri düşüşlü
