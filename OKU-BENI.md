# SunucumWEB — Next.js Sürümü

Orijinal sitenin **Next.js 15 (App Router) + Turbopack + React 19 + Tailwind CSS** ile birebir taşınmış hâli.

## ▶️ Çalıştırma

Önce ortam değişkenleri (bir kereye mahsus):
```bash
cp .env.example .env.local
```
`.env.local` içine Groq API anahtarınızı yazın → https://console.groq.com/keys

```bash
npm run dev
```
→ http://localhost:3000  (Turbopack + Tailwind watch birlikte çalışır)

Production build:
```bash
npm run build && npm start
```

> ⚠️ **`npm run build`'i dev server açıkken çalıştırmayın.** İkisi de `.next/` klasörünü
> kullanır; build, çalışan dev server'ın manifestlerini bozar ve site 500 verir.
> Olduysa: dev server'ı durdurun, `.next/` klasörünü silin, `npm run dev` ile yeniden başlatın.

## 🤖 Motorlar (engines)

Sitedeki her sistem `lib/engines/` altında **bağımsız bir modül**. Biri bozulduğunda ya da
kapatıldığında diğerleri etkilenmez. Kurallar ve şema: [`lib/engines/README.md`](lib/engines/README.md)

| Motor | Ne yapar | API ucu | Kapatma |
|---|---|---|---|
| `domain-ai` | Serbest metinle anlatılan işten alan adı önerir (Groq) | `POST /api/ai/domain-ideas` | `ENGINE_DOMAIN_AI=0` |
| `domain-availability` | Alan adı müsait mi (RDAP + DNS çift doğrulama) | `POST /api/domain/availability` | `ENGINE_DOMAIN_AVAILABILITY=0` |
| `product-finder` | 3 soruluk quiz → ürün önerisi (saf fonksiyon) | — | — |

Motorların durumu: **http://localhost:3000/api/health** (anahtar sızdırmaz, sadece "hazır mı" der).

### AI alan adı bulucu (`/alan-adi`)
Kullanıcı işini birkaç cümleyle anlatır → Groq (`openai/gpt-oss-120b`, katı JSON şeması ile)
8 öneri üretir → her öneri **RDAP + DNS** ile ayrı ayrı kontrol edilir → müsait olanlar üste sıralanır.

Modelden gelen her kayıt `domain-ai/schema.js` içinde temizlenir (Türkçe karakter, geçersiz uzantı,
tekrar, uzunluk). Yani model kurala uymasa bile ekrana **her zaman geçerli bir alan adı** çıkar.

`.tr` uzantılarının RDAP sunucusu **yoktur**; oralarda "Müsait" demek yerine dürüstçe
**"Kontrol edin"** gösterilir. (Bu kasıtlıdır — yanlış "müsait" demek kullanıcıyı yanıltır.)

### 🔑 Anahtar güvenliği
- `GROQ_API_KEY` **sadece** `lib/engines/ai/config.js` içinde okunur; o dosya `server-only`
  ile işaretli, yani yanlışlıkla bir client bileşenine sızarsa **build hata verir**.
- `.env.local` `.gitignore`'da. Anahtarı asla commit etmeyin.
- Canlıya çıkmadan önce Groq konsolundan mevcut anahtarı **iptal edip yenisini** üretin.

## 🧭 Mimari

| Katman | Dosya | Ne yapar |
|--------|-------|----------|
| Layout | `app/layout.jsx` | `<html>`, head (font/ikon CSS + Tailwind), Header + Footer, global scriptler |
| Route | `app/[[...slug]]/page.jsx` | Tek dinamik route → 18 sayfa. `generateStaticParams` + `generateMetadata` + JSON-LD |
| İçerik | `content/pages/*.html` | Her sayfanın gövdesi (orijinalden çıkarılmış, ham) |
| Header/Footer | `content/_header.html`, `_footer.html` | Ortak (18 sayfada aynı) |
| Render | `html-react-parser` | HTML'i birebir React'e çevirir (bozuk markup dahil) |
| Stil | `public/assets/css/style.css` + `public/inline-styles.css` + `public/tailwind.css` | Bu **sırayla** yüklenir → Tailwind en son (orijinal Play CDN sırası) |
| Etkileşim | `components/PageScripts.jsx`, `GlobalScripts.jsx`, `lib/runLegacy.js` | Orijinal `DOMContentLoaded` scriptlerini shim ile çalıştırır (mega menü, mobil menü, lucide) |

## 🎨 Stil cascade'i (önemli)

Orijinal site Tailwind'i **Play CDN**'den (en sonda) yüklüyordu → utility'ler her şeyi kazanıyordu.
Bunu birebir vermek için yükleme sırası: **style.css → inline-styles.css → tailwind.css (en son)**.
`tailwind.config.js`'te merge edilmiş custom renkler: `corporate`, `primary`, `dark` + `boxShadow`.

## 🔄 İçeriği yeniden üretme

Orijinal `../sunucumweb-original/` mirror'ından içerik + stilleri yeniden çıkarmak için (proje kökünde):
```bash
python _generator.py
```
Bu; `content/`, `public/inline-styles.css` ve `manifest.json`'ı yeniden yazar. Sonra `npm run dev:css` Tailwind'i günceller.

## 📌 Durum

- ✅ 18 sayfa, içerik **birebir** (metin karakteri karakterine aynı)
- ✅ Ana sayfa render'ı orijinalle ~%0.2 (neredeyse pixel-perfect)
- ✅ Header/footer/mega menü/mobil menü/ikonlar çalışıyor
- ✅ Fontlar (Poppins), renkler, SEO meta + JSON-LD korundu
- ⏳ Bazı ürün sayfalarında ufak dikey spacing farkı (~%10) — ince ayar gerektirebilir
- ⏳ `alan-adi` / `transfer` (WiseCP panel sayfaları) ayrı ele alınacak
