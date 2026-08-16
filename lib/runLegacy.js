export function runWithDomShim(code) {
  if (typeof document === 'undefined' || !code) return;
  const origDocAdd = document.addEventListener.bind(document);
  const origWinAdd = window.addEventListener.bind(window);

  document.addEventListener = (type, fn, opts) => {
    if (type === 'DOMContentLoaded') {
      try { fn(); } catch (e) { console.warn('[DOMContentLoaded shim]', e); }
    } else {
      origDocAdd(type, fn, opts);
    }
  };
  window.addEventListener = (type, fn, opts) => {
    if (type === 'load' || type === 'DOMContentLoaded') {
      try { fn(); } catch (e) { console.warn('[load shim]', e); }
    } else {
      origWinAdd(type, fn, opts);
    }
  };

  try {

    new Function(code)();
  } catch (e) {
    console.warn('[legacy script]', e);
  }

  document.addEventListener = origDocAdd;
  window.addEventListener = origWinAdd;
}

export function drawLucide() {
  try {
    if (typeof window !== 'undefined' && window.lucide) window.lucide.createIcons();
  } catch (e) {}
}
