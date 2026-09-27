export { COOKIE_ADI, GECERLILIK_SN, TURNSTILE_SITE_KEY, GUVENLIK_YOLU, BLOK_YOLU } from './guvenlik-config';

export const BLOKLU_IP = new Set([]);

export const BLOKLU_ASN = new Set([]);

export const DATACENTER_ASN = new Set([
  16509, 14618, 8987, 62785, 15169, 396982, 19527, 139070, 8075, 8068, 8069, 12076,
  45139, 14061, 16276, 35540, 24940, 213230, 212317, 20473, 64515, 63949, 51167, 45102,
  37963, 45103, 134963, 132203, 45090, 137876, 46606, 26496, 398101, 30083, 44273, 8560,
  197540, 62240, 210644, 401120, 35916, 53667, 40676, 30633, 60781, 19318, 32748, 9009,
  49505, 44477, 62904, 25820, 36352, 26347, 22612, 54290, 55293, 46475, 29802, 3223,
  60068, 212238, 136787, 9370, 206092, 51852, 399629, 210630, 47583, 39572, 20860, 12695,
  394711, 63023, 200019, 209103, 39351, 51396, 8100, 33182, 46562, 55286, 46844, 62744,
  42708, 396356, 199524, 34549, 24961, 47447, 63473, 44066, 20773, 133199, 32475, 40021,
  62563, 6724, 197695, 48282, 50673, 60404, 43350, 49981, 30823, 213371, 35913, 53831,
  16125, 56630,
]);

export function iyiBotMu(ua, asn) {
  if (!ua) return false;
  const u = ua.toLowerCase();
  if (
    (u.includes('googlebot') || u.includes('google-inspectiontool') || u.includes('storebot-google') ||
      u.includes('mediapartners-google') || u.includes('adsbot-google') || u.includes('apis-google') ||
      u.includes('feedfetcher-google') || u.includes('google-extended')) &&
    (asn === 15169 || asn === 396982 || asn === 19527)
  ) return true;
  if (
    (u.includes('bingbot') || u.includes('bingpreview') || u.includes('msnbot') || u.includes('adidxbot')) &&
    (asn === 8075 || asn === 8068)
  ) return true;
  if (u.includes('yandex') && (asn === 13238 || asn === 208722)) return true;
  if (u.includes('applebot') && (asn === 714 || asn === 6185)) return true;
  return false;
}

const MUAF_UA_RE = /(duckduckbot|duckduckgo|baiduspider|sogou|exabot|petalbot|seznambot|qwantify|facebookexternalhit|facebookcatalog|facebot|twitterbot|linkedinbot|slackbot|slack-imgproxy|telegrambot|whatsapp|discordbot|pinterest|redditbot|embedly|skypeuripreview|nuzzel|vkshare|w3c_validator|uptimerobot|pingdom|statuscake|site24x7|betteruptime|updownio|hetrixtools|freshping|cron-job|gtmetrix|lighthouse|pagespeed|chrome-lighthouse|google-structured-data|validator\.nu)/i;

const SEO_ARAC_UA_RE = /(seobility|ahrefsbot|ahrefssiteaudit|semrushbot|siteauditbot|splitsignalbot|mj12bot|dotbot|rogerbot|screaming frog|sitebulb|serpstatbot|dataforseobot|barkrowler|blexbot|seokicks|cocolyzebot|sistrix|linkdexbot|oncrawl|deepcrawl|lumar|contentkingapp|checkbot|webpagetest|seranking|se ranking|accuranker|rankactivebot|awariobot|netpeakcheckerbot|screamingfrogseospider|mojeekbot|serpstat|sitechecker)/i;

export function muafBotUA(ua) {
  return !!ua && (MUAF_UA_RE.test(ua) || SEO_ARAC_UA_RE.test(ua));
}

function metin(s) {
  return new TextEncoder().encode(s);
}

async function hmacHex(secret, data) {
  const anahtar = await crypto.subtle.importKey('raw', metin(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const buf = await crypto.subtle.sign('HMAC', anahtar, metin(data));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

function esitMi(a, b) {
  if (a.length !== b.length) return false;
  let fark = 0;
  for (let i = 0; i < a.length; i++) fark |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return fark === 0;
}

export function yeniKimlik() {
  const b = new Uint8Array(6);
  crypto.getRandomValues(b);
  return Array.from(b).map((x) => x.toString(16).padStart(2, '0')).join('');
}

export function refUret() {
  const b = new Uint8Array(8);
  crypto.getRandomValues(b);
  return Array.from(b).map((x) => x.toString(16).padStart(2, '0')).join('');
}

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

export async function kartOlustur(ip, secret, sn) {
  const id = yeniKimlik();
  const exp = Math.floor(Date.now() / 1000) + (sn || 0);
  const govde = `${ip}~${id}~${exp}`;
  const imza = await hmacHex(secret, govde);
  return { deger: `${govde}~${imza}`, id, exp };
}

export async function kartGecerliMi(deger, ip, secret) {
  if (!deger || !secret || !ip) return false;
  const p = deger.split('~');
  if (p.length !== 4) return false;
  const [cip, id, expStr, imza] = p;
  const exp = parseInt(expStr, 10);
  if (!exp || exp < Math.floor(Date.now() / 1000)) return false;
  if (cip !== ip) return false;
  const beklenen = await hmacHex(secret, `${cip}~${id}~${expStr}`);
  return esitMi(beklenen, imza);
}
