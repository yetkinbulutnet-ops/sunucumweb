'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Icon, SiteShell, CtaBand, PageHero } from './chrome';
import { KAMPANYALAR, KAMPANYA_META } from '@/content/site/kampanyalar';
import { useParabirimi } from './CurrencyProvider';

const TON = {
  yesil: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 ring-emerald-500/30',
  sari: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 ring-amber-500/30',
  mavi: 'bg-sky-500/15 text-sky-600 dark:text-sky-400 ring-sky-500/30',
  kirmizi: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 ring-rose-500/30',
};

function KuponKutu({ kod }) {
  const [kopya, setKopya] = useState(false);
  const onayla = () => { setKopya(true); setTimeout(() => setKopya(false), 1600); };
  const kopyala = async () => {
    try {
      await navigator.clipboard.writeText(kod);
      onayla();
      return;
    } catch {  }
    try {
      const ta = document.createElement('textarea');
      ta.value = kod;
      ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      onayla();
    } catch {  }
  };
  return (
    <button
      type="button"
      onClick={kopyala}
      data-umami-event="Kupon Kopyala"
      data-umami-event-kupon={kod}
      className="mt-4 flex w-full items-center justify-between gap-3 rounded-xl border border-dashed border-brandline bg-brandsoft/50 px-3.5 py-2.5 text-left transition-colors hover:bg-brandsoft"
    >
      <span className="min-w-0">
        <span className="block text-[11px] font-semibold uppercase tracking-wide text-muted">Kampanya kodu</span>
        <span className="block truncate font-mono text-[15px] font-extrabold tracking-wider text-brandtext">{kod}</span>
      </span>
      <span className="inline-flex shrink-0 items-center gap-1.5 text-[12.5px] font-bold text-brandtext">
        <Icon name={kopya ? 'check' : 'copy'} className="h-4 w-4" />
        {kopya ? 'Kopyalandı' : 'Kopyala'}
      </span>
    </button>
  );
}

function KampanyaKart({ k }) {
  const { fiyat } = useParabirimi();
  return (
    <article
      className={`flex h-full flex-col rounded-3xl border bg-surface p-6 shadow-[0_20px_50px_-30px_rgba(15,41,66,0.3)] transition-[transform,box-shadow,border-color] hover:-translate-y-1 hover:shadow-[0_28px_60px_-28px_rgba(20,184,166,0.35)] ${
        k.vurgu ? 'border-brandline ring-1 ring-brandline' : 'border-line'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brandsoft text-brandtext">
          <Icon name={k.icon || 'tag'} />
        </span>
        <span className="inline-flex items-baseline gap-1 rounded-xl bg-brand-500 px-3 py-1.5 text-white shadow-lg shadow-brand-500/25">
          <span className="text-[18px] font-extrabold leading-none">%{k.indirim}</span>
          <span className="text-[11px] font-bold uppercase tracking-wide opacity-90">indirim</span>
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-[12px] font-bold uppercase tracking-wide text-brandtext">{k.kategori}</span>
        {k.rozet && (
          <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide ring-1 ${TON[k.rTon] || TON.yesil}`}>
            {k.rozet}
          </span>
        )}
      </div>

      <h2 className="mt-2 text-xl font-extrabold tracking-tight text-strong text-balance">{k.baslik}</h2>
      <p className="mt-2 flex-1 text-[14.5px] leading-relaxed text-body">{k.aciklama}</p>

      {(k.yeniFiyat || k.eskiFiyat) && (
        <div className="mt-5 flex flex-wrap items-end gap-x-2 gap-y-1">
          {k.eskiFiyat && <span className="text-[15px] text-muted line-through">{fiyat(k.eskiFiyat)}</span>}
          {k.yeniFiyat && <span className="text-2xl font-extrabold tracking-tight text-strong">{fiyat(k.yeniFiyat)}</span>}
          {k.periyot && <span className="text-[13px] text-muted">{k.periyot}</span>}
        </div>
      )}

      {k.kupon && <KuponKutu kod={k.kupon} />}

      {k.bitis && (
        <div className="mt-3 flex items-center gap-1.5 text-[12.5px] text-muted">
          <Icon name="clock" className="h-3.5 w-3.5 shrink-0" /> Son tarih: {k.bitis}
        </div>
      )}

      <Link
        href={k.href}
        data-umami-event="Kampanya"
        data-umami-event-kampanya={k.baslik}
        className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-5 py-3 text-[14px] font-bold text-white transition-colors hover:bg-brand-600"
      >
        {k.cta || 'İncele'} <Icon name="arrow" className="h-4 w-4" />
      </Link>
    </article>
  );
}

export default function KampanyalarPage() {
  return (
    <SiteShell>
      <PageHero eyebrow={KAMPANYA_META.eyebrow} title={KAMPANYA_META.baslik} text={KAMPANYA_META.aciklama} breadcrumb="Kampanyalar" />

      <section className="mx-auto max-w-7xl px-5 lg:px-8 py-16 lg:py-20">
        {KAMPANYALAR.length === 0 ? (
          <div className="mx-auto max-w-md rounded-3xl border border-line bg-surface p-10 text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-surface2 text-muted">
              <Icon name="tag" className="h-6 w-6" />
            </span>
            <p className="mt-5 text-[16px] font-bold text-strong">Şu an aktif kampanya yok</p>
            <p className="mt-2 text-[14px] leading-relaxed text-body">
              Yeni fırsatlar için takipte kalın. Dilerseniz güncel paketlerimizi hemen inceleyebilirsiniz.
            </p>
            <Link href="/web-hosting" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-3 text-[14px] font-bold text-white transition-colors hover:bg-brand-600">
              Paketleri Gör <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {KAMPANYALAR.map((k) => <KampanyaKart key={k.id} k={k} />)}
          </div>
        )}

        <p className="mt-10 text-center text-sm text-muted">
          Kampanya kodunu sipariş sırasında “İndirim Kodu” alanına girmeniz yeterli. Sorularınız için{' '}
          <Link href="/iletisim" className="font-semibold text-brandtext hover:underline">bize ulaşın</Link>.
        </p>
      </section>

      <CtaBand title="Fırsatı kaçırmayın" text="Kampanyalı paketler sınırlı sürelidir. Doğru çözümü birlikte belirleyelim." />
    </SiteShell>
  );
}
