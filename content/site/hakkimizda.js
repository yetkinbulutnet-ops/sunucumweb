export const hakkimizdaSabit = (m) => ({
  kisayollar: [
    { metin: m('hakkimizda.kisayol_ilkeler'), href: '#ilkeler', ikon: 'scale' },
    { metin: m('hakkimizda.kisayol_veri_merkezi'), href: '#veri-merkezi', ikon: 'database' },
  ],
  konum: {
    sehir: m('hakkimizda.konum_sehir'),
    ulke: m('hakkimizda.konum_ulke'),
    etiket: m('hakkimizda.konum_etiket'),
    enlem: 41.0082,
    boylam: 28.9784,
    koordinat: m('hakkimizda.konum_koordinat'),
  },
  tesis: {
    ad: 'Netweb',
    site: 'https://www.netweb.com.tr',
    not: m('hakkimizda.tesis_not'),
  },
  kartUstBaslik: m('hakkimizda.kart_ust_baslik'),
});
