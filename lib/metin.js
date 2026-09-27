let aktif = {};

export const cevir = (sozluk, anahtar, degerler) => {
  let t = sozluk?.[anahtar];
  if (t == null) return '';
  if (degerler) t = t.replace(/\{(\w+)\}/g, (_, a) => (degerler[a] ?? ''));
  return t;
};

export const sozlukAyarla = (s) => {
  if (s) aktif = { ...aktif, ...s };
};

export const m = (anahtar, degerler) => cevir(aktif, anahtar, degerler);
