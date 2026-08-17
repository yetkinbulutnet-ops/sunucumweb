# Devam notu — yeni sohbete başlarken oku

Bu dosya, önceki oturumun sonunda yazıldı. Yeni sohbette önce bunu, sonra
`TASARIM-KURALLARI.md` ve `lib/engines/README.md` dosyalarını oku.

---

## Şu ana kadar biten işler

| Bölüm | Durum |
|---|---|
| Ana sayfa, header, mega menü, footer | Bitti |
| Şirket Profili (`/hakkimizda`) | Bitti — gerçek kabin fotoğraflarıyla deste slaytı |
| Legal (`/legal`) | Bitti — sözleşmeler + ticari bilgiler tek sayfada |
| İletişim (`/iletisim`) | Bitti — gerçek form + mesai rozeti + sosyal medya |
| Araçlar (`/araclar`) | 5 araç çalışıyor: DNS, WHOIS, SSL, e-posta, IP |
| Google yorum rozeti | Altyapı hazır, API anahtarı bekliyor (4,9 / 69 elle girili) |
| 7 altın kural | `TASARIM-KURALLARI.md` içinde, 7.si tarayıcı/OS uyumu |
| Yumuşak kaydırma (Lenis) | Bitti — sadece fare/trackpad, dokunmatikte kapalı |
| **Ürün sayfaları** | **YAPILMADI** — 12 sayfa hâlâ eski `ProductPage.jsx` şablonunda |

---

## Sıradaki iş: araçları rakip seviyesine çıkarmak

Kullanıcının kendi DNS projesi **dnschecker.website** referans alınacak.
Kaynak kodun bir kopyası indirildi: `../dnschecker-referans/` (git dışında).

### O projeden alınacak sistem

1. **Kayıt tipi seçici** — `config.php:11`
   ```php
   $RECORD_TYPES = ['A','AAAA','MX','NS','TXT','CNAME','SOA','PTR','SRV','CAA'];
   ```
   Bizim DNS aracımız şu an hepsini birden sorguluyor. Rakipler gibi
   **tip seçmeli** hâle gelmeli (varsayılan A), "hepsi" seçeneği de kalsın.

2. **SEO için URL şeması** — asıl kopyalanacak fikir bu:
   ```
   /{dil}/{alan-adi}/{tip}     ->  /tr/google.com/mx
   ```
   Her alan adı + tip kombinasyonu **ayrı indekslenebilir URL**, kendi
   `<title>` ve açıklamasıyla: `google.com (MX) DNS Records — DNS Checker`.
   Yanlış biçimli istekler 301 ile normalize ediliyor (`config.php:44-56`).

   Bizde karşılığı: `/araclar/dns/{alan}/{tip}` — `generateMetadata` ile
   dinamik başlık/açıklama, canonical. Uzun kuyruk trafiğinin tamamı buradan
   geliyor, en yüksek getirili iş bu.

3. **Tip başına açıklama içeriği** — `index.php:106`, dil dosyasında
   `rec_a_desc`, `rec_mx_desc` … Her tip için 2-3 cümle SEO metni.

4. **Sorgu geçmişi** — localStorage'da son sorgular (`historyRead/Write`).

5. Çoklu dil (en/tr/de/ru) — bizde şimdilik gerekmiyor, ileride düşünülür.

### O projeden ALINMAYACAKLAR
- reCAPTCHA ile sorgu kapısı (bizde IP başına oran sınırı var, yeterli)
- Discord webhook bildirimi, ip-api.com geo çağrısı
- `checks.json` dosyasına log yazma (bizde gerekmiyor)

> ⚠️ İndirilen `dnschecker-referans/api.php` içinde **canlı Discord webhook
> adresi ve reCAPTCHA gizli anahtarı** düz metin duruyor. Klasör git dışında;
> oraya dokunma, kopyalarken bu satırları taşıma. Kullanıcıya o anahtarları
> yenilemesi söylendi.

### Rakiplerden bakılıp eklenecek araçlar (kullanıcı istedi)
- Blacklist / RBL kontrolü (MX IP'leri kara listede mi)
- HTTP durum + güvenlik başlıkları (SSRF koruması `core/ag.js` ile şart)
- DNS yayılım haritası (şu an 4 çözümleyici var, dünya geneline çıkarılabilir)
- Port durumu (yalnız yaygın portlar, oran sınırlı — kötüye kullanım riski var)
- Alan adı yaş/otorite özeti

---

## Bekleyen, kullanıcıdan gelmesi gerekenler

| Konu | Ne lazım |
|---|---|
| Google yorum rozeti | Places API (New) anahtarı → `/etc/sunucumweb-demo.env` |
| İletişim formu | SMTP hesabı (Mailu aynı makinede) — şu an mesajlar sunucu günlüğüne yazılıyor, kalıcı değil |
| Sosyal medya | Gerçek hesap adresleri (Instagram `sunucumwebb`, diğerleri tahminî) |
| Fiyatlar, rakamlar | %99.9 / 10.000+ / <5dk ve tüm paket fiyatları temsilî |
| Groq anahtarı | Canlıya çıkmadan yenilenecek |
| public/ temizliği | Eski siteden kalan ~48 MB kullanılmayan varlık |

### Kendi alan adında bulunan iki gerçek sorun
- **DMARC kaydı yok** → `_dmarc.sunucumweb.com TXT "v=DMARC1; p=none; rua=mailto:..."` ile başlanmalı
- **SPF `~all`** → katıya (`-all`) çekilmeli
Kullanıcı isterse kayıtlar çıkarılacak.

---

## Mimari hatırlatmalar

- Motorlar `lib/engines/` altında, **birbirini import etmez**, ortak şeyler
  `core/` içinde (`http`, `ratelimit`, `result`, `rdap`, `whois43`, `ag`, `flags`).
- `core/ag.js` özel ağ süzgeci: kullanıcıdan gelen hedeflerde **zorunlu**.
  Yoksa araçlar iç ağ taramasında kullanılır.
- Sunucuda **IPv6 çıkışı yok** (`ENETUNREACH`). Giden bağlantılarda IPv4
  adresine bağlan (SSL aracında yapıldı), yoksa zaman aşımına düşer.
- Yeni Tailwind sınıfı eklediysen `npm run build:css` çalıştır, yoksa sınıf
  derlenmemiş olur (birkaç kez tuzağa düştük).
- Tarayıcı panelinde ekran görüntüsü yok; doğrulama DOM üzerinden
  (`mcp__Claude_Browser__javascript_tool`). Pane gizliyken `requestAnimationFrame`
  durur ve lazy görseller yüklenmez — "çalışmıyor" sanma.
- Tema değişimini elle `classList.toggle('dark')` ile test etme; `tema-kilit`
  devreye girmediği için renkler donuyor, gerçek düğmeyi kullan.

## Çalıştırma ve yayınlama

```bash
cd "C:\Users\alike\Desktop\SunucumWEB Site\sunucumweb-next"
npm run dev
```

Yayın: `git push` → GitHub Actions imajı derler (~4 dk) → sunucuda
`sudo sunucumweb-guncelle`. Ayrıntı `TASIMA.md` içinde.
