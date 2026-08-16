'use client';
import { createContext, useContext, useEffect, useReducer, useMemo, useState, useCallback } from 'react';
import { cartReducer, loadCart, saveCart, cartCount, cartTotal, STORAGE_KEY, normalize } from '@/lib/engines/cart';

const CartCtx = createContext(null);

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, []);
  const [hazir, setHazir] = useState(false);
  const [panelAcik, setPanelAcik] = useState(false);
  const [sonEklenen, setSonEklenen] = useState('');

  useEffect(() => {
    dispatch({ type: 'yukle', items: loadCart() });
    setHazir(true);
  }, []);

  useEffect(() => {
    if (hazir) saveCart(items);
  }, [items, hazir]);

  useEffect(() => {
    const on = (e) => {
      if (e.key !== STORAGE_KEY) return;
      try {
        dispatch({ type: 'yukle', items: normalize(JSON.parse(e.newValue || '[]')) });
      } catch {  }
    };
    window.addEventListener('storage', on);
    return () => window.removeEventListener('storage', on);
  }, []);

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

export function useCart() {
  return useContext(CartCtx) || {
    items: [], hazir: false, adet: 0, toplam: 0, panelAcik: false, sonEklenen: '',
    setPanelAcik: () => {}, ekle: () => {}, cikar: () => {}, adetAyarla: () => {}, temizle: () => {},
  };
}
