# Tasarım Altın Kuralları

> Bu dosya bağlayıcıdır. Siteye eklenen **her yeni bölüm, bileşen ve sayfa** bu üç
> kuralı sağlamak zorundadır. CMS geldiğinde de bu kurallar geçerli olacak.

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

## Bölüm bitince kontrol listesi

- [ ] Açık modda düzgün
- [ ] Koyu modda düzgün (sabit renk kullanılmamış)
- [ ] Görseller sabit oranlı kapta, `object-cover`
- [ ] 375px'te yatay taşma yok
- [ ] 1920px'te içerik dağılmıyor, orantılı büyümüş
- [ ] `transition-all` kullanılmamış
