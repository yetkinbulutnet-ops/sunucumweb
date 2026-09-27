const doldur = (sablon, degerler) => String(sablon || '').replace(/\{(\w+)\}/g, (tam, ad) => (ad in degerler ? String(degerler[ad]) : tam));

export function promptOlustur(ayar, { brief, count, tlds }) {
  const uzantiSatiri = tlds?.length ? `\n${doldur(ayar.uzantiSatiri, { uzantilar: tlds.join(' ') })}` : '';
  return {
    system: String(ayar.sistemTalimati || ''),
    user: doldur(ayar.kullaniciSablonu, { tanim: brief, uzanti_satiri: uzantiSatiri, adet: count }),
    jsonTalimati: String(ayar.jsonTalimati || ''),
  };
}
