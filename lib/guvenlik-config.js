/**
 * SunucumWEB güvenlik geçişi — herkese açık sabitler.
 * Bu dosya hem istemcide (TurnstileGecis) hem sunucuda kullanılır;
 * içinde sır YOKTUR (site anahtarı zaten herkese açıktır).
 */

// Geçiş kartı çerezinin adı
export const COOKIE_ADI = 'swb_gecis';

// Kart geçerlilik süresi (saniye) — 7 gün
export const GECERLILIK_SN = 60 * 60 * 24 * 7;

// Cloudflare Turnstile herkese açık SİTE anahtarı (gizli değildir)
export const TURNSTILE_SITE_KEY = '0x4AAAAAAEaLeNP8lyAJHHBm';

// Middleware'in şüpheli trafiği yönlendirdiği güvenlik (challenge) sayfası
export const GUVENLIK_YOLU = '/guvenlik';

// Tamamen engellenen IP'lerin gördüğü sayfa (geçiş yok)
export const BLOK_YOLU = '/engellendi';
