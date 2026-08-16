'use client';
import { useState, useEffect } from 'react';
import { Icon } from './chrome';
import { useCart } from './CartProvider';

/**
 * "Sepete Ekle" butonu.
 * useCart()'i KENDISI cagirir; boylece CartProvider agacinin ICINDE kalir.
 * (Sayfa bilesenleri SiteShell'in ustunde oldugu icin orada useCart() bos donerdi.)
 */
export default function AddToCartButton({ item, tema = 'acik', className = '' }) {
  const { ekle, setPanelAcik } = useCart();
  const [eklendi, setEklendi] = useState(false);

  useEffect(() => {
    if (!eklendi) return;
    const t = setTimeout(() => setEklendi(false), 1800);
    return () => clearTimeout(t);
  }, [eklendi]);

  const tikla = () => {
    ekle(item);
    setEklendi(true);
    if (window.innerWidth < 640) setPanelAcik(true); // mobilde sepeti hemen goster
  };

  const stiller = {
    // koyu kart uzerinde (populer paket)
    koyu: 'bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/15',
    // acik kart uzerinde
    acik: 'bg-surface2 text-strong hover:bg-line',
    // birincil eylem (urun sayfasi)
    dolu: 'bg-brand-500 text-white shadow-lg shadow-brand-500/30 hover:bg-brand-600',
  };

  return (
    <button
      type="button"
      onClick={tikla}
      aria-label={`${item.name} paketini sepete ekle`}
      className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-5 py-3 text-[14px] font-semibold transition-all ${stiller[tema] || stiller.acik} ${className}`}
    >
      <Icon name={eklendi ? 'check' : 'cart'} className="w-4 h-4" />
      {eklendi ? 'Sepete eklendi' : 'Sepete Ekle'}
    </button>
  );
}
