export const WISECP_BASE = 'https://my.sunucumweb.com';

export const WISECP_KATEGORI = {
  'web-hosting': '/kategori/hosting/web-hosting',
  'wordpress-hosting': '/kategori/hosting/web-hosting',
  'reseller-hosting': '/kategori/hosting/bayi-reseller-hosting',
  'kurumsal-hosting': '/kategori/hosting/kurumsal-hosting',
  'sanal-sunucu': '/kategori/ssd-sanal-sunucular-vds-vps/turkiye-lokasyon-vds-vps',
  'premium-sunucu': '/kategori/ssd-sanal-sunucular-vds-vps/turkiye-lokasyon-vds-vps',
  'dedicated-sunucu': '/kategori/fiziksel-sunucular-dedicated/turkiye-lokasyon-fiziksel-sunucular',
  'gpu-sunucu': '/kategori/ssd-sanal-sunucular-vds-vps/ekran-kartli-sunucular',
  'sunucu-barindirma': '/kategori/fiziksel-sunucular-dedicated/sunucu-barindirma',
};

export const WISECP_PLAN = {
  'web-hosting': { 'cPanel Başlangıç': 'hosting/222', 'cPanel İdeal': 'hosting/223', 'cPanel Plus': 'hosting/224' },
  'reseller-hosting': { 'Bronz Bayi': 'hosting/124', 'Silver Bayi': 'hosting/125', 'Gold Bayi': 'hosting/126', 'Platin Bayi': 'hosting/127' },
  'kurumsal-hosting': { 'Kurumsal Başlangıç': 'hosting/120', 'Kurumsal Standart': 'hosting/121', 'Kurumsal Plus+': 'hosting/122', 'Kurumsal Premium': 'hosting/123' },
  'sanal-sunucu': { 'TR - VDS 1': 'server/104', 'TR - VDS 2': 'server/105', 'TR - VDS 3': 'server/103', 'TR - VDS 4': 'server/106', 'TR - VDS 5': 'server/107', 'TR - VDS 6': 'server/108', 'TR - VDS 7': 'server/109', 'TR - VDS 8': 'server/189' },
  'premium-sunucu': { 'PRE VDS 1': 'server/170', 'PRE VDS 2': 'server/171', 'PRE VDS 3': 'server/172', 'PRE VDS 4': 'server/173', 'PRE VDS 5': 'server/174', 'PRE VDS 6': 'server/175', 'PRE VDS 7': 'server/176', 'PRE VDS 8': 'server/190' },
  'dedicated-sunucu': { 'Dedicated 1': 'server/217', 'Dedicated 2': 'server/129', 'Dedicated 3': 'server/128', 'Dedicated 4': 'server/130', 'Dedicated 5': 'server/131', 'Dedicated 6': 'server/218', 'Dedicated 7': 'server/219' },
  'gpu-sunucu': { 'GPU VDS Starter': 'server/159', 'GPU VDS Pro': 'server/160', 'GPU VDS Enterprise': 'server/161' },
};

export function wisecpSiparisUrl(slug, planName) {
  const yol = WISECP_PLAN[slug] && WISECP_PLAN[slug][planName];
  if (yol) return `${WISECP_BASE}/siparis/${yol}`;
  const kat = WISECP_KATEGORI[slug];
  if (kat) return `${WISECP_BASE}${kat}`;
  return WISECP_BASE;
}
