'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Icon, SiteShell, PageHero, SOSYAL } from './chrome';
import { KONULAR } from '@/content/site/iletisim';
import { mesaiDurumu } from '@/lib/engines/mesai';

const KANALLAR = [
  { icon: 'phone', t: 'Telefon', v: '0(850) 302 5809', d: 'Hafta içi 09:00 – 18:00', href: 'tel:08503025809' },
  { icon: 'chat', t: 'Canlı destek', v: 'Müşteri paneli', d: '7/24 teknik ekip', href: 'https://my.sunucumweb.com' },
  { icon: 'mail', t: 'E-posta', v: 'info@sunucumweb.com', d: 'Aynı gün içinde yanıt', href: 'mailto:info@sunucumweb.com' },
  { icon: 'pin', t: 'Adres', v: 'Hasanbey Mah. Sokullu Sok. No: 16', d: 'Keçiborlu / Isparta', href: null },
];

function MesaiRozeti() {
  const [durum, setDurum] = useState(null);

  useEffect(() => {
    const guncelle = () => setDurum(mesaiDurumu());
    guncelle();
    const sayac = setInterval(guncelle, 60_000);
    return () => clearInterval(sayac);
  }, []);

  if (!durum) {
    return <div className="h-[92px] rounded-2xl border border-line bg-surface2/60" aria-hidden />;
  }

  return (
    <div
      className={`rounded-2xl border p-5 ${
        durum.acik
          ? 'border-emerald-500/30 bg-emerald-500/5'
          : 'border-line bg-surface2/70'
      }`}
    >
      <div className="flex items-center gap-2.5">
        <span className="relative flex h-2.5 w-2.5">
          {durum.acik && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />}
          <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${durum.acik ? 'bg-emerald-500' : 'bg-muted'}`} />
        </span>
        <span className={`text-[15px] font-extrabold ${durum.acik ? 'text-emerald-600 dark:text-emerald-400' : 'text-strong'}`}>
          {durum.baslik}
        </span>
        <span className="ml-auto text-[12px] tabular-nums text-muted">
          {durum.gunAdi} · {durum.yerelSaat}
        </span>
      </div>
      <p className="mt-2 text-[14px] leading-relaxed text-body">{durum.aciklama}</p>
    </div>
  );
}

function Alan({ etiket, ad, tip = 'text', deger, onChange, hata, ipucu, ...kalan }) {
  return (
    <label className="block">
      <span className="text-[13px] font-semibold text-strong">
        {etiket} <span className="text-brandtext">*</span>
      </span>
      <input
        name={ad}
        type={tip}
        value={deger}
        onChange={onChange}
        aria-invalid={!!hata}
        aria-describedby={hata ? `${ad}-hata` : undefined}
        className={`mt-1.5 w-full rounded-xl border bg-surface px-4 py-3 text-[16px] text-strong outline-none transition-colors placeholder:text-muted focus:border-brand-400 ${
          hata ? 'border-rose-400' : 'border-line'
        }`}
        {...kalan}
      />
      {hata ? (
        <span id={`${ad}-hata`} className="mt-1 block text-[12px] font-medium text-rose-600 dark:text-rose-400">{hata}</span>
      ) : ipucu ? (
        <span className="mt-1 block text-[12px] text-muted">{ipucu}</span>
      ) : null}
    </label>
  );
}

const BOS = { ad: '', telefon: '', eposta: '', konu: '', mesaj: '', website: '' };

export default function ContactPage() {
  const [form, setForm] = useState(BOS);
  const [hatalar, setHatalar] = useState({});
  const [durum, setDurum] = useState('bos');
  const [uyari, setUyari] = useState('');
  const acilis = useRef(Date.now());

  const degistir = useCallback((e) => {
    const { name, value } = e.target;
    setForm((v) => ({ ...v, [name]: value }));
    setHatalar((v) => (v[name] ? { ...v, [name]: null } : v));
  }, []);

  const gonder = useCallback(async (e) => {
    e.preventDefault();
    setDurum('gonderiliyor');
    setUyari('');
    try {
      const r = await fetch('/api/iletisim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, sure: Date.now() - acilis.current }),
      });
      const d = await r.json();

      if (d.ok) {
        setDurum('tamam');
        setForm(BOS);
        setHatalar({});
        return;
      }

      setDurum('bos');
      setHatalar(d.meta?.hatalar || {});
      setUyari(d.error?.message || 'Mesajınız iletilemedi.');
    } catch {
      setDurum('bos');
      setUyari('Sunucuya ulaşılamadı. Bağlantınızı kontrol edip tekrar deneyin.');
    }
  }, [form]);

  return (
    <SiteShell>
      <PageHero
        eyebrow="İletişim"
        title="Size nasıl yardımcı olabiliriz?"
        breadcrumb="İletişim"
        text="Satış, teknik destek veya kurumsal talepleriniz için formu doldurun; ekibimiz aynı gün içinde dönüş yapsın."
      />

      <section className="mx-auto max-w-7xl px-5 lg:px-8 py-14 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
          <div className="grid content-start gap-4">
            <MesaiRozeti />

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {KANALLAR.map((k) => {
                const icerik = (
                  <>
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brandsoft text-brandtext transition-colors group-hover:bg-brand-500 group-hover:text-white">
                      <Icon name={k.icon} className="h-5 w-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[12px] font-bold uppercase tracking-wider text-muted">{k.t}</span>
                      <span className="mt-0.5 block break-words text-[15px] font-bold text-strong">{k.v}</span>
                      <span className="block text-[12px] text-muted">{k.d}</span>
                    </span>
                  </>
                );
                const sinif = 'group flex items-start gap-3.5 rounded-2xl border border-line bg-surface p-4 transition-colors hover:border-brandline';
                return k.href ? (
                  <a key={k.t} href={k.href} target={k.href.startsWith('http') ? '_blank' : undefined} rel={k.href.startsWith('http') ? 'noopener noreferrer' : undefined} className={sinif}>
                    {icerik}
                  </a>
                ) : (
                  <div key={k.t} className={sinif}>{icerik}</div>
                );
              })}
            </div>

            <div className="rounded-2xl border border-line bg-surface p-5">
              <div className="text-[12px] font-bold uppercase tracking-wider text-muted">Sosyal medya</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {SOSYAL.map((s) => (
                  <a
                    key={s.ad}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.ad}
                    title={s.ad}
                    className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-surface2 text-body transition-colors hover:border-brandline hover:bg-brand-500 hover:text-white"
                  >
                    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d={s.d} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-line bg-surface p-6 shadow-[0_30px_70px_-45px_rgba(15,41,66,0.45)] sm:p-8">
            {durum === 'tamam' ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-500 text-white">
                  <Icon name="check" className="h-7 w-7" />
                </span>
                <h2 className="mt-5 text-2xl font-extrabold tracking-tight text-strong">Mesajınız bize ulaştı</h2>
                <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-body">
                  Talebiniz ilgili ekibe iletildi. Acil bir konuysa 0(850) 302 5809 numaralı hattımızdan doğrudan ulaşabilirsiniz.
                </p>
                <button
                  type="button"
                  onClick={() => setDurum('bos')}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl border border-line px-5 py-2.5 text-[14px] font-bold text-strong transition-colors hover:border-brandline hover:text-brandtext"
                >
                  Yeni mesaj yaz
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-extrabold tracking-tight text-strong">Bize yazın</h2>
                <p className="mt-2 text-[15px] text-body">
                  Yıldızlı alanların tamamı zorunludur. Talebinizi doğru ekibe yönlendirebilmek için konuyu seçin.
                </p>

                <form onSubmit={gonder} noValidate className="mt-7 grid gap-4">
                  <input
                    type="text"
                    name="website"
                    value={form.website}
                    onChange={degistir}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden
                    className="pointer-events-none absolute h-0 w-0 opacity-0"
                  />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Alan etiket="Ad Soyad" ad="ad" deger={form.ad} onChange={degistir} hata={hatalar.ad} placeholder="Adınız Soyadınız" autoComplete="name" required />
                    <Alan etiket="Telefon" ad="telefon" tip="tel" deger={form.telefon} onChange={degistir} hata={hatalar.telefon} placeholder="0555 555 55 55" autoComplete="tel" inputMode="tel" required />
                  </div>

                  <Alan etiket="E-posta" ad="eposta" tip="email" deger={form.eposta} onChange={degistir} hata={hatalar.eposta} placeholder="ornek@firma.com" autoComplete="email" inputMode="email" required />

                  <label className="block">
                    <span className="text-[13px] font-semibold text-strong">Görüşme konusu <span className="text-brandtext">*</span></span>
                    <select
                      name="konu"
                      value={form.konu}
                      onChange={degistir}
                      required
                      aria-invalid={!!hatalar.konu}
                      className={`mt-1.5 w-full appearance-none rounded-xl border bg-surface bg-[length:18px] bg-[right_1rem_center] bg-no-repeat px-4 py-3 text-[16px] text-strong outline-none transition-colors focus:border-brand-400 ${
                        hatalar.konu ? 'border-rose-400' : 'border-line'
                      } ${form.konu ? 'text-strong' : 'text-muted'}`}
                      style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2376869b' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")" }}
                    >
                      <option value="">Konu seçin…</option>
                      {KONULAR.map((k) => (
                        <option key={k.deger} value={k.deger}>{k.etiket}</option>
                      ))}
                    </select>
                    {hatalar.konu && <span className="mt-1 block text-[12px] font-medium text-rose-600 dark:text-rose-400">{hatalar.konu}</span>}
                  </label>

                  <label className="block">
                    <span className="text-[13px] font-semibold text-strong">Mesajınız <span className="text-brandtext">*</span></span>
                    <textarea
                      name="mesaj"
                      value={form.mesaj}
                      onChange={degistir}
                      rows={6}
                      required
                      aria-invalid={!!hatalar.mesaj}
                      placeholder="Talebinizi kısaca anlatın: kullandığınız hizmet, alan adı, karşılaştığınız durum…"
                      className={`mt-1.5 w-full rounded-xl border bg-surface px-4 py-3 text-[16px] leading-relaxed text-strong outline-none transition-colors placeholder:text-muted focus:border-brand-400 ${
                        hatalar.mesaj ? 'border-rose-400' : 'border-line'
                      }`}
                    />
                    {hatalar.mesaj ? (
                      <span className="mt-1 block text-[12px] font-medium text-rose-600 dark:text-rose-400">{hatalar.mesaj}</span>
                    ) : (
                      <span className="mt-1 block text-[12px] text-muted">{form.mesaj.length} / 4000 karakter</span>
                    )}
                  </label>

                  {uyari && (
                    <p className="rounded-xl border border-rose-500/30 bg-rose-500/5 px-4 py-3 text-[14px] font-medium text-rose-600 dark:text-rose-400">
                      {uyari}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={durum === 'gonderiliyor'}
                    className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-6 py-3.5 text-[15px] font-bold text-white shadow-lg shadow-brand-500/25 transition-colors hover:bg-brand-600 disabled:opacity-60"
                  >
                    {durum === 'gonderiliyor' ? 'Gönderiliyor…' : 'Mesajı Gönder'}
                    {durum !== 'gonderiliyor' && <Icon name="arrow" className="h-4 w-4" />}
                  </button>

                  <p className="text-[12px] leading-relaxed text-muted">
                    Paylaştığınız bilgiler yalnızca talebinize dönüş yapmak için kullanılır.
                    Ayrıntılar için <Link href="/gizlilik-sozlesmesi" className="font-semibold text-brandtext hover:underline">Gizlilik Sözleşmesi</Link>.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
