'use client';
import { sozlukAyarla } from '@/lib/metin';

export default function MetinEkle({ metinler, children }) {
  sozlukAyarla(metinler);
  return children;
}
