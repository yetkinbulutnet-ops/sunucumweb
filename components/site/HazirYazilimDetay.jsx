import Link from 'next/link';
import { Icon, SiteShell, CtaBand } from './chrome';
import AddToCartButton from './AddToCartButton';
import { YAZILIMLAR, YAZILIM_KATEGORILERI } from '@/content/site/yazilimlar';

const fiyatYaz = (n) => new Intl.NumberFormat('tr-TR').format(n);

const OZELLIKLER = [
  { icon: 'globe', t: 'Mobil Uyumlu', d: 'Telefon, tablet ve masaüstünde kusursuz, responsive görünüm.' },
  { icon: 'terminal', t: 'Açık Kaynak Kod', d: 'Kaynak kodu size ait; dilediğiniz gibi düzenleyip geliştirin.' },
  { icon: 'gauge', t: 'Yönetim Paneli', d: 'İçerik, ürün ve ayarları kolayca yönettiğiniz sezgisel panel.' },
  { icon: 'search', t: 'SEO Uyumlu', d: 'Arama motorlarında görünür, hızlı ve düzenli kod yapısı.' },
  { icon: 'shield', t: 'Güvenli Altyapı', d: 'Güncel, güvenli ve kararlı kod tabanı.' },
  { icon: 'headset', t: 'Kurulum & Destek', d: 'Kurulumu biz yapıyoruz; sonrasında da yanınızdayız.' },
];

function BenzerKart({ y }) {
  const kat = YAZILIM_KATEGORILERI.find((x) => x.slug === y.kategori);
  return (
    <Link href={`/hazir-yazilim/${y.id}`} className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_10px_40px_-24px_rgba(15,41,66,0.22)] transition-[transform,box-shadow,border-color] hover:-translate-y-1 hover:border-brandline">
      <div className="aspect-[4/3] overflow-hidden bg-surface2">
        <img src={y.img} alt={y.ad} width={640} height={480} loading="lazy" className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <span className="text-[11px] font-bold uppercase tracking-wide text-muted">{kat ? kat.ad : 'Yazılım'}</span>
        <h3 className="mt-1 text-[15px] font-extrabold text-strong">{y.ad}</h3>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-[16px] font-extrabold text-strong">{fiyatYaz(y.fiyat)} <span className="text-[12px] font-bold text-muted">₺</span></span>
          <span className="inline-flex items-center gap-1 text-[13px] font-bold text-brandtext">İncele <Icon name="arrow" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" /></span>
        </div>
      </div>
    </Link>
  );
}

export default function HazirYazilimDetay({ urun }) {
  const kat = YAZILIM_KATEGORILERI.find((k) => k.slug === urun.kategori);
  const benzer = YAZILIMLAR.filter((y) => y.kategori === urun.kategori && y.id !== urun.id).slice(0, 3);
  const indirim = urun.eskiFiyat > urun.fiyat ? Math.round((1 - urun.fiyat / urun.eskiFiyat) * 100) : 0;

  return (
    <SiteShell>
      <section className="relative overflow-hidden border-b border-line">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-32 right-[-8%] h-[420px] w-[420px] rounded-full bg-brand-200/40 blur-[120px]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(var(--c-grid))_1px,transparent_1px),linear-gradient(to_bottom,rgb(var(--c-grid))_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]" />
        </div>
        <div className="mx-auto max-w-7xl px-5 lg:px-8 py-12 lg:py-16">
          <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted">
            <Link href="/" className="hover:text-brandtext">Ana Sayfa</Link><span>/</span>
            <Link href="/hazir-yazilim" className="hover:text-brandtext">Hazır Yazılımlar</Link><span>/</span>
            <span className="font-medium text-strong/70">{urun.ad}</span>
          </div>

          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <div className="relative overflow-hidden rounded-2xl border border-line bg-surface2 shadow-[0_30px_70px_-30px_rgba(15,41,66,0.4)]">
              <img src={urun.img} alt={`${urun.ad} ekran görüntüsü`} width={900} height={640} className="h-auto w-full" />
              {indirim > 0 && (
                <span className="absolute left-4 top-4 rounded-lg bg-rose-500 px-2.5 py-1 text-[12px] font-extrabold text-white shadow-lg">%{indirim} indirim</span>
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-brandline bg-brandsoft/80 px-3 py-1 text-[12.5px] font-semibold text-brandtext">
                  <Icon name={kat ? kat.icon : 'layers'} className="h-4 w-4" /> {kat ? kat.ad : 'Yazılım'}
                </span>
                {urun.acikKaynak && <span className="rounded-md bg-emerald-500/15 px-2 py-0.5 text-[11px] font-extrabold uppercase tracking-wide text-emerald-600 ring-1 ring-emerald-500/30 dark:text-emerald-400">Açık Kaynak</span>}
                {urun.oneCikan && <span className="rounded-md bg-amber-500/15 px-2 py-0.5 text-[11px] font-extrabold uppercase tracking-wide text-amber-600 ring-1 ring-amber-500/30 dark:text-amber-400">Popüler</span>}
              </div>

              <h1 className="mt-4 tipo-dev font-extrabold tracking-tight text-strong text-balance">{urun.ad}</h1>
              <p className="mt-4 tipo-giris text-body">{urun.aciklama}</p>
              <p className="mt-3 text-[15px] leading-relaxed text-body">
                Paket, SunucumWEB altyapısında kuruluma hazır teslim edilir. Alan adı ve hosting ile birleştirip kısa sürede yayına alabilir, yönetim panelinden içeriğinizi kolayca güncelleyebilirsiniz.
              </p>

              {urun.etiketler?.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {urun.etiketler.map((e) => (
                    <span key={e} className="inline-flex items-center gap-1.5 rounded-lg bg-surface2 px-2.5 py-1.5 text-[12.5px] font-semibold text-body ring-1 ring-line">
                      <Icon name="check" className="h-3.5 w-3.5 text-brandtext" /> {e}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-7 flex flex-wrap items-end gap-4">
                <div>
                  {urun.eskiFiyat > urun.fiyat && <div className="text-[15px] font-medium text-muted line-through">{fiyatYaz(urun.eskiFiyat)} ₺</div>}
                  <div className="text-4xl font-extrabold tracking-tight text-strong">{fiyatYaz(urun.fiyat)} <span className="text-xl font-bold text-muted">₺</span></div>
                </div>
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <AddToCartButton
                  item={{ name: urun.ad, product: 'Hazır Yazılım', price: urun.fiyat, period: '' }}
                  href={urun.satinAlUrl || '/iletisim'}
                  tema="dolu"
                  className="px-6 py-3.5"
                />
                {urun.demoUrl && (
                  <a
                    href={urun.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-surface px-6 py-3.5 text-[15px] font-semibold text-strong ring-1 ring-line transition hover:ring-brandtext/50"
                  >
                    <Icon name="external" className="h-4 w-4 text-brandtext" /> Demoyu Gör
                  </a>
                )}
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-muted">
                Kurulum ve teknik destek dahildir. Bilgi ve teklif için{' '}
                <Link href="/iletisim" className="font-semibold text-brandtext hover:underline">bize ulaşın</Link>.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 lg:px-8 py-16 lg:py-20">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">Pakette neler var?</span>
          <h2 className="mt-3 tipo-bolum font-extrabold tracking-tight text-strong text-balance">Her paket bu standartlarla gelir</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
          {OZELLIKLER.map((f) => (
            <div key={f.t} className="rounded-2xl border border-line bg-surface p-6 shadow-[0_10px_40px_-24px_rgba(15,41,66,0.2)]">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brandsoft text-brandtext"><Icon name={f.icon} /></span>
              <h3 className="mt-4 text-[17px] font-bold text-strong">{f.t}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-body">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {benzer.length > 0 && (
        <section className="bg-surface2 border-y border-line">
          <div className="mx-auto max-w-7xl px-5 lg:px-8 py-16 lg:py-20">
            <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">Benzer Yazılımlar</span>
                <h2 className="mt-3 tipo-bolum font-extrabold tracking-tight text-strong text-balance">Bunları da inceleyin</h2>
              </div>
              <Link href="/hazir-yazilim" className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-surface px-5 py-3 text-[14px] font-semibold text-strong ring-1 ring-line transition-colors hover:text-brandtext">
                Tüm yazılımlar <Icon name="arrow" className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
              {benzer.map((y) => <BenzerKart key={y.id} y={y} />)}
            </div>
          </div>
        </section>
      )}

      <CtaBand title="Size en uygun yazılımı birlikte seçelim" text="Hangi paketin işinize uygun olduğundan emin değil misiniz? Kısa bir görüşmeyle doğru çözümü belirleyelim." />
    </SiteShell>
  );
}
