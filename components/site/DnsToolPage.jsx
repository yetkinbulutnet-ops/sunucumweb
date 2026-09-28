import Link from 'next/link';
import { CtaBand, SiteShell } from './chrome';
import { AracKabugu, DigerAraclar } from './ToolsPage';
import ToolRunner from './ToolRunner';
import { dnsTipleri, metinAl } from '@/lib/cms';
import SayfaMetni from './SayfaMetni';

const yol = (alan, tip) => `/araclar/dns/${alan}${tip ? `/${tip.toLowerCase()}` : ''}`;

function TipKartlari({ alan, DNS_TIPLERI, m }) {
  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {DNS_TIPLERI.map((t) => (
        <Link
          key={t.tip}
          href={alan ? yol(alan, t.tip) : '/araclar/dns'}
          className="group rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-brandline"
        >
          <span className="inline-flex items-center gap-2">
            <code className="rounded-lg bg-brandsoft px-2 py-0.5 text-[13px] font-bold text-brandtext">{t.tip}</code>
            <span className="text-[13px] font-semibold text-muted">{t.kisa}</span>
          </span>
          <p className="mt-3 text-[14px] leading-relaxed text-body">{t.ozet}</p>
          {alan && (
            <span className="mt-3 inline-block text-[13px] font-bold text-brandtext">
              {m('dns.icin_sorgula', { alan })}
            </span>
          )}
        </Link>
      ))}
    </div>
  );
}

function TipAnlatimi({ tipBilgi, alan, m }) {
  return (
    <section className="mx-auto max-w-4xl px-5 lg:px-8 py-14 lg:py-16">
      <h2 className="text-2xl font-extrabold tracking-tight text-strong">
        {m('dns.nedir', { ad: tipBilgi.ad })}
      </h2>
      <p className="mt-4 text-[16px] leading-relaxed text-body">{tipBilgi.aciklama}</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-line bg-surface p-5">
          <h3 className="text-[13px] font-bold uppercase tracking-[0.12em] text-muted">{m('dns.ornek_deger')}</h3>
          <code className="mt-3 block break-all text-[14px] font-semibold text-strong">{tipBilgi.ornek}</code>
        </div>
        <div className="rounded-2xl border border-brandline bg-brandsoft p-5">
          <h3 className="text-[13px] font-bold uppercase tracking-[0.12em] text-brandtext">{m('dns.pratik_ipucu')}</h3>
          <p className="mt-3 text-[14px] leading-relaxed text-body">{tipBilgi.ipucu}</p>
        </div>
      </div>

      {alan && (
        <p className="mt-6 text-[15px] leading-relaxed text-body">
          {m('dns.tip_anlatim_1', { alan, tip: tipBilgi.tip })}{' '}
          <Link href={yol(alan)} className="font-bold text-brandtext hover:text-brand-500">
            {m('dns.tip_anlatim_link')}
          </Link>{' '}
          {m('dns.tip_anlatim_2')}
        </p>
      )}
    </section>
  );
}

function GenelAnlatim({ alan, m }) {
  return (
    <section className="mx-auto max-w-4xl px-5 lg:px-8 py-14 lg:py-16">
      <h2 className="text-2xl font-extrabold tracking-tight text-strong">{m('dns.yayilim_nedir')}</h2>
      <p className="mt-4 text-[16px] leading-relaxed text-body">
        {m('dns.yayilim_p1')}
      </p>
      <p className="mt-4 text-[16px] leading-relaxed text-body">
        {m('dns.yayilim_p2', { ozne: alan ? m('dns.yayilim_ozne_alan', { alan }) : m('dns.yayilim_ozne') })}
      </p>
    </section>
  );
}

export default async function DnsToolPage({ arac, alan = '', tip = '', veri = null, hata = '' }) {
  const DNS_TIPLERI = await dnsTipleri();
  const m = await metinAl();
  const tipBilgi = tip ? DNS_TIPLERI.find((t) => t.tip === String(tip).toUpperCase()) || null : null;

  const baslik = alan
    ? tipBilgi
      ? m('dns.baslik_tip', { alan, tip: tipBilgi.tip })
      : m('dns.baslik_alan', { alan })
    : arac.baslik;

  const ozet = alan
    ? tipBilgi
      ? m('dns.ozet_tip', { alan, tip: tipBilgi.tip, ozet: tipBilgi.ozet })
      : m('dns.ozet_alan', { alan })
    : arac.ozet;

  const kirinti = [{ metin: arac.kisa, yol: alan ? '/araclar/dns' : null }];
  if (alan) kirinti.push({ metin: alan, yol: tipBilgi ? yol(alan) : null });
  if (tipBilgi) kirinti.push({ metin: tipBilgi.tip });

  return (
    <SiteShell>
      <SayfaMetni onekler={['arac', 'dnsrapor']}>
      <AracKabugu arac={arac} kirinti={kirinti} baslik={baslik} ozet={ozet}>
        <ToolRunner arac={arac} baslangicGirdi={alan} baslangicTip={tipBilgi ? tipBilgi.tip : 'TUM'} veri={veri} />

        {hata && (
          <p className="mt-6 rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-[14px] font-medium text-amber-800 dark:text-amber-400">
            {hata}
          </p>
        )}
      </AracKabugu>

      {alan && (
        <section className="border-b border-line bg-surface2">
          <div className="mx-auto max-w-4xl px-5 lg:px-8 py-12">
            <h2 className="text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">
              {m('dns.diger_tipler', { alan })}
            </h2>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                href={yol(alan)}
                className={`rounded-lg px-3 py-1.5 text-[13px] font-bold transition-colors ${
                  tipBilgi ? 'bg-surface text-body hover:bg-brandsoft hover:text-brandtext' : 'bg-brand-700 text-white'
                }`}
              >
                {m('arac.tumu')}
              </Link>
              {DNS_TIPLERI.map((t) => (
                <Link
                  key={t.tip}
                  href={yol(alan, t.tip)}
                  className={`rounded-lg px-3 py-1.5 text-[13px] font-bold transition-colors ${
                    tipBilgi?.tip === t.tip ? 'bg-brand-700 text-white' : 'bg-surface text-body hover:bg-brandsoft hover:text-brandtext'
                  }`}
                >
                  {t.tip}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {tipBilgi ? <TipAnlatimi tipBilgi={tipBilgi} alan={alan} m={m} /> : <GenelAnlatim alan={alan} m={m} />}

      {!alan && (
        <section className="border-t border-line bg-surface2">
          <div className="mx-auto max-w-7xl px-5 lg:px-8 py-14 lg:py-16">
            <h2 className="text-2xl font-extrabold tracking-tight text-strong">{m('dns.kayit_tipleri')}</h2>
            <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-body">
              {m('dns.kayit_tipleri_aciklama')}
            </p>
            <TipKartlari alan={alan} DNS_TIPLERI={DNS_TIPLERI} m={m} />
          </div>
        </section>
      )}

      <DigerAraclar slug="dns" />
      <CtaBand />
      </SayfaMetni>
    </SiteShell>
  );
}
