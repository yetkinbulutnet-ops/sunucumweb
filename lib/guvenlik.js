/**
 * SunucumWEB güvenlik geçişi — sunucu yardımcıları.
 * ÖNEMLİ: Hem Edge middleware'de hem Node route handler'da çalışır; bu yüzden
 * SADECE Web Crypto (crypto.subtle) kullanır, node:crypto DEĞİL.
 */

export { COOKIE_ADI, GECERLILIK_SN, TURNSTILE_SITE_KEY, GUVENLIK_YOLU, BLOK_YOLU } from './guvenlik-config';

// Tamamen engellenen IP'ler (challenge YOK, direkt engel ekranı). Elle yönetilir.
export const BLOKLU_IP = new Set([
  // engellenecek IP'ler buraya eklenir (ör: '1.2.3.4')
]);

// Tamamen engellenen ASN'ler (bilinen kötüye kullanım/bulletproof). Elle yönetilir.
export const BLOKLU_ASN = new Set([
  // örnek: 44477 (Stark Industries) — istenirse eklenir
]);

/* ---------------------------------------------------------------
   DATACENTER / HOSTING / VPN ASN listesi.
   YALNIZ açık bulut/hosting/VPN sağlayıcıları — residential ISP YOK
   (yoksa gerçek müşteri engellenir). Doğrulanmış Google/Bing/Yandex
   botları iyiBotMu() ile bu kontrolden ÖNCE muaf tutulur.
   --------------------------------------------------------------- */
export const DATACENTER_ASN = new Set([
  16509, 14618, 8987, 62785,        // Amazon AWS
  15169, 396982, 19527, 139070,     // Google Cloud
  8075, 8068, 8069, 12076, 45139,   // Microsoft Azure
  14061,                            // DigitalOcean
  16276, 35540,                     // OVH
  24940, 213230, 212317,            // Hetzner
  20473, 64515,                     // Vultr / Choopa / The Constant Company
  63949,                            // Akamai Linode
  51167,                            // Contabo
  45102, 37963, 45103, 134963,      // Alibaba
  132203, 45090, 137876,            // Tencent
  46606,                            // Unified Layer
  26496, 398101, 30083, 44273,      // GoDaddy / Hosting Services
  8560,                             // IONOS 1&1
  197540,                           // netcup
  62240,                            // Clouvider
  210644, 401120,                   // AEZA
  35916,                            // Multacom
  53667,                            // FranTech / BuyVM / PONYNET
  40676,                            // Psychz
  30633, 60781,                     // Leaseweb US / NL
  19318,                            // Interserver
  32748,                            // Steadfast
  9009,                             // M247 (VPN + hosting)
  49505,                            // Selectel
  44477,                            // Stark Industries
  62904,                            // Eonix
  25820,                            // IT7
  36352,                            // ColoCrossing
  26347,                            // DreamHost
  22612,                            // Namecheap
  54290,                            // Hostwinds
  55293,                            // A2 Hosting
  46475,                            // Limestone
  29802,                            // Hivelocity
  3223,                             // Voxility
  60068, 212238,                    // Datacamp / CDN77
  136787,                           // TEFINCOM (NordVPN)
  9370, 206092,                     // Sakura / IPXO
  51852,                            // Private Layer
  399629, 210630,                   // BL Networks / VPN
  47583,                            // Hostinger
  39572,                            // AdvancedHosting
  20860,                            // Iomart
  12695,                            // DINET (proxy)
  394711, 63023,                    // Limenet / GTHost
  200019,                           // Alexhost
  // VPN / proxy sağlayıcıları + ek hosting
  209103,                           // Proton AG (ProtonVPN)
  39351,                            // 31173 Services (Mullvad)
  51396,                            // Pfcloud (VPN)
  8100,                             // QuadraNet
  33182,                            // HostDime
  46562,                            // Total Server Solutions
  55286,                            // B2 Net / ServerMania
  46844,                            // Sharktech
  62744,                            // QuickPacket
  42708,                            // GleSYS / Portlane
  396356,                           // Latitude.sh
  199524,                           // Gcore
  34549,                            // Meerfarbig
  24961,                            // myLoc / webtropia
  47447,                            // 23Media
  63473,                            // HostHatch
  44066,                            // First Colo
  20773,                            // Host Europe
  133199,                           // Sharktech Asia
  32475,                            // SingleHop / INAP
  40021,                            // CNServers / NL
  62563,                            // GlobalFrag / ServerHub
  6724,                             // Strato
  197695,                           // Reg.ru
  48282,                            // VDSina / Justhost
  50673,                            // Serverius
  60404,                            // Liteserver
  43350,                            // NForce
  49981,                            // WorldStream
  30823,                            // Combahton
  213371,                           // 1337 Services / BitLaunch
  35913,                            // DediPath
  53831,                            // Squarespace/hosting
  16125,                            // UAB Cherry (Time4VPS)
  56630,                            // Melbicom
]);

/* Doğrulanmış İYİ botlar: UA + ASN eşleşirse gerçek kabul edilir → hiç challenge yemez.
   (UA taklidi eden sahte Googlebot'lar datacenter ASN'inden geldiği için yine yakalanır.) */
export function iyiBotMu(ua, asn) {
  if (!ua) return false;
  const u = ua.toLowerCase();
  // Google (arama, resim, inceleme, reklam) — yalnız Google ASN'lerinden
  if (
    (u.includes('googlebot') || u.includes('google-inspectiontool') || u.includes('storebot-google') ||
      u.includes('mediapartners-google') || u.includes('adsbot-google') || u.includes('apis-google') ||
      u.includes('feedfetcher-google') || u.includes('google-extended')) &&
    (asn === 15169 || asn === 396982 || asn === 19527)
  ) return true;
  // Bing / Microsoft
  if (
    (u.includes('bingbot') || u.includes('bingpreview') || u.includes('msnbot') || u.includes('adidxbot')) &&
    (asn === 8075 || asn === 8068)
  ) return true;
  // Yandex
  if (u.includes('yandex') && (asn === 13238 || asn === 208722)) return true;
  // Apple
  if (u.includes('applebot') && (asn === 714 || asn === 6185)) return true;
  return false;
}

/* UA ile muaf tutulan legal botlar (sosyal link önizleme, uptime izleme, hız testleri,
   ASN ile eşleştiremediğimiz arama motorları). Bunları engellemek entegrasyonları bozar. */
const MUAF_UA_RE = /(duckduckbot|duckduckgo|baiduspider|sogou|exabot|petalbot|seznambot|qwantify|facebookexternalhit|facebookcatalog|facebot|twitterbot|linkedinbot|slackbot|slack-imgproxy|telegrambot|whatsapp|discordbot|pinterest|redditbot|embedly|skypeuripreview|nuzzel|vkshare|w3c_validator|uptimerobot|pingdom|statuscake|site24x7|betteruptime|updownio|hetrixtools|freshping|cron-job|gtmetrix|lighthouse|pagespeed|chrome-lighthouse|google-structured-data|validator\.nu)/i;

const SEO_ARAC_UA_RE = /(seobility|ahrefsbot|ahrefssiteaudit|semrushbot|siteauditbot|splitsignalbot|mj12bot|dotbot|rogerbot|screaming frog|sitebulb|serpstatbot|dataforseobot|barkrowler|blexbot|seokicks|cocolyzebot|sistrix|linkdexbot|oncrawl|deepcrawl|lumar|contentkingapp|checkbot|webpagetest|seranking|se ranking|accuranker|rankactivebot|awariobot|netpeakcheckerbot|screamingfrogseospider|mojeekbot|serpstat|sitechecker)/i;

export function muafBotUA(ua) {
  return !!ua && (MUAF_UA_RE.test(ua) || SEO_ARAC_UA_RE.test(ua));
}

/* ------------------------- İmzalı geçiş kartı (HMAC-SHA256) ------------------------- */

function metin(s) {
  return new TextEncoder().encode(s);
}

async function hmacHex(secret, data) {
  const anahtar = await crypto.subtle.importKey('raw', metin(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const buf = await crypto.subtle.sign('HMAC', anahtar, metin(data));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Sabit-zaman string karşılaştırma (timing attack'a karşı)
function esitMi(a, b) {
  if (a.length !== b.length) return false;
  let fark = 0;
  for (let i = 0; i < a.length; i++) fark |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return fark === 0;
}

// Kişiye özel kısa kimlik (12 hex)
export function yeniKimlik() {
  const b = new Uint8Array(6);
  crypto.getRandomValues(b);
  return Array.from(b).map((x) => x.toString(16).padStart(2, '0')).join('');
}

// URL'de gösterilen referans kimliği (16 hex)
export function refUret() {
  const b = new Uint8Array(8);
  crypto.getRandomValues(b);
  return Array.from(b).map((x) => x.toString(16).padStart(2, '0')).join('');
}

// İstemci IP'sini birden çok başlıktan sağlam biçimde oku. getir = (ad) => deger
export function istemciIp(getir) {
  const xff = (getir('x-forwarded-for') || '').split(',')[0].trim();
  return (
    getir('cf-connecting-ip') ||
    getir('true-client-ip') ||
    getir('x-real-ip') ||
    xff ||
    ''
  );
}

/** IP'ye bağlı, imzalı, süreli geçiş kartı üretir. */
export async function kartOlustur(ip, secret, sn) {
  const id = yeniKimlik();
  const exp = Math.floor(Date.now() / 1000) + (sn || 0);
  const govde = `${ip}~${id}~${exp}`;
  const imza = await hmacHex(secret, govde);
  return { deger: `${govde}~${imza}`, id, exp };
}

/** Çerezin imzasını, süresini ve IP eşleşmesini doğrular. Sahte/kopya çerez geçmez. */
export async function kartGecerliMi(deger, ip, secret) {
  if (!deger || !secret || !ip) return false;
  const p = deger.split('~');
  if (p.length !== 4) return false;
  const [cip, id, expStr, imza] = p;
  const exp = parseInt(expStr, 10);
  if (!exp || exp < Math.floor(Date.now() / 1000)) return false; // süresi doldu
  if (cip !== ip) return false; // başka IP'den kopyalanmış → reddet
  const beklenen = await hmacHex(secret, `${cip}~${id}~${expStr}`);
  return esitMi(beklenen, imza);
}
