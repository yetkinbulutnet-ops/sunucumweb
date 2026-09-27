'use client';
import { createContext, useContext } from 'react';
import { sozlukAyarla } from '@/lib/metin';

const Baglam = createContext(null);

export function SiteAyarlariSaglayici({ deger, metinler, children }) {
  sozlukAyarla(metinler);
  return <Baglam.Provider value={deger}>{children}</Baglam.Provider>;
}

export const useSiteAyarlari = () => useContext(Baglam);
