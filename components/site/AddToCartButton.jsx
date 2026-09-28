'use client';
import { useState, useEffect } from 'react';
import { Icon } from './chrome';
import { useCart } from './CartProvider';
import { m } from '@/lib/metin';

export default function AddToCartButton({ item, tema = 'acik', className = '', href }) {
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
    if (window.innerWidth < 640) setPanelAcik(true);
  };

  const stiller = {

    koyu: 'bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/15',

    acik: 'bg-surface2 text-strong hover:bg-line',

    dolu: 'bg-brand-700 text-white shadow-lg shadow-brand-500/30 hover:bg-brand-800',
  };

  const cls = `inline-flex items-center justify-center gap-1.5 rounded-xl px-5 py-3 text-[14px] font-semibold transition-[transform,box-shadow,border-color,opacity] ${stiller[tema] || stiller.acik} ${className}`;

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" aria-label={m('sepet.satin_al_aria', { urun: item.name })} data-umami-event="Satın Al" data-umami-event-urun={item.name} className={cls}>
        <Icon name="cart" className="w-4 h-4" /> {m('sepet.satin_al')}
      </a>
    );
  }

  return (
    <button type="button" onClick={tikla} aria-label={m('sepet.ekle_aria', { paket: item.name })} data-umami-event="Sepete Ekle" data-umami-event-urun={item.name} className={cls}>
      <Icon name={eklendi ? 'check' : 'cart'} className="w-4 h-4" />
      {eklendi ? m('sepet.sepete_eklendi') : m('sepet.sepete_ekle')}
    </button>
  );
}
