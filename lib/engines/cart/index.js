export const ENGINE = { id: 'cart', title: 'Sepet' };

export const STORAGE_KEY = 'swb-cart';
export const CHECKOUT_URL = 'https://my.sunucumweb.com';
const MAX_QTY = 24;

export function parsePrice(v) {
  if (typeof v === 'number') return v;
  const n = Number(String(v ?? '').replace(/\./g, '').replace(',', '.').replace(/[^\d.]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

export const makeId = (urun, paket) =>
  `${String(urun || 'urun')}__${String(paket || 'paket')}`.toLowerCase().replace(/\s+/g, '-');

export const cartCount = (items) => items.reduce((t, i) => t + i.qty, 0);
export const cartTotal = (items) => items.reduce((t, i) => t + i.price * i.qty, 0);

export const formatTRY = (n) =>
  new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(n || 0);

export function cartReducer(items, action) {
  switch (action.type) {
    case 'ekle': {
      const { item } = action;
      const id = item.id || makeId(item.product, item.name);
      const varOlan = items.find((i) => i.id === id);
      if (varOlan) {
        return items.map((i) => (i.id === id ? { ...i, qty: Math.min(MAX_QTY, i.qty + (item.qty || 1)) } : i));
      }
      return [
        ...items,
        {
          id,
          name: String(item.name || 'Paket'),
          product: String(item.product || ''),
          href: String(item.href || ''),
          price: parsePrice(item.price),
          period: item.period || '/ay',
          qty: Math.min(MAX_QTY, Math.max(1, item.qty || 1)),
          wisecpUrl: String(item.wisecpUrl || ''),
        },
      ];
    }
    case 'cikar':
      return items.filter((i) => i.id !== action.id);
    case 'adet': {
      const q = Math.max(0, Math.min(MAX_QTY, action.qty));
      return q === 0 ? items.filter((i) => i.id !== action.id) : items.map((i) => (i.id === action.id ? { ...i, qty: q } : i));
    }
    case 'temizle':
      return [];
    case 'yukle':
      return normalize(action.items);
    default:
      return items;
  }
}

export function normalize(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((i) => i && typeof i === 'object' && i.id)
    .map((i) => ({
      id: String(i.id),
      name: String(i.name || 'Paket'),
      product: String(i.product || ''),
      href: String(i.href || ''),
      price: parsePrice(i.price),
      period: i.period || '/ay',
      qty: Math.min(MAX_QTY, Math.max(1, Number(i.qty) || 1)),
      wisecpUrl: String(i.wisecpUrl || ''),
    }))
    .slice(0, 30);
}

export function loadCart() {
  if (typeof window === 'undefined') return [];
  try {
    return normalize(JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]'));
  } catch {
    return [];
  }
}

export function saveCart(items) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {  }
}
