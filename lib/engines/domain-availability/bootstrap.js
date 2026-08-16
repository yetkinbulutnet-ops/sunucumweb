import { fetchJson } from '../core/http';

/**
 * IANA RDAP bootstrap tablosu: hangi uzantinin RDAP sunucusu var?
 * Bu KRITIK: .tr / .co / .io gibi uzantilarda RDAP YOK. Onlari sorgularsak
 * her zaman 404 doner ve "musait" sanip kullaniciyi yaniltiriz.
 * Tablo 24 saat bellekte tutulur.
 */

const BOOTSTRAP_URL = 'https://data.iana.org/rdap/dns.json';
const TTL_MS = 24 * 60 * 60 * 1000;

let cache = { at: 0, map: null };

/** Bilinen calisan sunucular - bootstrap'e ulasilamazsa devreye girer. */
const FALLBACK = new Map([
  ['com', 'https://rdap.verisign.com/com/v1/'],
  ['net', 'https://rdap.verisign.com/net/v1/'],
  ['org', 'https://rdap.publicinterestregistry.org/rdap/'],
  ['app', 'https://pubapi.registry.google/rdap/'],
  ['dev', 'https://pubapi.registry.google/rdap/'],
  ['shop', 'https://rdap.gmoregistry.net/rdap/'],
  ['online', 'https://rdap.radix.host/rdap/'],
  ['xyz', 'https://rdap.centralnic.com/xyz/'],
]);

async function loadMap() {
  const fresh = cache.map && Date.now() - cache.at < TTL_MS;
  if (fresh) return cache.map;

  const r = await fetchJson(BOOTSTRAP_URL, { headers: { Accept: 'application/json' } }, { timeoutMs: 8000, retries: 1 });

  if (!r.ok || !Array.isArray(r.data?.services)) {
    // Bootstrap'e ulasilamadi: elimizdeki yedek tabloyla devam et (site calismaya devam etsin)
    cache = { at: Date.now(), map: new Map(FALLBACK) };
    return cache.map;
  }

  const map = new Map();
  for (const [tlds, servers] of r.data.services) {
    const server = (servers || []).find((s) => s.startsWith('https://')) || servers?.[0];
    if (!server) continue;
    for (const t of tlds) map.set(String(t).toLowerCase(), server.endsWith('/') ? server : `${server}/`);
  }
  for (const [k, v] of FALLBACK) if (!map.has(k)) map.set(k, v);

  cache = { at: Date.now(), map };
  return map;
}

/**
 * Alan adi icin RDAP sunucusunu bulur (en uzun uzanti eslesmesi).
 * "ornek.com.tr" -> once "com.tr", sonra "tr" denenir. Ikisi de yoksa null.
 */
export async function rdapServerFor(domain) {
  const map = await loadMap();
  const parts = String(domain).toLowerCase().split('.');
  for (let i = 1; i < parts.length; i++) {
    const suffix = parts.slice(i).join('.');
    if (map.has(suffix)) return map.get(suffix);
  }
  return null;
}
