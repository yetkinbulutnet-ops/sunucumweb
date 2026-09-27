import { m } from '@/lib/metin';

export const ENGINE = { id: 'mesai' };

export const SAAT_DILIMI = 'Europe/Istanbul';

export const TAKVIM = {
  1: [9, 18],
  2: [9, 18],
  3: [9, 18],
  4: [9, 18],
  5: [9, 18],
  6: null,
  0: null,
};

export const GUN_ADI = () => [m('iletisim.gun_pazar'), m('iletisim.gun_pazartesi'), m('iletisim.gun_sali'), m('iletisim.gun_carsamba'), m('iletisim.gun_persembe'), m('iletisim.gun_cuma'), m('iletisim.gun_cumartesi')];

export function istanbulZamani(simdi = new Date()) {
  const bicim = new Intl.DateTimeFormat('en-GB', {
    timeZone: SAAT_DILIMI,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const parcalar = Object.fromEntries(bicim.formatToParts(simdi).map((p) => [p.type, p.value]));
  const gunler = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

  return {
    gun: gunler[parcalar.weekday] ?? simdi.getDay(),
    saat: Number(parcalar.hour),
    dakika: Number(parcalar.minute),
    yaziSaat: `${parcalar.hour}:${parcalar.minute}`,
  };
}

function sonrakiAcilis(gun) {
  for (let i = 1; i <= 7; i++) {
    const aday = (gun + i) % 7;
    if (TAKVIM[aday]) return { gun: aday, saat: TAKVIM[aday][0], yarinMi: i === 1 };
  }
  return null;
}

export function mesaiDurumu(simdi = new Date()) {
  const { gun, saat, dakika, yaziSaat } = istanbulZamani(simdi);
  const bugun = TAKVIM[gun];
  const dakikaToplam = saat * 60 + dakika;

  if (bugun) {
    const [ac, kapa] = bugun;
    if (dakikaToplam >= ac * 60 && dakikaToplam < kapa * 60) {
      const kalan = kapa * 60 - dakikaToplam;
      return {
        acik: true,
        baslik: m('iletisim.mesai_acik'),
        aciklama:
          kalan <= 60
            ? m('iletisim.mesai_kapaniyor', { kalan })
            : m('iletisim.mesai_kadar', { saat: String(kapa).padStart(2, '0') }),
        yerelSaat: yaziSaat,
        gunAdi: GUN_ADI()[gun],
      };
    }

    if (dakikaToplam < ac * 60) {
      return {
        acik: false,
        baslik: m('iletisim.mesai_kapali'),
        aciklama: m('iletisim.mesai_bugun', { saat: String(ac).padStart(2, '0') }),
        yerelSaat: yaziSaat,
        gunAdi: GUN_ADI()[gun],
      };
    }
  }

  const sonraki = sonrakiAcilis(gun);
  const neZaman = sonraki
    ? sonraki.yarinMi
      ? m('iletisim.mesai_yarin', { saat: String(sonraki.saat).padStart(2, '0') })
      : m('iletisim.mesai_gun', { gun: GUN_ADI()[sonraki.gun], saat: String(sonraki.saat).padStart(2, '0') })
    : null;

  return {
    acik: false,
    baslik: m('iletisim.mesai_kapali'),
    aciklama: neZaman
      ? m('iletisim.mesai_sonraki', { zaman: neZaman })
      : m('iletisim.mesai_destek'),
    yerelSaat: yaziSaat,
    gunAdi: GUN_ADI()[gun],
  };
}
