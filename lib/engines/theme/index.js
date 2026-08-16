export const ENGINE = { id: 'theme', title: 'Açık / Koyu Mod' };

export const STORAGE_KEY = 'swb-theme';
export const THEMES = ['light', 'dark'];

export function systemPrefersDark() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
}

export function storedTheme() {
  if (typeof window === 'undefined') return null;
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return THEMES.includes(v) ? v : null;
  } catch {
    return null;
  }
}

export function currentTheme() {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

export function applyTheme(theme, { persist = true } = {}) {
  if (typeof document === 'undefined') return 'light';
  const t = THEMES.includes(theme) ? theme : 'light';
  const el = document.documentElement;

  el.classList.add('tema-kilit');
  el.classList.toggle('dark', t === 'dark');
  el.style.colorScheme = t;
  void el.offsetHeight;
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => el.classList.remove('tema-kilit'));
  });

  if (persist) {
    try { window.localStorage.setItem(STORAGE_KEY, t); } catch {  }
  }
  return t;
}

export const toggleTheme = () => applyTheme(currentTheme() === 'dark' ? 'light' : 'dark');

export const NO_FLASH_SCRIPT = `(function(){try{
var k='${STORAGE_KEY}',v=localStorage.getItem(k),
d=(v==='dark')||(v!=='light'&&window.matchMedia('(prefers-color-scheme:dark)').matches),
e=document.documentElement;
e.classList.toggle('dark',d);e.style.colorScheme=d?'dark':'light';
}catch(_){}})();`;
