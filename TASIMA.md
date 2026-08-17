# Demo yayında — kendi sunucumuzda

**Adres:** https://sunucumweb.demo.yetkin.web.tr
**Durum:** ✅ çalışıyor · SSL geçerli · arama motorlarına kapalı

Bunny Magic Containers bırakıldı (platform tarafında çözülemeyen 500 hatası).
Site artık kendi VPS'imizde, Docker konteyneri olarak çalışıyor.

---

## Kurulum haritası

| Ne | Nerede |
|---|---|
| Sunucu | `45.196.28.7` · Ubuntu 22.04 · 10 CPU / 19 GB RAM / 154 GB boş |
| SSH | `ssh -i cpanel_key -p 6060 ali@45.196.28.7` |
| Panel | CloudPanel (site: `sunucumweb-demo`) |
| Konteyner | `sunucumweb-demo` → `ghcr.io/yetkinbulutnet-ops/sunucumweb:latest` |
| Port | `127.0.0.1:3975` → konteyner içi 3000 (dışarıya **kapalı**, sadece nginx erişir) |
| nginx | `/etc/nginx/sites-enabled/sunucumweb.demo.yetkin.web.tr.conf` (CloudPanel yönetiyor) |
| SSL | `/etc/nginx/ssl-certificates/` · Let's Encrypt · 14 Kasım 2026'ya kadar |
| Ortam değişkenleri | `/etc/sunucumweb-demo.env` (chmod 600, sadece root) |
| Kaynak sınırı | 1 GB RAM / 2 CPU (sunucunun geri kalanını koruma altına alır) |
| Yeniden başlatma | `--restart unless-stopped` (sunucu yeniden açılınca kendi kalkar) |

> **Aynı makinede canlı servisler var:** Mailu mail sunucusu (7 konteyner), CloudPanel,
> MySQL, PostgreSQL, Redis, başka Next.js siteleri. Hiçbirine dokunulmadı.
> Port 3000 başka bir siteye ait (webmail) — karıştırma.

---

## Güncelleme (bundan sonraki akış)

Ben kodda değişiklik yapıp `git push` ediyorum → GitHub Actions imajı derliyor (~3 dk) →
sonra sunucuda tek komut:

```bash
sudo sunucumweb-guncelle
```

Bu script: yeni imajı çeker, değişiklik yoksa hiçbir şey yapmaz, varsa konteyneri
değiştirir, sağlık kontrolünden geçirir. Geçemezse logları basar.

---

## Faydalı komutlar

```bash
sudo docker ps --filter name=sunucumweb-demo          # durum
sudo docker logs -f --tail 100 sunucumweb-demo        # canlı log
sudo docker restart sunucumweb-demo                   # yeniden başlat
curl -s localhost:3975/api/health                     # motor durumu
```

---

## Google yorum rozeti (footer) — otomatik güncelleme

Footerdaki puan/yorum sayısı **Google Places API'den** çekilir, sunucudaki cron
15 dakikada bir tazeler. Kullanıcı sayfayı açtığında hazır değeri görür; sekme
açık kalırsa 5 dakikada bir kendi de yeniler.

| Parça | Yer |
|---|---|
| Motor | `lib/engines/google-reviews/` (15 dk bellek önbelleği, son iyi değeri korur) |
| Rozet ucu | `GET /api/google-reviews` (herkese açık, 5 dk tarayıcı önbelleği) |
| Cron ucu | `GET /api/cron/yorumlar` (`x-cron-token` başlığı ile korumalı) |

**Gerekli ortam değişkenleri** (`/etc/sunucumweb-demo.env`):

```
GOOGLE_PLACES_API_KEY=...      # Google Cloud > Places API (New)
GOOGLE_PLACE_ID=               # boş bırakılırsa işletme adından otomatik bulunur
GOOGLE_PLACE_ADI=SunucumWEB
CRON_TOKEN=...                 # crontab satırındaki değerle aynı
GOOGLE_PUAN=4.8                # API erişilemezse gösterilecek yedek
GOOGLE_YORUM_ADEDI=327
```

**Crontab (root):**

```
*/15 * * * * curl -s -m 20 -H "x-cron-token: <CRON_TOKEN>" http://127.0.0.1:3975/api/cron/yorumlar >> /var/log/sunucumweb-yorum.log 2>&1
```

Durum kontrolü — `durum.hata` alanı neden canlı olmadığını söyler
(`ANAHTAR_YOK`, `ISLETME_BULUNAMADI`, `DETAY_*`):

```bash
curl -s -H "x-cron-token: <CRON_TOKEN>" http://127.0.0.1:3975/api/cron/yorumlar
```

> API anahtarı yoksa site bozulmaz: rozet `GOOGLE_PUAN` / `GOOGLE_YORUM_ADEDI`
> yedek değerlerini gösterir ve `canli: false` döner.

---

## Doğrulanan testler (canlı)

- Tüm sayfalar HTTP 200 (`/`, `/alan-adi`, `/sanal-sunucu`, `/iletisim`, `/hakkimizda`, `/transfer`, `/whois`, yasal sayfalar)
- SSL: `CN=sunucumweb.demo.yetkin.web.tr`, Let's Encrypt, geçerli
- `/api/health` → üç motor da `ready: true`
- AI alan adı bulucu: **2.1 saniyede** 6 öneri üretti (`openai/gpt-oss-120b`)
- Müsaitlik motoru: RDAP + DNS çalışıyor, `.com.tr`'de dürüstçe "bilinmiyor" diyor
- `robots.txt` → `Disallow: /` · `X-Robots-Tag: noindex, nofollow, noarchive, nosnippet`
- Mailu mail konteynerleri etkilenmedi

---

## Arama motorlarına kapalı 🔒

Üç katman aktif: `robots.txt`, HTML meta, HTTP başlığı.

**Canlıya geçerken:** GitHub → Actions → *Docker imajı derle ve yayınla* →
**Run workflow** → `site_indexable` = **1** → çalıştır → sunucuda `sudo sunucumweb-guncelle`.

---

## Yapılacaklar

- [ ] Demo incelenip revize listesi çıkarılacak
- [ ] Fiyat / iletişim metinleri gerçekleriyle değiştirilecek
- [ ] Groq anahtarı canlıya çıkmadan yenilenecek (`/etc/sunucumweb-demo.env` + Actions)
- [ ] SEO ayarları (canlı domaine geçerken)
- [ ] CMS eklenmesi
- [ ] `public/` içindeki eski siteden kalma kullanılmayan 48 MB varlık temizlenecek
