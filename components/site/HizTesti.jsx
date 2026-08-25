'use client';
import { useCallback, useEffect, useRef, useState } from 'react';

const UC = {
  ping: '/api/araclar/hiz-testi/ping',
  indir: '/api/araclar/hiz-testi/indir',
  yukle: '/api/araclar/hiz-testi/yukle',
};

const PING_SAYI = 12;
const INDIRME_SURE = 8000;
const INDIRME_AKIS = 4;
const INDIRME_ISTEK = 30 * 1024 * 1024;
const INDIRME_TAVAN = 120 * 1024 * 1024;
const YUKLEME_SURE = 7000;
const YUKLEME_AKIS = 3;
const YUKLEME_BLOK = 6 * 1024 * 1024;
const YUKLEME_TAVAN = 60 * 1024 * 1024;

const CEVRE = 2 * Math.PI * 54;

const mbps = (bayt, sn) => (sn > 0 ? (bayt * 8) / sn / 1e6 : 0);

const sayiYaz = (n) => {
  if (!Number.isFinite(n)) return '—';
  if (n >= 100) return String(Math.round(n));
  if (n >= 10) return n.toFixed(1);
  return n.toFixed(2);
};

const msYaz = (n) => (Number.isFinite(n) && n > 0 ? String(Math.round(n)) : '—');

function rastgeleBuffer(boyut) {
  const buf = new Uint8Array(boyut);
  for (let i = 0; i < boyut; i += 65536) {
    crypto.getRandomValues(buf.subarray(i, Math.min(i + 65536, boyut)));
  }
  return buf;
}

async function olcPing(signal, canli) {
  const olcumler = [];
  for (let i = 0; i < PING_SAYI; i++) {
    if (signal.aborted) break;
    const t0 = performance.now();
    try {
      await fetch(`${UC.ping}?t=${i}.${Math.random()}`, { cache: 'no-store', signal });
    } catch {
      if (signal.aborted) break;
      continue;
    }
    const dt = performance.now() - t0;
    if (i >= 2) olcumler.push(dt);
    const enIyi = olcumler.length ? Math.min(...olcumler) : dt;
    canli(((i + 1) / PING_SAYI) * 100, enIyi);
  }
  if (!olcumler.length) return { ping: 0, jitter: 0 };
  const ping = Math.min(...olcumler);
  let jit = 0;
  for (let i = 1; i < olcumler.length; i++) jit += Math.abs(olcumler[i] - olcumler[i - 1]);
  return { ping, jitter: olcumler.length > 1 ? jit / (olcumler.length - 1) : 0 };
}

async function indirmeIsci(signal, ekle) {
  while (!signal.aborted) {
    try {
      const r = await fetch(`${UC.indir}?bayt=${INDIRME_ISTEK}&t=${Math.random()}`, { cache: 'no-store', signal });
      const okuyucu = r.body?.getReader?.();
      if (!okuyucu) {
        ekle((await r.arrayBuffer()).byteLength);
        continue;
      }
      for (;;) {
        const { done, value } = await okuyucu.read();
        if (done) break;
        ekle(value.byteLength);
        if (signal.aborted) {
          okuyucu.cancel().catch(() => {});
          break;
        }
      }
    } catch {
      if (signal.aborted) break;
    }
  }
}

function yuklemeGonder(veri, signal, ekle) {
  return new Promise((cozum) => {
    const xhr = new XMLHttpRequest();
    let onceki = 0;
    xhr.upload.onprogress = (e) => {
      ekle(e.loaded - onceki);
      onceki = e.loaded;
    };
    xhr.onloadend = () => cozum();
    xhr.onerror = () => cozum();
    const kes = () => {
      try {
        xhr.abort();
      } catch {}
    };
    signal.addEventListener('abort', kes, { once: true });
    try {
      xhr.open('POST', `${UC.yukle}?t=${Math.random()}`);
      xhr.send(veri);
    } catch {
      cozum();
    }
  });
}

async function yuklemeIsci(signal, veri, ekle) {
  while (!signal.aborted) {
    await yuklemeGonder(veri, signal, ekle);
  }
}

function akisOlc({ disSignal, sure, tavan, akisSayisi, isci, canli }) {
  const ic = new AbortController();
  const durdur = () => ic.abort();
  disSignal.addEventListener('abort', durdur, { once: true });
  const zaman = setTimeout(() => ic.abort(), sure);
  let bayt = 0;
  const t0 = performance.now();
  const ekle = (n) => {
    bayt += n;
    if (bayt >= tavan) ic.abort();
  };
  const tik = setInterval(() => {
    const sn = (performance.now() - t0) / 1000;
    canli(Math.min(99, (sn / (sure / 1000)) * 100), mbps(bayt, sn));
  }, 120);
  return Promise.all(Array.from({ length: akisSayisi }, () => isci(ic.signal, ekle)))
    .then(() => mbps(bayt, (performance.now() - t0) / 1000))
    .finally(() => {
      clearInterval(tik);
      clearTimeout(zaman);
      disSignal.removeEventListener('abort', durdur);
    });
}

const BASLIK = {
  hazir: 'Başlamaya hazır',
  ping: 'Gecikme ölçülüyor',
  indirme: 'İndirme',
  yukleme: 'Yükleme',
  bitti: 'İndirme hızınız',
};

function MetrikKart({ etiket, deger, birim, ikon, aktif, doldu }) {
  return (
    <div
      className={`min-w-0 rounded-2xl border bg-surface p-4 sm:p-5 transition-colors ${
        aktif ? 'border-brand-500 ring-1 ring-brand-500/40' : 'border-line'
      }`}
    >
      <div className="flex min-w-0 items-center gap-2 text-muted">
        <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl ${doldu || aktif ? 'bg-brandsoft text-brandtext' : 'bg-surface2 text-muted'}`}>
          {ikon}
        </span>
        <span className="min-w-0 truncate text-[12px] font-bold uppercase tracking-[0.1em]">{etiket}</span>
      </div>
      <div className="mt-3 flex min-w-0 items-baseline gap-1.5">
        <span className="min-w-0 truncate text-[26px] font-extrabold tabular-nums text-strong">{deger}</span>
        <span className="shrink-0 text-[13px] font-semibold text-muted">{birim}</span>
      </div>
    </div>
  );
}

const IkonIndir = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
    <path d="M12 4v12M6 11l6 6 6-6M5 20h14" />
  </svg>
);
const IkonYukle = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
    <path d="M12 20V8M6 13l6-6 6 6M5 4h14" />
  </svg>
);
const IkonPing = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
    <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 8v4l3 2" />
  </svg>
);
const IkonJitter = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
    <path d="M3 12h3l2-6 4 12 2-6h4" />
  </svg>
);

export default function HizTesti() {
  const [asama, setAsama] = useState('hazir');
  const [anlik, setAnlik] = useState(0);
  const [ilerleme, setIlerleme] = useState(0);
  const [sonuc, setSonuc] = useState(null);
  const [hata, setHata] = useState('');
  const iptalRef = useRef(null);

  useEffect(() => () => iptalRef.current?.abort(), []);

  const calisiyor = asama === 'ping' || asama === 'indirme' || asama === 'yukleme';

  const baslat = useCallback(async () => {
    if (calisiyor) return;
    const ac = new AbortController();
    iptalRef.current = ac;
    setHata('');
    setSonuc(null);
    setAnlik(0);
    setIlerleme(0);
    const canli = (yuzde, deger) => {
      setIlerleme(yuzde);
      setAnlik(deger);
    };
    try {
      setAsama('ping');
      const p = await olcPing(ac.signal, canli);
      if (ac.signal.aborted) throw new Error('iptal');
      setSonuc({ ping: p.ping, jitter: p.jitter });

      setAsama('indirme');
      setAnlik(0);
      setIlerleme(0);
      const indirme = await akisOlc({
        disSignal: ac.signal,
        sure: INDIRME_SURE,
        tavan: INDIRME_TAVAN,
        akisSayisi: INDIRME_AKIS,
        isci: indirmeIsci,
        canli,
      });
      if (ac.signal.aborted) throw new Error('iptal');
      setSonuc((s) => ({ ...s, indirme }));

      setAsama('yukleme');
      setAnlik(0);
      setIlerleme(0);
      const veri = rastgeleBuffer(YUKLEME_BLOK);
      const yukleme = await akisOlc({
        disSignal: ac.signal,
        sure: YUKLEME_SURE,
        tavan: YUKLEME_TAVAN,
        akisSayisi: YUKLEME_AKIS,
        isci: (signal, ekle) => yuklemeIsci(signal, veri, ekle),
        canli,
      });
      if (ac.signal.aborted) throw new Error('iptal');

      setSonuc((s) => ({ ...s, yukleme }));
      setAnlik(indirme);
      setIlerleme(100);
      setAsama('bitti');
    } catch {
      if (ac.signal.aborted) {
        setAsama('hazir');
        setIlerleme(0);
        setAnlik(0);
      } else {
        setHata('Ölçüm tamamlanamadı. Bağlantınızı kontrol edip tekrar deneyin.');
        setAsama('hata');
      }
    } finally {
      iptalRef.current = null;
    }
  }, [calisiyor]);

  const iptal = useCallback(() => iptalRef.current?.abort(), []);

  const merkezDeger = asama === 'ping' ? msYaz(anlik) : asama === 'hazir' || asama === 'hata' ? '0' : sayiYaz(anlik);
  const merkezBirim = asama === 'ping' ? 'ms' : 'Mbit/s';
  const merkezBaslik = BASLIK[asama] || BASLIK.hazir;

  return (
    <div>
      {hata && (
        <div className="mb-6 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-[14px] font-medium text-rose-600 dark:text-rose-400">
          {hata}
        </div>
      )}

      <div className="flex flex-col items-center">
        <div className="relative aspect-square w-[min(78vw,320px)]">
          <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
            <circle cx="60" cy="60" r="54" fill="none" strokeWidth="9" className="stroke-line" />
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              strokeWidth="9"
              strokeLinecap="round"
              strokeDasharray={CEVRE}
              strokeDashoffset={CEVRE * (1 - ilerleme / 100)}
              className="stroke-brand-500 [transition:stroke-dashoffset_140ms_linear] motion-reduce:transition-none"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-[13px] font-bold uppercase tracking-[0.12em] text-brandtext">{merkezBaslik}</span>
            <span className="mt-1 text-[54px] font-extrabold leading-none tabular-nums text-strong">{merkezDeger}</span>
            <span className="mt-1 text-[14px] font-semibold text-muted">{merkezBirim}</span>
          </div>
        </div>

        <div className="mt-8">
          {calisiyor ? (
            <button
              type="button"
              onClick={iptal}
              className="inline-flex h-12 items-center justify-center rounded-full border border-line bg-surface px-8 text-[15px] font-bold text-strong transition-colors hover:border-brandline"
            >
              İptal
            </button>
          ) : (
            <button
              type="button"
              onClick={baslat}
              data-umami-event="Hız Testi Başlat"
              className="inline-flex h-12 items-center justify-center rounded-full bg-brand-500 px-9 text-[15px] font-bold text-white shadow-lg shadow-brand-500/25 transition-colors hover:bg-brand-600"
            >
              {asama === 'bitti' ? 'Tekrar Test Et' : asama === 'hata' ? 'Tekrar Dene' : 'Testi Başlat'}
            </button>
          )}
        </div>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <MetrikKart etiket="İndirme" deger={sonuc?.indirme != null ? sayiYaz(sonuc.indirme) : '—'} birim="Mbit/s" ikon={IkonIndir} aktif={asama === 'indirme'} doldu={sonuc?.indirme != null} />
        <MetrikKart etiket="Yükleme" deger={sonuc?.yukleme != null ? sayiYaz(sonuc.yukleme) : '—'} birim="Mbit/s" ikon={IkonYukle} aktif={asama === 'yukleme'} doldu={sonuc?.yukleme != null} />
        <MetrikKart etiket="Ping" deger={sonuc?.ping != null ? msYaz(sonuc.ping) : '—'} birim="ms" ikon={IkonPing} aktif={asama === 'ping'} doldu={sonuc?.ping != null} />
        <MetrikKart etiket="Jitter" deger={sonuc?.jitter != null ? msYaz(sonuc.jitter) : '—'} birim="ms" ikon={IkonJitter} aktif={asama === 'ping'} doldu={sonuc?.jitter != null} />
      </div>

      <p className="mt-6 text-center text-[13px] leading-relaxed text-muted">
        Ölçüm, sunucumuza karşı gerçek zamanlı yapılır ve bağlantınızın anlık durumuna göre değişebilir.
        Test, hızınıza bağlı olarak birkaç yüz MB'a kadar veri kullanabilir.
      </p>
    </div>
  );
}
