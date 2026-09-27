import 'server-only';
import { sozluk } from './cms';
import { cevir } from './metin';

let aktif = {};

export const sistemMetinHazirla = async () => {
  try {
    aktif = await sozluk();
  } catch {}
};

export const sm = (anahtar, degerler) => cevir(aktif, anahtar, degerler);
