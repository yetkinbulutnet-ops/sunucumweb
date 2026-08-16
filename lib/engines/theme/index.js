/**
 * MOTOR: theme
 * Acik/koyu mod. Saf fonksiyonlar + localStorage; ag istegi YOK.
 * Tarayicida calisir, sunucuda cagrilirsa sessizce 'light' doner.
 *
 * Tema <html class="dark"> ile uygulanir (tailwind darkMode:'class').
 * Ilk boyamadan once layout.jsx icindeki NO_FLASH_SCRIPT bunu ayarlar.
 */

export const ENGINE = { id: 'theme', title: 'Açık / Koyu Mod' };

export const STORAGE_KEY = 'swb-theme';
export const THEMES = ['light', 'dark'];

/** Sistem tercihi (koyu mu?) */
export function systemPrefersDark() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
}

/** Kayitli tercih; yoksa null (= sistemi takip et) */
export function storedTheme() {
  if (typeof window === 'undefined') return null;
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return THEMES.includes(v) ? v : null;
  } catch {
    return null;
  }
}

/** Su an gecerli tema */
export function currentTheme() {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

/** Temayi uygular ve kaydeder. */
export function applyTheme(theme, { persist = true } = {}) {
  if (typeof document === 'undefined') return 'light';
  const t = THEMES.includes(theme) ? theme : 'light';
  const el = document.documentElement;

  // Gecisleri kapat -> renkleri degistir -> iki kare sonra geri ac.
  // (Detay icin globals.css'teki .tema-kilit aciklamasi)
  el.classList.add('tema-kilit');
  el.classList.toggle('dark', t === 'dark');
  el.style.colorScheme = t;
  void el.offsetHeight; // reflow'u zorla, degisiklikler hemen uygulansin
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => el.classList.remove('tema-kilit'));
  });

  if (persist) {
    try { window.localStorage.setItem(STORAGE_KEY, t); } catch { /* gizli sekme vs. */ }
  }
  return t;
}

export const toggleTheme = () => applyTheme(currentTheme() === 'dark' ? 'light' : 'dark');

/**
 * Ilk boyamadan ONCE calisan script (FOUC/beyaz parlama olmasin).
 * layout.jsx icinde <script dangerouslySetInnerHTML> ile <head>'e basilir.
 */
export const NO_FLASH_SCRIPT = `(function(){try{
var k='${STORAGE_KEY}',v=localStorage.getItem(k),
d=(v==='dark')||(v!=='light'&&window.matchMedia('(prefers-color-scheme:dark)').matches),
e=document.documentElement;
e.classList.toggle('dark',d);e.style.colorScheme=d?'dark':'light';
}catch(_){}})();`;
