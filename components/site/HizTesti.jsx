'use client';
import { memo, useCallback, useEffect, useRef, useState } from 'react';

const UC = {
  bilgi: '/api/araclar/hiz-testi/bilgi',
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

const NOKTALAR = [0, 1, 5, 10, 30, 50, 100, 250, 500, 1000];
const SEG = NOKTALAR.length - 1;
const ETIKETLI = new Set([0, 10, 50, 100, 500, 1000]);
const BASLA = 135;
const YAY = 270;
const MERKEZ = 120;
const R_ARC = 86;

const rad = (d) => (d * Math.PI) / 180;
const nokta = (aci, r) => [MERKEZ + r * Math.cos(rad(BASLA + aci)), MERKEZ + r * Math.sin(rad(BASLA + aci))];

function hizAci(hiz) {
  if (hiz <= 0) return 0;
  if (hiz >= NOKTALAR[SEG]) return YAY;
  let i = 0;
  while (i < SEG && hiz > NOKTALAR[i + 1]) i++;
  const t = (hiz - NOKTALAR[i]) / (NOKTALAR[i + 1] - NOKTALAR[i]);
  return ((i + t) / SEG) * YAY;
}

function yayPath(aci) {
  const [x0, y0] = nokta(0, R_ARC);
  const [x1, y1] = nokta(Math.max(0.01, aci), R_ARC);
  const buyuk = aci > 180 ? 1 : 0;
  return `M ${x0.toFixed(2)} ${y0.toFixed(2)} A ${R_ARC} ${R_ARC} 0 ${buyuk} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
}

const TIKLER = NOKTALAR.map((v, i) => {
  const a = (i / SEG) * YAY;
  const [ix, iy] = nokta(a, R_ARC);
  const [ox, oy] = nokta(a, R_ARC + 6);
  const [lx, ly] = nokta(a, R_ARC + 17);
  return { v, ix, iy, ox, oy, lx, ly };
});

const etiketYaz = (v) => (v >= 1000 ? '1K' : String(v));
const mbps = (b, s) => (s > 0 ? (b * 8) / s / 1e6 : 0);
const sayiYaz = (n) => {
  if (!Number.isFinite(n)) return '—';
  if (n >= 100) return String(Math.round(n));
  if (n >= 10) return n.toFixed(1);
  return n.toFixed(2);
};
const msYaz = (n) => (Number.isFinite(n) && n > 0 ? String(Math.round(n)) : '—');

function rastgeleBuffer(boyut) {
  const buf = new Uint8Array(boyut);
  for (let i = 0; i < boyut; i += 65536) crypto.getRandomValues(buf.subarray(i, Math.min(i + 65536, boyut)));
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
    canli(((i + 1) / PING_SAYI) * 100, olcumler.length ? Math.min(...olcumler) : dt);
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
    signal.addEventListener('abort', () => {
      try {
        xhr.abort();
      } catch {}
    }, { once: true });
    try {
      xhr.open('POST', `${UC.yukle}?t=${Math.random()}`);
      xhr.send(veri);
    } catch {
      cozum();
    }
  });
}

async function yuklemeIsci(signal, veri, ekle) {
  while (!signal.aborted) await yuklemeGonder(veri, signal, ekle);
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

const DURUM = {
  hazir: 'Ölçmeye hazır',
  ping: 'Gecikme ölçülüyor',
  indirme: 'İndirme ölçülüyor',
  yukleme: 'Yükleme ölçülüyor',
  bitti: 'Test tamamlandı',
  hata: 'Bir sorun oldu',
};

const cizgi = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };
const IkonIndir = <svg viewBox="0 0 24 24" {...cizgi} className="h-4 w-4"><path d="M12 4v12M6 11l6 6 6-6M5 20h14" /></svg>;
const IkonYukle = <svg viewBox="0 0 24 24" {...cizgi} className="h-4 w-4"><path d="M12 20V8M6 13l6-6 6 6M5 4h14" /></svg>;
const IkonPing = <svg viewBox="0 0 24 24" {...cizgi} className="h-4 w-4"><path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 8v4l3 2" /></svg>;
const IkonJitter = <svg viewBox="0 0 24 24" {...cizgi} className="h-4 w-4"><path d="M3 12h3l2-6 4 12 2-6h4" /></svg>;
const IkonSunucu = <svg viewBox="0 0 24 24" {...cizgi} className="h-4 w-4"><path d="M4 5h16v6H4zM4 13h16v6H4zM8 8h.01M8 16h.01" /></svg>;
const IkonAg = <svg viewBox="0 0 24 24" {...cizgi} className="h-4 w-4"><path d="M5 12a10 10 0 0 1 14 0M8.5 15.5a5 5 0 0 1 7 0M12 19h.01" /></svg>;
const IkonPaylas = <svg viewBox="0 0 24 24" {...cizgi} className="h-[18px] w-[18px]"><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4M18 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM6 14.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM18 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" /></svg>;

const Gauge = memo(function Gauge({ needleRef, arcRef, numRef, birim, calisiyor, idle, baslaEtiket, onBasla }) {
  return (
    <div className="relative aspect-square w-[min(80vw,320px)]">
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-8 rounded-full bg-brand-400/20 blur-2xl transition-opacity duration-500 ${calisiyor ? 'opacity-100' : 'opacity-0'}`}
      />
      <svg viewBox="0 0 240 240" className="relative h-full w-full">
        <path d={yayPath(YAY)} fill="none" strokeWidth="9" strokeLinecap="round" className="stroke-line" />
        <path ref={arcRef} d={yayPath(0.01)} fill="none" strokeWidth="9" strokeLinecap="round" className="stroke-brand-500" />
        {TIKLER.map((t) => (
          <g key={t.v}>
            <line x1={t.ix} y1={t.iy} x2={t.ox} y2={t.oy} strokeWidth="1.5" strokeLinecap="round" className="stroke-muted" opacity="0.45" />
            {ETIKETLI.has(t.v) && (
              <text x={t.lx} y={t.ly} textAnchor="middle" dominantBaseline="middle" className="fill-muted" fontSize="9" fontWeight="600">
                {etiketYaz(t.v)}
              </text>
            )}
          </g>
        ))}
        <g ref={needleRef} transform={`rotate(-135 ${MERKEZ} ${MERKEZ})`} className="text-brand-500">
          <path d={`M ${MERKEZ} 46 L ${MERKEZ + 3} ${MERKEZ} L ${MERKEZ - 3} ${MERKEZ} Z`} fill="currentColor" />
        </g>
        <circle cx={MERKEZ} cy={MERKEZ} r="47" className="fill-surface stroke-line" strokeWidth="1.5" />
        <text ref={numRef} x={MERKEZ} y="112" textAnchor="middle" dominantBaseline="middle" className="fill-strong" fontSize="40" fontWeight="800" style={{ fontVariantNumeric: 'tabular-nums' }}>0</text>
        <text x={MERKEZ} y="140" textAnchor="middle" dominantBaseline="middle" className="fill-muted" fontSize="12" fontWeight="600">{birim}</text>
      </svg>
      {idle && (
        <button
          type="button"
          onClick={onBasla}
          data-umami-event="Hız Testi Başlat"
          className="absolute left-1/2 top-1/2 grid aspect-square w-[38%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-brand-500 text-[17px] font-extrabold uppercase tracking-wide text-white shadow-lg shadow-brand-500/30 transition-[transform,background-color] hover:scale-[1.04] hover:bg-brand-600"
        >
          {baslaEtiket}
        </button>
      )}
    </div>
  );
});

function useSayac(hedef, azalt) {
  const [deger, setDeger] = useState(hedef);
  const oncekiRef = useRef(hedef);
  useEffect(() => {
    if (hedef == null) {
      setDeger(null);
      oncekiRef.current = null;
      return;
    }
    if (azalt) {
      setDeger(hedef);
      oncekiRef.current = hedef;
      return;
    }
    const bas = performance.now();
    const bd = Number.isFinite(oncekiRef.current) ? oncekiRef.current : 0;
    let raf;
    const sure = 650;
    const tik = (t) => {
      const p = Math.min(1, (t - bas) / sure);
      const e = 1 - Math.pow(1 - p, 3);
      setDeger(bd + (hedef - bd) * e);
      if (p < 1) raf = requestAnimationFrame(tik);
      else oncekiRef.current = hedef;
    };
    raf = requestAnimationFrame(tik);
    return () => cancelAnimationFrame(raf);
  }, [hedef, azalt]);
  return deger;
}

const Metrik = memo(function Metrik({ etiket, deger, birim, ikon, aktif, azalt }) {
  const animli = useSayac(deger == null ? null : deger, azalt);
  const gosterim = animli == null ? '—' : birim === 'ms' ? String(Math.round(animli)) : sayiYaz(animli);
  return (
    <div
      className={`min-w-0 rounded-2xl border bg-surface p-4 [transition:border-color_300ms,box-shadow_300ms] ${
        aktif ? 'border-brand-500 shadow-lg shadow-brand-500/10' : 'border-line'
      }`}
    >
      <div className="flex min-w-0 items-center gap-2">
        <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl transition-colors ${aktif || deger != null ? 'bg-brandsoft text-brandtext' : 'bg-surface2 text-muted'}`}>
          {ikon}
        </span>
        <span className="min-w-0 truncate text-[12px] font-bold uppercase tracking-[0.08em] text-muted">{etiket}</span>
      </div>
      <div className="mt-3 flex min-w-0 items-baseline gap-1.5">
        <span className="min-w-0 truncate text-[26px] font-extrabold tabular-nums text-strong">{gosterim}</span>
        <span className="shrink-0 text-[13px] font-semibold text-muted">{birim}</span>
      </div>
    </div>
  );
});

function BilgiSatir({ ikon, etiket, ad, alt }) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brandsoft text-brandtext">{ikon}</span>
      <div className="min-w-0">
        <div className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted">{etiket}</div>
        <div className="truncate text-[14px] font-bold text-strong">{ad}</div>
        {alt ? <div className="truncate text-[12px] text-muted">{alt}</div> : null}
      </div>
    </div>
  );
}

export default function HizTesti() {
  const [asama, setAsama] = useState('hazir');
  const [sonuc, setSonuc] = useState(null);
  const [hata, setHata] = useState('');
  const [bilgi, setBilgi] = useState(null);
  const [azalt, setAzalt] = useState(false);
  const [kopyalandi, setKopyalandi] = useState(false);

  const iptalRef = useRef(null);
  const hedefRef = useRef(0);
  const gosRef = useRef(0);
  const fazRef = useRef('hazir');
  const needleRef = useRef(null);
  const arcRef = useRef(null);
  const numRef = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!mq) return;
    const f = () => setAzalt(mq.matches);
    f();
    mq.addEventListener?.('change', f);
    return () => mq.removeEventListener?.('change', f);
  }, []);

  useEffect(() => {
    let iptal = false;
    fetch(UC.bilgi, { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        if (!iptal) setBilgi(d);
      })
      .catch(() => {});
    return () => {
      iptal = true;
    };
  }, []);

  useEffect(() => () => iptalRef.current?.abort(), []);

  useEffect(() => {
    let raf;
    const dongu = () => {
      const hedef = hedefRef.current;
      gosRef.current += (hedef - gosRef.current) * (azalt ? 1 : 0.16);
      if (Math.abs(hedef - gosRef.current) < 0.02) gosRef.current = hedef;
      const v = gosRef.current;
      const pingFaz = fazRef.current === 'ping';
      if (numRef.current) numRef.current.textContent = pingFaz ? (v > 0 ? String(Math.round(v)) : '0') : sayiYaz(v);
      const a = pingFaz ? 0 : hizAci(v);
      if (needleRef.current) needleRef.current.setAttribute('transform', `rotate(${(a - 135).toFixed(2)} ${MERKEZ} ${MERKEZ})`);
      if (arcRef.current) arcRef.current.setAttribute('d', yayPath(a));
      raf = requestAnimationFrame(dongu);
    };
    raf = requestAnimationFrame(dongu);
    return () => cancelAnimationFrame(raf);
  }, [azalt]);

  const calisiyor = asama === 'ping' || asama === 'indirme' || asama === 'yukleme';
  const idle = asama === 'hazir' || asama === 'hata';

  const baslat = useCallback(async () => {
    if (calisiyor) return;
    const ac = new AbortController();
    iptalRef.current = ac;
    setHata('');
    setSonuc(null);
    setKopyalandi(false);
    hedefRef.current = 0;
    gosRef.current = 0;
    const canli = (yuzde, deger) => {
      hedefRef.current = deger;
    };
    const faz = (f) => {
      fazRef.current = f;
      setAsama(f);
      hedefRef.current = 0;
      gosRef.current = 0;
    };
    try {
      faz('ping');
      const p = await olcPing(ac.signal, canli);
      if (ac.signal.aborted) throw new Error('iptal');
      setSonuc({ ping: p.ping, jitter: p.jitter });

      faz('indirme');
      const indirme = await akisOlc({ disSignal: ac.signal, sure: INDIRME_SURE, tavan: INDIRME_TAVAN, akisSayisi: INDIRME_AKIS, isci: indirmeIsci, canli });
      if (ac.signal.aborted) throw new Error('iptal');
      setSonuc((s) => ({ ...s, indirme }));

      faz('yukleme');
      const veri = rastgeleBuffer(YUKLEME_BLOK);
      const yukleme = await akisOlc({ disSignal: ac.signal, sure: YUKLEME_SURE, tavan: YUKLEME_TAVAN, akisSayisi: YUKLEME_AKIS, isci: (s, e) => yuklemeIsci(s, veri, e), canli });
      if (ac.signal.aborted) throw new Error('iptal');
      setSonuc((s) => ({ ...s, yukleme }));

      fazRef.current = 'bitti';
      setAsama('bitti');
      hedefRef.current = indirme;
    } catch {
      if (ac.signal.aborted) {
        fazRef.current = 'hazir';
        setAsama('hazir');
        hedefRef.current = 0;
        gosRef.current = 0;
      } else {
        setHata('Ölçüm tamamlanamadı. Bağlantınızı kontrol edip tekrar deneyin.');
        fazRef.current = 'hata';
        setAsama('hata');
      }
    } finally {
      iptalRef.current = null;
    }
  }, [calisiyor]);

  const iptal = useCallback(() => iptalRef.current?.abort(), []);

  const paylas = useCallback(async () => {
    if (!sonuc || sonuc.indirme == null) return;
    const metin = `İnternet hız testim — İndirme ${sayiYaz(sonuc.indirme)} Mbit/s · Yükleme ${sayiYaz(sonuc.yukleme)} Mbit/s · Ping ${msYaz(sonuc.ping)} ms`;
    const url = 'https://sunucumweb.com/araclar/hiz-testi';
    try {
      if (navigator.share) {
        await navigator.share({ title: 'SunucumWEB Hız Testi', text: metin, url });
        return;
      }
    } catch {
      return;
    }
    try {
      await navigator.clipboard.writeText(`${metin} — ${url}`);
      setKopyalandi(true);
      setTimeout(() => setKopyalandi(false), 2200);
    } catch {}
  }, [sonuc]);

  const birim = asama === 'ping' ? 'ms' : 'Mbit/s';

  return (
    <div>
      {hata && (
        <div className="mb-6 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-center text-[14px] font-medium text-rose-600 dark:text-rose-400">
          {hata}
        </div>
      )}

      <div className="flex flex-col items-center">
        <Gauge
          needleRef={needleRef}
          arcRef={arcRef}
          numRef={numRef}
          birim={birim}
          calisiyor={calisiyor}
          idle={idle}
          baslaEtiket={asama === 'hata' ? 'Tekrar' : 'Başla'}
          onBasla={baslat}
        />

        <div className="mt-5 h-6 text-[14px] font-semibold text-muted">{DURUM[asama]}</div>

        <div className="mt-3 flex min-h-[48px] flex-wrap items-center justify-center gap-3">
          {calisiyor && (
            <button
              type="button"
              onClick={iptal}
              className="inline-flex h-12 items-center justify-center rounded-full border border-line bg-surface px-8 text-[15px] font-bold text-strong transition-colors hover:border-brandline"
            >
              İptal
            </button>
          )}
          {asama === 'bitti' && (
            <>
              <button
                type="button"
                onClick={baslat}
                data-umami-event="Hız Testi Başlat"
                className="inline-flex h-12 items-center justify-center rounded-full bg-brand-500 px-8 text-[15px] font-bold text-white shadow-lg shadow-brand-500/25 transition-colors hover:bg-brand-600"
              >
                Tekrar Test Et
              </button>
              {sonuc?.indirme != null && (
                <button
                  type="button"
                  onClick={paylas}
                  data-umami-event="Hız Testi Paylaş"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-brandline bg-brandsoft px-6 text-[15px] font-bold text-brandtext transition-colors hover:bg-brand-500 hover:text-white"
                >
                  {IkonPaylas}
                  {kopyalandi ? 'Kopyalandı' : 'Sonucu Paylaş'}
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Metrik etiket="İndirme" deger={sonuc?.indirme ?? null} birim="Mbit/s" ikon={IkonIndir} aktif={asama === 'indirme'} azalt={azalt} />
        <Metrik etiket="Yükleme" deger={sonuc?.yukleme ?? null} birim="Mbit/s" ikon={IkonYukle} aktif={asama === 'yukleme'} azalt={azalt} />
        <Metrik etiket="Ping" deger={sonuc?.ping ?? null} birim="ms" ikon={IkonPing} aktif={asama === 'ping'} azalt={azalt} />
        <Metrik etiket="Jitter" deger={sonuc?.jitter ?? null} birim="ms" ikon={IkonJitter} aktif={asama === 'ping'} azalt={azalt} />
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <BilgiSatir ikon={IkonSunucu} etiket="Sunucu" ad="SunucumWEB" alt={`Test sunucusu${bilgi?.ulke ? ` · ${bilgi.ulke}` : ' · Türkiye'}`} />
        <BilgiSatir
          ikon={IkonAg}
          etiket="Sağlayıcınız"
          ad={bilgi ? bilgi.saglayici || bilgi.asn || 'Bilinmiyor' : 'Algılanıyor…'}
          alt={[bilgi?.ip, bilgi?.ulke].filter(Boolean).join(' · ') || null}
        />
      </div>

      <p className="mt-6 text-center text-[13px] leading-relaxed text-muted">
        Ölçüm, SunucumWEB sunucusuna karşı gerçek zamanlı yapılır ve bağlantınızın anlık durumuna göre değişebilir.
        Test, hızınıza bağlı olarak birkaç yüz MB'a kadar veri kullanabilir.
      </p>
    </div>
  );
}
