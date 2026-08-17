export const ENGINE = { id: 'mesai', title: 'Mesai Durumu' };

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

export const GUN_ADI = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];

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
        baslik: 'Şu anda açığız',
        aciklama:
          kalan <= 60
            ? `Satış ekibimiz ${kalan} dakika sonra kapanıyor. Teknik destek 7/24 açık.`
            : `Satış ekibimiz ${String(kapa).padStart(2, '0')}:00’a kadar hizmetinizde. Teknik destek 7/24 açık.`,
        yerelSaat: yaziSaat,
        gunAdi: GUN_ADI[gun],
      };
    }

    if (dakikaToplam < ac * 60) {
      return {
        acik: false,
        baslik: 'Mesai saatleri dışındayız',
        aciklama: `Satış ekibimiz bugün ${String(ac).padStart(2, '0')}:00’da açılıyor. Teknik destek 7/24 açık.`,
        yerelSaat: yaziSaat,
        gunAdi: GUN_ADI[gun],
      };
    }
  }

  const sonraki = sonrakiAcilis(gun);
  const neZaman = sonraki
    ? sonraki.yarinMi
      ? `yarın ${String(sonraki.saat).padStart(2, '0')}:00`
      : `${GUN_ADI[sonraki.gun]} günü ${String(sonraki.saat).padStart(2, '0')}:00`
    : null;

  return {
    acik: false,
    baslik: 'Mesai saatleri dışındayız',
    aciklama: neZaman
      ? `Satış ekibimiz ${neZaman}’da yeniden hizmetinizde. Teknik destek 7/24 açık.`
      : 'Teknik destek 7/24 açık.',
    yerelSaat: yaziSaat,
    gunAdi: GUN_ADI[gun],
  };
}
