# Demo sunucuya taşıma — Bunny Magic Containers

## Önce netleştirelim: FTP gerekmiyor

**Bunny Magic Containers FTP kabul etmez.** Dosya yüklemez, **Docker imajı çeker.**
Yani "FTP hesabı açıp dosya atmak" bu platformda mümkün değil — o yüzden FTP
adımlarına gerek kalmadı.

Şu an demo adresinde çalışan şey bizim sitemiz değil, Bunny'nin hazır örnek
şablonu (`jamie-at-bunny/mc-template-nextjs-with-postgres`). Onu bizim imajımızla
değiştireceğiz.

**Bu makinede Docker kurulu değil** — kurmana da gerek yok. İmajı **GitHub derleyecek.**

Akış şöyle:

```
Kod  →  GitHub  →  GitHub Actions imajı derler  →  GHCR  →  Bunny çeker  →  Yayında
       (sen)         (otomatik)                              (sen ayarlarsın)
```

---

## Hazırlık tamam ✅

Bunlar bende bitti, senin yapman gereken yok:

- `Dockerfile` yazıldı (Node 20, standalone çıktı, root olmayan kullanıcı, sağlık kontrolü)
- `.github/workflows/docker-imaj.yml` — GitHub Actions otomasyonu
- Git deposu başlatıldı, ilk commit atıldı (dal: `main`, 31 MB)
- **Sızıntı kontrolü yapıldı:** `.env.local` commit'e girmiyor, Groq anahtarı depoda yok
- Üretim paketi yerelde test edildi: tüm sayfalar 200, AI alan adı bulucu çalışıyor

---

## SENİN ADIMLARIN — hiçbir şey kurmana gerek yok

Bilgisayarda **Git Credential Manager zaten kurulu** (v2.7.3), o yüzden
GitHub CLI vs. kurmana gerek yok. Sadece tarayıcıdan onay vereceksin.

### 1. ✅ TAMAMLANDI — Depo açıldı ve kod gönderildi

Depo: https://github.com/yetkinbulutnet-ops/sunucumweb (private, 3 commit, dal `main`)
Push başarılı; GitHub Actions imajı derlemeye otomatik başladı.

### 2. İmaj paketini herkese açık yap

Actions bitince (~3-5 dk) GitHub'da imaj oluşur. Bunny'nin onu çekebilmesi için:

Önce derlemenin bittiğini gör: https://github.com/yetkinbulutnet-ops/sunucumweb/actions
(yeşil tik ✅ = hazır, ~3-5 dk sürer)

Sonra paketler sayfası (hesap **kullanıcı** tipinde, /orgs/ DEĞİL):
https://github.com/yetkinbulutnet-ops?tab=packages
→ `sunucumweb` paketi → sağdaki **Package settings** → en altta
**Danger Zone → Change visibility** → **Public** → paket adını yazıp onayla

> Depo (repo) gizli kalabilir, sorun değil. Sadece **imaj paketi** herkese açık olmalı
> ki Bunny "GitHub Public" seçeneğiyle kimlik doğrulamadan çekebilsin.

### 3. Bunny'de imajı değiştir

Bunny paneli → `sunucumweb-demo` → **Container settings** → `app` kutusunda **Edit**:

| Alan | Yeni değer |
|---|---|
| Registry | `GitHub Public` (zaten öyle) |
| Image | `yetkinbulutnet-ops/sunucumweb:latest` |

> Tamamı küçük harf. Actions'ın çıktı özetinde de aynısı yazar.

**Environment variables** → mevcut olanı sil, şunları ekle:

```
GROQ_API_KEY = (yeni üreteceğin Groq anahtarı)
NODE_ENV     = production
```

### 4. Veritabanı konteynerini sil

`db` kutusundaki **Delete** → sil. (Şablondan gelen Postgres; bizim sitede veritabanı yok.)
Altındaki **Volume 1 / data** da onunla birlikte gider.

### 5. Kaydet

Alttaki **Save Changes**. Bunny imajı çekip yeniden başlatır (~1-2 dk).
`sunucumwebdemo.yetkin.web.tr` artık bizim site.

> Endpoint zaten doğru: **public port 3000**, bizim konteyner de 3000'i dinliyor.
> Orayı değiştirmene gerek yok.

---

## Kontrol listesi (yayına girdikten sonra)

Tarayıcıda `sunucumwebdemo.yetkin.web.tr` açıp:

- [ ] Ana sayfa geliyor, hero slider dönüyor
- [ ] Üst menüde telefon / ağ durumu / müşteri girişi / tema anahtarı var
- [ ] Tema anahtarı açık↔koyu geçiş yapıyor
- [ ] Sepete ekle → sepet çekmecesi açılıyor, toplam hesaplanıyor
- [ ] `/alan-adi` → AI alan adı bulucu öneri üretiyor *(Groq anahtarı doğruysa)*
- [ ] `sunucumwebdemo.yetkin.web.tr/robots.txt` → `Disallow: /` yazıyor
- [ ] `sunucumwebdemo.yetkin.web.tr/api/health` → üç motor da `"ready": true`

Sonra revize listeni çıkar, sırayla halledelim.

---

## Arama motorlarına kapalı (demo) 🔒

Üç katman birden aktif — bot hangisine bakarsa baksın demo indexlenmez:

| Katman | Değer |
|---|---|
| `robots.txt` | `User-Agent: * / Disallow: /` |
| HTML meta | `<meta name="robots" content="noindex, nofollow, nocache">` |
| HTTP başlığı | `X-Robots-Tag: noindex, nofollow, noarchive, nosnippet` |

**Canlıya geçerken:** GitHub → Actions → *Docker imajı derle ve yayınla* →
**Run workflow** → `site_indexable` = **1** seç → çalıştır. Üçü birden otomatik açılır.
Kodda hiçbir yeri elle değiştirmen gerekmez.

---

## Sonradan güncelleme nasıl olacak

Ben kodda değişiklik yapıp commit ettikten sonra:

```bash
git push
```

Actions otomatik derler → Bunny panelinde `app` konteynerini **Restart** et → yeni sürüm yayında.

---

## Ek: cPanel + FTP yolu (şu an kullanılmıyor)

İleride Bunny yerine kendi cPanel sunucunda barındırmak istersen:

1. cPanel'de **Setup Node.js App** olmalı (yoksa bu yol çalışmaz)
2. `../sunucumweb-demo.zip` (54 MB) hazır bekliyor — yüklenmeye hazır üretim paketi
3. FTP hesabı açarsın (ana cPanel hesabını değil, klasöre kısıtlı ayrı bir hesap)
4. Şifreyi **sohbete yazma** — `SunucumWEB Site\ftp-bilgileri.txt` dosyasına yaz, ben okurum
5. Zip'i ben yüklerim, sen Dosya Yöneticisi'nden **Extract** edersin
6. Setup Node.js App → startup file `server.js`, env `GROQ_API_KEY`, Node 20

> Bu yolu seçmezsek `sunucumweb-deploy/` klasörünü ve zip'i silebilirsin (156 MB yer kaplıyor).
