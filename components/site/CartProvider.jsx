'use client';
import { createContext, useContext, useEffect, useReducer, useMemo, useState, useCallback } from 'react';
import { cartReducer, loadCart, saveCart, cartCount, cartTotal, STORAGE_KEY, normalize } from '@/lib/engines/cart';

/**
 * Sepet motorunu React'e baglayan ince katman.
 * Is mantigi lib/engines/cart icinde; burasi sadece durum + kalicilik + sekmeler arasi es zamanlama.
 */

const CartCtx = createContext(null);

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, []);
  const [hazir, setHazir] = useState(false);   // localStorage okundu mu (hydration uyumsuzlugunu onler)
  const [panelAcik, setPanelAcik] = useState(false);
  const [sonEklenen, setSonEklenen] = useState('');

  /* ilk yukleme */
  useEffect(() => {
    dispatch({ type: 'yukle', items: loadCart() });
    setHazir(true);
  }, []);

  /* her degisiklikte kaydet */
  useEffect(() => {
    if (hazir) saveCart(items);
  }, [items, hazir]);

  /* baska sekmede sepet degisirse burada da guncellensin */
  useEffect(() => {
    const on = (e) => {
      if (e.key !== STORAGE_KEY) return;
      try {
        dispatch({ type: 'yukle', items: normalize(JSON.parse(e.newValue || '[]')) });
      } catch { /* bozuk veri: yoksay */ }
    };
    window.addEventListener('storage', on);
    return () => window.removeEventListener('storage', on);
  }, []);

  /* "sepete eklendi" balonu sonsun */
  useEffect(() => {
    if (!sonEklenen) return;
    const t = setTimeout(() => setSonEklenen(''), 2600);
    return () => clearTimeout(t);
  }, [sonEklenen]);

  const ekle = useCallback((item) => {
    dispatch({ type: 'ekle', item });
    setSonEklenen(item.name || 'Paket');
  }, []);

  const deger = useMemo(() => ({
    items,
    hazir,
    adet: cartCount(items),
    toplam: cartTotal(items),
    panelAcik,
    sonEklenen,
    setPanelAcik,
    ekle,
    cikar: (id) => dispatch({ type: 'cikar', id }),
    adetAyarla: (id, qty) => dispatch({ type: 'adet', id, qty }),
    temizle: () => dispatch({ type: 'temizle' }),
  }), [items, hazir, panelAcik, sonEklenen, ekle]);

  return <CartCtx.Provider value={deger}>{children}</CartCtx.Provider>;
}

/** Sepete erisim. Provider disinda cagrilirsa siteyi bozmaz, "bos sepet" doner. */
export function useCart() {
  return useContext(CartCtx) || {
    items: [], hazir: false, adet: 0, toplam: 0, panelAcik: false, sonEklenen: '',
    setPanelAcik: () => {}, ekle: () => {}, cikar: () => {}, adetAyarla: () => {}, temizle: () => {},
  };
}
