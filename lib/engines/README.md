# Motorlar (engines)

Sitedeki her "sistem" burada **bağımsız bir motor**. Amaç: bir motor bozulduğunda
ya da değiştiğinde diğerlerinin etkilenmemesi.

## Klasör yapısı

```
lib/engines/
  index.js                  -> motor kayıt defteri (registry) + durum bilgisi
  core/                     -> ortak altyapı (motor DEĞİL, sadece yardımcı)
    result.js               -> ok() / fail() standart sonuç tipi
    http.js                 -> timeout + retry'lı fetch
    ratelimit.js            -> IP başına istek limiti
    text.js                 -> Türkçe metin normalizasyonu, slug
  ai/                       -> AI taşıma katmanı (SADECE Groq ile konuşur)
    config.js               -> env okuma, model seçimi
    groq.js                 -> chatJSON() / chatText()
  domain-ai/                -> MOTOR: niyet metninden alan adı önerir
  domain-availability/      -> MOTOR: alan adı müsait mi (RDAP + DNS)
  product-finder/           -> MOTOR: 3 soruluk quiz -> ürün önerisi
```

## Kurallar

1. **Motorlar birbirini import ETMEZ.** Sadece `core/` ve (AI kullananlar) `ai/`
   katmanını kullanabilir. İki motorun sonucu birleşecekse bunu API route'u ya da
   UI yapar — motorlar birbirinden habersizdir.
2. **Her motor tek bir giriş noktası verir** (`index.js`) ve her zaman
   `{ ok: true, data }` veya `{ ok: false, error: { code, message } }` döner.
   Motorlar `throw` etmez; hata da bir dönüş değeridir.
3. **Bir motorun kapalı olması siteyi bozmaz.** `.env` içindeki
   `ENGINE_*=0` ile kapatılır; UI o bölümü gizler, sayfanın kalanı çalışır.
4. **Sır (API key) sadece sunucuda.** `ai/config.js` dışında hiçbir yerde
   `process.env.GROQ_API_KEY` okunmaz; client bileşenleri asla erişemez.
5. **Motor eklerken:** klasörünü aç, `index.js` yaz, `engines/index.js`
   kayıt defterine bir satır ekle. Başka hiçbir dosyaya dokunma.

## Mevcut motorlar

| Motor | Giriş | Dış bağımlılık | Kapatma anahtarı |
|---|---|---|---|
| `domain-ai` | `suggestDomains({ brief, count, tlds })` | Groq API | `ENGINE_DOMAIN_AI` |
| `domain-availability` | `checkDomains(domains)` | RDAP + Cloudflare DoH | `ENGINE_DOMAIN_AVAILABILITY` |
| `product-finder` | `recommend(answers)` | yok (saf fonksiyon) | — |
| `theme` | `applyTheme(t)` / `toggleTheme()` | yok (localStorage) | — |
| `cart` | `cartReducer(items, action)` | yok (localStorage) | — |
| `scroll-lock` | `scrollKilitle()` → çözme fonksiyonu | yok | — |

## Kaydırma kilidi (scroll-lock)

Modal/panel açıkken arkadaki sayfa kaymasın diye kullanılır. İki sebeple ayrı motor:

1. **iOS Safari**, `document.body.style.overflow = 'hidden'` ile durmaz; gövdeyi
   `position: fixed` + `top: -scrollY` yapıp kapanışta eski konuma dönmek gerekir.
2. Aynı anda birden fazla katman açılabiliyor (mobil menü + sepet). Motor
   **sayaç** tutar; kilidi ilk açan kurar, sonuncusu kaldırır — biri kapanınca
   diğeri açıkken sayfa serbest kalmaz.

```jsx
useEffect(() => { if (acik) return scrollKilitle(); }, [acik]);
```

## Tema (açık / koyu)

Renkler `app/globals.css` içinde **CSS değişkeni** olarak tanımlı; bileşenler
`bg-surface`, `text-body`, `border-line` gibi **semantik** sınıfları kullanır.
Bu yüzden koyu mod için ayrı bir `dark:` sınıfı yazmaya gerek yoktur — değişkenler değişir, her şey uyar.

> **Sabit hex/`bg-white`/`text-slate-600` KULLANMAYIN.** Koyu modda metin kaybolur.
> Tabloya bakın: `bg-white`→`bg-surface`, `text-ink`→`text-strong`,
> `text-slate-600`→`text-body`, `text-slate-400`→`text-muted`, `border-slate-100`→`border-line`,
> `bg-brand-50`→`bg-brandsoft`, `text-brand-600`→`text-brandtext`.

> ⚠️ **Chromium tuzağı:** `background-color`'ı `var()` ile gelen bir elemana
> `transition` verilirse, tema değişince renk **eski değerde donup kalır**.
> Bu yüzden `applyTheme()` geçiş sırasında `html.tema-kilit` ile tüm
> `transition`'ları kapatır. Bir eleman tema değişince eski renginde kalıyorsa
> sebebi neredeyse kesinlikle üzerindeki `transition-all`'dur.

## Sepet

`CartProvider` (SiteShell içinde) durumu tutar, `localStorage`'a yazar ve sekmeler
arasında `storage` olayıyla senkron kalır. Ödeme WiseCP panelinde tamamlanır.

> `useCart()` yalnızca `CartProvider` **ağacının içinden** çağrılabilir. Sayfa
> bileşenleri (`HomePage`, `ProductPage`) `SiteShell`'in *üstünde* olduğu için orada
> `useCart()` boş döner — bu yüzden "Sepete Ekle" ayrı bir bileşendir
> (`components/site/AddToCartButton.jsx`).
