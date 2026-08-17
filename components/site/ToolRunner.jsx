'use client';
import { useCallback, useState } from 'react';
import { Icon } from './chrome';

const DURUM_TONU = {
  iyi: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-emerald-500/25',
  orta: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-amber-500/25',
  eksik: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-amber-500/25',
  riskli: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 ring-rose-500/25',
  yok: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 ring-rose-500/25',
};

const tarihYaz = (deger) => {
  if (!deger) return '—';
  const t = new Date(deger);
  return Number.isNaN(t.getTime())
    ? '—'
    : t.toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' });
};

function Kutu({ baslik, children }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-6">
      <h3 className="text-[13px] font-bold uppercase tracking-[0.12em] text-muted">{baslik}</h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Satir({ etiket, deger }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-line/70 py-2.5 last:border-0">
      <span className="text-[13px] text-muted">{etiket}</span>
      <span className="break-all text-[15px] font-semibold text-strong">{deger ?? '—'}</span>
    </div>
  );
}

function Rozet({ durum, children }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-bold ring-1 ${DURUM_TONU[durum] || DURUM_TONU.orta}`}>
      {children}
    </span>
  );
}

function DnsSonuc({ veri }) {
  const dolu = veri.kayitlar.filter((k) => k.bulundu);
  const bos = veri.kayitlar.filter((k) => !k.bulundu).map((k) => k.tip);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {dolu.map((k) => (
        <Kutu key={k.tip} baslik={`${k.tip} kaydı`}>
          <ul className="space-y-2.5">
            {k.kayitlar.map((kayit, i) => (
              <li key={`${kayit.deger}-${i}`} className="flex items-baseline justify-between gap-4">
                <code className="break-all text-[14px] font-semibold text-strong">{kayit.deger}</code>
                <span className="shrink-0 text-[12px] tabular-nums text-muted">{kayit.ttl}s</span>
              </li>
            ))}
          </ul>
        </Kutu>
      ))}
      {bos.length > 0 && (
        <div className="sm:col-span-2">
          <p className="text-[14px] text-muted">Kayıt bulunmayan tipler: {bos.join(', ')}</p>
        </div>
      )}
    </div>
  );
}

function WhoisSonuc({ veri }) {
  if (!veri.kayitli) {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6">
        <p className="text-[15px] font-semibold text-strong">{veri.alan} kayıtlı görünmüyor.</p>
        <p className="mt-1 text-[14px] text-body">Bu alan adı müsait olabilir; tescil için alan adı sayfamızdan sorgulayın.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Kutu baslik="Kayıt bilgileri">
        <Satir etiket="Alan adı" deger={veri.alan.toLowerCase()} />
        <Satir etiket="Kayıt firması" deger={veri.kayitFirmasi} />
        <Satir etiket="Tescil tarihi" deger={tarihYaz(veri.tarihler.kayit)} />
        <Satir etiket="Son güncelleme" deger={tarihYaz(veri.tarihler.guncelleme)} />
        <Satir etiket="Bitiş tarihi" deger={tarihYaz(veri.tarihler.bitis)} />
      </Kutu>

      <Kutu baslik="İsim sunucuları">
        {veri.isimSunuculari.length ? (
          <ul className="space-y-2">
            {veri.isimSunuculari.map((n) => (
              <li key={n} className="break-all text-[14px] font-semibold text-strong">{n}</li>
            ))}
          </ul>
        ) : (
          <p className="text-[14px] text-muted">İsim sunucusu bildirilmemiş.</p>
        )}

        {veri.durumlar.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {veri.durumlar.map((d) => (
              <span key={d} className="rounded-full bg-surface2 px-2.5 py-1 text-[12px] font-semibold text-body ring-1 ring-line">
                {d}
              </span>
            ))}
          </div>
        )}
      </Kutu>
    </div>
  );
}

function SslSonuc({ veri }) {
  const uyari = veri.kalanGun !== null && veri.kalanGun < 30;
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Kutu baslik="Sertifika">
        <Satir etiket="Durum" deger={veri.gecerli ? 'Geçerli' : `Sorunlu (${veri.gecersizlikSebebi || 'doğrulanamadı'})`} />
        <Satir etiket="Sağlayıcı" deger={veri.saglayici} />
        <Satir etiket="Sahip" deger={veri.sahip} />
        <Satir etiket="Protokol" deger={veri.protokol} />
      </Kutu>

      <Kutu baslik="Geçerlilik">
        <Satir etiket="Başlangıç" deger={tarihYaz(veri.baslangic)} />
        <Satir etiket="Bitiş" deger={tarihYaz(veri.bitis)} />
        <div className="mt-4 flex items-center gap-3">
          <Rozet durum={uyari ? 'orta' : 'iyi'}>
            {veri.kalanGun !== null ? `${veri.kalanGun} gün kaldı` : 'Süre okunamadı'}
          </Rozet>
          {uyari && <span className="text-[13px] text-body">Yenileme zamanı yaklaştı.</span>}
        </div>
        {veri.alternatifSayisi > 0 && (
          <p className="mt-4 text-[13px] leading-relaxed text-muted">
            Kapsanan alan adları ({veri.alternatifSayisi}): {veri.alternatifler.join(', ')}
            {veri.alternatifSayisi > veri.alternatifler.length ? '…' : ''}
          </p>
        )}
      </Kutu>
    </div>
  );
}

function EpostaSonuc({ veri }) {
  return (
    <div className="grid gap-4">
      <Kutu baslik="Posta sunucuları (MX)">
        {veri.mx.bulundu ? (
          <ul className="space-y-2.5">
            {veri.mx.sunucular.map((s) => (
              <li key={s.sunucu} className="flex items-baseline justify-between gap-4">
                <span className="break-all text-[14px] font-semibold text-strong">{s.sunucu}</span>
                <span className="shrink-0 text-[12px] text-muted">öncelik {s.oncelik}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[14px] text-body">MX kaydı yok; bu alan adına e-posta ulaşmaz.</p>
        )}
      </Kutu>

      {['spf', 'dmarc'].map((k) => (
        <Kutu key={k} baslik={k.toUpperCase()}>
          <div className="flex flex-wrap items-center gap-3">
            <Rozet durum={veri[k].durum}>{veri[k].durum === 'iyi' ? 'Uygun' : veri[k].durum === 'yok' ? 'Eksik' : 'Dikkat'}</Rozet>
            <span className="text-[14px] text-body">{veri[k].mesaj}</span>
          </div>
          {veri[k].kayit && (
            <code className="mt-3 block break-all rounded-xl bg-surface2 p-3 text-[13px] text-body">{veri[k].kayit}</code>
          )}
        </Kutu>
      ))}
    </div>
  );
}

function IpSonuc({ veri }) {
  return (
    <Kutu baslik={veri.kendiIpiniz ? 'Bağlandığınız IP adresi' : 'Sorgulanan IP'}>
      <p className="text-3xl font-extrabold tracking-tight text-strong">{veri.adres}</p>
      <div className="mt-4">
        <span className="text-[13px] text-muted">Ters DNS (PTR)</span>
        {veri.ptr.length ? (
          <ul className="mt-1.5 space-y-1">
            {veri.ptr.map((p) => (
              <li key={p} className="break-all text-[15px] font-semibold text-strong">{p}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-1.5 text-[15px] text-body">PTR kaydı tanımlı değil.</p>
        )}
      </div>
    </Kutu>
  );
}

const SONUC = { dns: DnsSonuc, whois: WhoisSonuc, ssl: SslSonuc, eposta: EpostaSonuc, ip: IpSonuc };

export default function ToolRunner({ arac }) {
  const [girdi, setGirdi] = useState('');
  const [veri, setVeri] = useState(null);
  const [hata, setHata] = useState('');
  const [yukleniyor, setYukleniyor] = useState(false);

  const sorgula = useCallback(async (e) => {
    e?.preventDefault();
    if (!girdi.trim() && !arac.girdiOpsiyonel) {
      setHata(`${arac.girdiEtiketi} girin.`);
      return;
    }
    setYukleniyor(true);
    setHata('');
    setVeri(null);
    try {
      const r = await fetch(`/api/araclar/${arac.slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ girdi: girdi.trim() }),
      });
      const d = await r.json();
      if (d.ok) setVeri(d.data);
      else setHata(d.error?.message || 'Sorgu tamamlanamadı.');
    } catch {
      setHata('Sunucuya ulaşılamadı. Bağlantınızı kontrol edip tekrar deneyin.');
    } finally {
      setYukleniyor(false);
    }
  }, [girdi, arac]);

  const Sonuc = SONUC[arac.slug];

  return (
    <div>
      <form onSubmit={sorgula} className="flex flex-col gap-3 sm:flex-row">
        <label className="flex-1">
          <span className="sr-only">{arac.girdiEtiketi}</span>
          <input
            value={girdi}
            onChange={(e) => { setGirdi(e.target.value); if (hata) setHata(''); }}
            placeholder={arac.girdiOpsiyonel ? `${arac.ornek} (boş bırakırsanız kendi IP'niz)` : arac.ornek}
            inputMode="url"
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            className="w-full rounded-xl border border-line bg-surface px-4 py-3.5 text-[16px] text-strong outline-none transition-colors placeholder:text-muted focus:border-brand-400"
          />
        </label>
        <button
          type="submit"
          disabled={yukleniyor}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-6 py-3.5 text-[15px] font-bold text-white shadow-lg shadow-brand-500/25 transition-colors hover:bg-brand-600 disabled:opacity-60"
        >
          {yukleniyor ? 'Sorgulanıyor…' : 'Sorgula'}
          {!yukleniyor && <Icon name="arrow" className="h-4 w-4" />}
        </button>
      </form>

      {hata && (
        <p className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/5 px-4 py-3 text-[14px] font-medium text-rose-600 dark:text-rose-400">
          {hata}
        </p>
      )}

      {veri && Sonuc && (
        <div className="mt-8 animate-[fadeup_0.4s_ease-out]">
          <Sonuc veri={veri} />
        </div>
      )}
    </div>
  );
}
