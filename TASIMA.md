# Demo sunucuya taşıma

## Önce bilinmesi gereken

Bu bir **Next.js uygulaması**, düz HTML sitesi değil. Çalışması için sunucuda
**Node.js** olmak zorunda. Dosyaları `public_html`'e atıp açmak işe yaramaz —
AI alan adı bulucu, sepet ve sayfa yönlendirmeleri Node sunucusu üzerinden çalışır.

Bu yüzden iki geçerli yol var:

| Yol | Nasıl çalışır | FTP? | Gereken |
|---|---|---|---|
| **A. cPanel + Node.js App** | Dosyalar yüklenir, cPanel Node uygulaması olarak çalıştırır | ✅ Evet | cPanel'de "Setup Node.js App" bölümü |
| **B. Bunny Magic Containers** | Docker imajı çekilir (şu an demo böyle çalışıyor) | ❌ Hayır | Docker imajı + registry |

> **Şu anki durum:** `sunucumwebdemo.yetkin.web.tr` adresi Bunny Magic Containers'a
> bağlı ve orada Bunny'nin hazır şablonu (`mc-template-nextjs-with-postgres`) çalışıyor —
> yani bizim sitemiz değil, örnek uygulama.

---

## Hazır paket

`../sunucumweb-demo.zip` (54 MB) — yüklenmeye hazır üretim paketi. İçinde:

```
server.js        -> Node sunucusu (giriş dosyası)
.next/           -> derlenmiş uygulama
node_modules/    -> sadece gereken paketler (hazır, npm install gerekmez)
public/          -> görseller, CSS, fontlar
content/         -> sayfa içerikleri
.env.ORNEK       -> tanımlanacak ortam değişkenleri
```

Yerelde üretim modunda test edildi: tüm sayfalar 200, `robots.txt` doğru,
AI alan adı bulucu Groq'a bağlanıp öneri üretti.

---

## A YOLU — cPanel + FTP (adım adım)

### 1. cPanel'de Node.js desteği var mı bak
cPanel → arama kutusuna **"Node"** yaz.
- **"Setup Node.js App"** çıkıyorsa ✅ devam et.
- Çıkmıyorsa ❌ bu yol olmaz → B yoluna geç veya hosting firmasından Node.js desteği iste.

### 2. Klasörü oluştur
cPanel → **Dosya Yöneticisi** → ana dizinde (`/home/kullanici/`) yeni klasör: `sunucumweb-demo`

> `public_html` içine DEĞİL, onun dışına. Node uygulamasının kaynak dosyaları
> web kökünde durmamalı (güvenlik).

### 3. FTP hesabı aç (bana vereceğin hesap)
cPanel → **FTP Hesapları** → *FTP Hesabı Ekle*:

| Alan | Değer |
|---|---|
| Kullanıcı adı | `deploy` |
| Şifre | Güçlü bir şifre üret (cPanel'in üreticisini kullan) |
| Dizin | `/home/KULLANICI/sunucumweb-demo` |
| Kota | Sınırsız |

**Neden ayrı hesap:** Ana cPanel şifreni verme. Bu hesap sadece o klasörü görür,
işi bitince tek tıkla silinir.

### 4. Bilgileri bana ver — sohbete YAZMADAN
Şifreyi sohbete yapıştırma (geçmişte kalır). Bunun yerine şu dosyayı oluştur:

`C:\Users\alike\Desktop\SunucumWEB Site\ftp-bilgileri.txt`

```
HOST=ftp.alanadi.com
USER=deploy@alanadi.com
PASS=sifre
PORT=21
DIZIN=/
```

Sonra bana "dosyayı oluşturdum" de. Ben okuyup yüklemeyi yapacağım.
İş bitince o dosyayı silersin, FTP hesabını da cPanel'den kaldırırsın.

### 5. Ben yükleyeceğim
`sunucumweb-demo.zip` dosyasını FTP ile klasöre atacağım.

### 6. Sen açacaksın (FTP zip açamaz)
Dosya Yöneticisi → `sunucumweb-demo` klasörü → zip'e sağ tık → **Extract**.

### 7. Node uygulamasını kur
cPanel → **Setup Node.js App** → *Create Application*:

| Alan | Değer |
|---|---|
| Node.js version | 20.x (en yüksek 18+) |
| Application mode | Production |
| Application root | `sunucumweb-demo` |
| Application URL | demo alan adın |
| Application startup file | `server.js` |

**Environment variables** (Add Variable ile tek tek):
```
GROQ_API_KEY = (yeni üretilecek anahtar)
SITE_INDEXABLE = 0
NODE_ENV = production
```

Sonra **Restart**. `npm install` çalıştırmana gerek yok — paketler hazır geliyor.

### 8. DNS'i çevir
Demo alan adı şu an Bunny'ye bakıyor. cPanel → **Bölge Editörü** → A kaydını
sunucunun IP'sine çevir. (Yayılması 5–30 dk.)

---

## B YOLU — Bunny Magic Containers

Bunny FTP kabul etmez, **Docker imajı** çeker. Bu makinede Docker kurulu değil,
o yüzden iki alt seçenek var:

1. **Docker Desktop kur** → `docker build` + registry'e push → Bunny'de imajı değiştir.
2. **GitHub üzerinden** → kodu GitHub'a at → GitHub Actions imajı derleyip
   GHCR'ye pushlar → Bunny'de o imajı göster. (Bu makinede Docker gerekmez.)

`Dockerfile` hazır ve projede duruyor; hangisini seçersen adımları veririm.

---

## Arama motorlarına kapalı (demo)

Üç katman birden aktif — bot hangisine bakarsa baksın demo indexlenmez:

1. `robots.txt` → `Disallow: /`
2. HTML `<meta name="robots" content="noindex, nofollow, nocache">`
3. HTTP başlığı → `X-Robots-Tag: noindex, nofollow, noarchive, nosnippet`

**Canlıya geçerken:** ortam değişkenini `SITE_INDEXABLE=1` yapıp yeniden build al.
Üçü birden otomatik açılır. Başka hiçbir yeri değiştirmen gerekmez.
