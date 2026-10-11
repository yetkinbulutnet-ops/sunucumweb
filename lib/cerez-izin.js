export const IZIN_CEREZI = 'swb_cerez';
const SURUM = '1';
const OMUR = 180 * 24 * 60 * 60;

export const izinOku = () => {
  if (typeof document === 'undefined') return null;
  const m = document.cookie.match(/(?:^|;\s*)swb_cerez=([^;]+)/);
  if (!m) return null;
  const [s, a, d] = decodeURIComponent(m[1]).split('.');
  if (s !== SURUM) return null;
  return { analiz: a === 'a1', destek: d === 'd1' };
};

export const izinYaz = ({ analiz, destek }) => {
  const deger = `${SURUM}.${analiz ? 'a1' : 'a0'}.${destek ? 'd1' : 'd0'}`;
  const guvenli = location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${IZIN_CEREZI}=${deger}; Max-Age=${OMUR}; Path=/; SameSite=Lax${guvenli}`;
  window.dispatchEvent(new CustomEvent('swb-cerez', { detail: { analiz: !!analiz, destek: !!destek } }));
};

export const tercihleriAc = () => window.dispatchEvent(new Event('swb-cerez-ac'));
