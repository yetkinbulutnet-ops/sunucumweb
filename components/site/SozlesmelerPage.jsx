'use client';
import Link from 'next/link';
import { Icon, CtaBand, SiteShell, PageHero } from './chrome';
import { SOZLESMELER } from '@/content/site/sozlesmeler';

export default function SozlesmelerPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="Yasal"
        breadcrumb="Sözleşmeler"
        title="Sözleşmeler ve yasal belgeler"
        text="Hizmetlerimizi kullanırken geçerli olan tüm sözleşme, politika ve yasal metinlere buradan ulaşabilirsiniz."
      />

      <section className="mx-auto max-w-7xl px-5 lg:px-8 py-16 lg:py-20">
        {SOZLESMELER.length === 0 ? (
          <p className="text-center text-[15px] text-body">Şu anda yayımlanmış bir belge bulunmuyor.</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
            {SOZLESMELER.map((s) => (
              <Link
                key={s.slug}
                href={`/${s.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-6 shadow-[0_10px_40px_-24px_rgba(15,41,66,0.25)] transition-[transform,box-shadow,border-color] hover:-translate-y-1 hover:border-brandline hover:shadow-[0_24px_60px_-28px_rgba(20,184,166,0.35)]"
              >
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brandsoft text-brandtext transition-colors group-hover:bg-brand-500 group-hover:text-white">
                  <Icon name={s.icon} />
                </span>
                <h2 className="mt-5 text-[17px] font-bold text-strong text-balance">{s.baslik}</h2>
                <p className="mt-2 flex-1 text-[14px] leading-relaxed text-body">{s.ozet}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-[14px] font-bold text-brandtext">
                  Belgeyi oku
                  <Icon name="arrow" className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-12 rounded-2xl border border-line bg-surface2 p-6 sm:p-7">
          <div className="flex items-start gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brandsoft text-brandtext">
              <Icon name="question" className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-[17px] font-bold text-strong">Belgelerle ilgili sorunuz mu var?</h2>
              <p className="mt-1.5 text-[14px] leading-relaxed text-body">
                Sözleşme maddeleri hakkında aklınıza takılan her şey için hukuk ve destek ekibimiz yanınızda.
              </p>
              <Link href="/iletisim" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-brand-600">
                Bize Ulaşın <Icon name="arrow" className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CtaBand />
    </SiteShell>
  );
}
