export const WISECP_BASE = 'https://my.sunucumweb.com';

export function siparisUrl(urun, plan) {
  if (plan?.siparisYolu) return `${WISECP_BASE}/siparis/${plan.siparisYolu.replace(/^\/+/, '')}`;
  if (urun?.siparisKategoriYolu) return `${WISECP_BASE}/${urun.siparisKategoriYolu.replace(/^\/+/, '')}`;
  return WISECP_BASE;
}
