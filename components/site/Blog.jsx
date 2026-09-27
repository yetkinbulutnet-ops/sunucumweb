import Link from 'next/link';
import { Icon, SiteShell, CtaBand } from './chrome';
import BultenFormu from './BultenFormu';
import Sema from './Sema';
import { ekmekKirintisi } from '@/lib/semalar';
import { tarihYaz } from '@/lib/blog';
import { mutlakUrl } from '@/lib/seo';
import { metinAl } from '@/lib/cms';

const PROSE = `
.blog-prose{color:rgb(var(--c-body));font-size:17px;line-height:1.8;overflow-wrap:anywhere}
.blog-prose > *:first-child{margin-top:0}
.blog-prose h2{font-size:1.55rem;line-height:1.3;font-weight:800;color:rgb(var(--c-strong));margin:2.6rem 0 .9rem;letter-spacing:-.015em;scroll-margin-top:7rem}
.blog-prose h3{font-size:1.2rem;line-height:1.35;font-weight:700;color:rgb(var(--c-strong));margin:2rem 0 .6rem;scroll-margin-top:7rem}
.blog-prose h4{font-size:1.05rem;font-weight:700;color:rgb(var(--c-strong));margin:1.6rem 0 .5rem}
.blog-prose p{margin:1rem 0}
.blog-prose a{color:rgb(var(--c-brandtext));font-weight:600;text-decoration:underline;text-underline-offset:3px;text-decoration-thickness:1px}
.blog-prose strong{color:rgb(var(--c-strong))}
.blog-prose ul,.blog-prose ol{margin:1.1rem 0;padding-left:1.4rem}
.blog-prose ul{list-style:disc}
.blog-prose ol{list-style:decimal}
.blog-prose li{margin:.45rem 0;padding-left:.2rem}
.blog-prose li::marker{color:rgb(var(--c-brandtext))}
.blog-prose img{display:block;max-width:100%;height:auto;border-radius:16px;border:1px solid rgb(var(--c-line));margin:1.8rem auto}
.blog-prose blockquote{margin:1.6rem 0;padding:1rem 1.25rem;border-left:4px solid rgb(var(--c-brandtext));background:rgb(var(--c-brandsoft));border-radius:0 12px 12px 0;color:rgb(var(--c-strong))}
.blog-prose blockquote p{margin:.4rem 0}
.blog-prose code{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:.88em;background:rgb(var(--c-surface2));border:1px solid rgb(var(--c-line));border-radius:6px;padding:.1em .35em;color:rgb(var(--c-strong))}
.blog-prose pre{margin:1.6rem 0;padding:1rem 1.2rem;overflow-x:auto;border-radius:14px;background:#0b1017;border:1px solid rgb(var(--c-line));font-size:14px;line-height:1.65}
.blog-prose pre code{background:none;border:0;padding:0;color:#e8eef5;font-size:inherit}
.blog-prose hr{margin:2.5rem 0;border:0;border-top:1px solid rgb(var(--c-line))}
.blog-prose .blog-tablo{margin:1.6rem 0;overflow-x:auto;border:1px solid rgb(var(--c-line));border-radius:12px}
.blog-prose table{width:100%;border-collapse:collapse;font-size:15px}
.blog-prose th{background:rgb(var(--c-surface2));color:rgb(var(--c-strong));font-weight:700;text-align:left}
.blog-prose th,.blog-prose td{padding:.65rem .85rem;border-bottom:1px solid rgb(var(--c-line));vertical-align:top}
.blog-prose tr:last-child td{border-bottom:0}
@media (max-width:640px){.blog-prose{font-size:16px}.blog-prose h2{font-size:1.35rem}.blog-prose h3{font-size:1.12rem}}
`;

function Gorsel({ g, className, sizes, oncelikli = false }) {
  if (!g?.url) return <div className={`${className} bg-surface2`} />;
  return (
    <img
      src={g.url}
      srcSet={g.srcSet || undefined}
      sizes={sizes}
      alt={g.alt || ''}
      width={g.genislik || 1600}
      height={g.yukseklik || 900}
      loading={oncelikli ? 'eager' : 'lazy'}
      fetchPriority={oncelikli ? 'high' : 'auto'}
      decoding="async"
      className={className}
    />
  );
}

function KategoriRozet({ k }) {
  if (!k) return null;
  return (
    <Link href={`/blog/kategori/${k.slug}`} className="relative z-10 inline-flex w-fit items-center gap-1.5 rounded-full bg-brandsoft px-2.5 py-1 text-[12px] font-bold text-brandtext ring-1 ring-brandline transition-colors hover:bg-brand-500 hover:text-white">
      {k.ad}
    </Link>
  );
}

function BlogHero({ m, yol, baslik, aciklama, eyebrow }) {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <Sema veri={ekmekKirintisi(yol)} />
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 right-[-8%] h-[420px] w-[420px] rounded-full bg-brand-200/40 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(var(--c-grid))_1px,transparent_1px),linear-gradient(to_bottom,rgb(var(--c-grid))_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]" />
      </div>
      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-20">
        <nav aria-label={m('blog.kirinti_aria')} className="mb-5 flex flex-wrap items-center gap-2 text-sm text-muted">
          {yol.map((p, i) => (
            <span key={p.ad} className="flex min-w-0 items-center gap-2">
              {i > 0 && <span aria-hidden>/</span>}
              {p.yol && i < yol.length - 1 ? (
                <Link href={p.yol} className="hover:text-brandtext">{p.ad}</Link>
              ) : (
                <span className="truncate font-medium text-strong/70">{p.ad}</span>
              )}
            </span>
          ))}
        </nav>
        <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-brandtext">{eyebrow ?? m('blog.baslik')}</span>
        <h1 className="mt-3 max-w-3xl tipo-dev font-extrabold tracking-tight text-strong text-balance">{baslik}</h1>
        {aciklama && <p className="mt-5 max-w-2xl tipo-giris text-body">{aciklama}</p>}
      </div>
    </section>
  );
}

function Kategoriler({ m, kategoriler, aktif }) {
  const liste = kategoriler.filter((k) => k.adet > 0);
  if (!liste.length) return null;
  const cip = (secili) =>
    `inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-[14px] font-bold transition-colors ${
      secili ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/25' : 'bg-surface text-body ring-1 ring-line hover:text-brandtext hover:ring-brandline'
    }`;
  return (
    <nav aria-label={m('blog.kategoriler_aria')} className="-mx-5 overflow-x-auto px-5 pb-2 lg:mx-0 lg:px-0">
      <ul className="flex w-max gap-2 lg:w-auto lg:flex-wrap">
        <li>
          <Link href="/blog" className={cip(!aktif)} aria-current={!aktif ? 'page' : undefined}>{m('blog.tum_yazilar')}</Link>
        </li>
        {liste.map((k) => (
          <li key={k.slug}>
            <Link href={`/blog/kategori/${k.slug}`} className={cip(aktif === k.slug)} aria-current={aktif === k.slug ? 'page' : undefined}>
              {k.ad} <span className={`text-[12px] ${aktif === k.slug ? 'text-white/80' : 'text-muted'}`}>{k.adet}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function BlogKart({ y, baslikEtiketi: H = 'h2' }) {
  return (
    <article className="group relative flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_10px_40px_-24px_rgba(15,41,66,0.22)] transition-[transform,box-shadow,border-color] hover:-translate-y-1 hover:border-brandline hover:shadow-[0_24px_60px_-28px_rgba(20,184,166,0.35)]">
      <div className="relative aspect-[16/9] overflow-hidden bg-surface2">
        <Gorsel g={y.kapak} sizes="(min-width:1024px) 400px, (min-width:640px) 50vw, 100vw" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <KategoriRozet k={y.kategori} />
        <H className="mt-3 text-[18px] font-extrabold leading-snug tracking-tight text-strong text-balance">
          <Link href={`/blog/${y.slug}`} className="after:absolute after:inset-0 group-hover:text-brandtext">{y.baslik}</Link>
        </H>
        <p className="mt-2.5 line-clamp-3 text-[14.5px] leading-relaxed text-body">{y.ozet}</p>
        <div className="mt-auto flex items-center gap-2 pt-5 text-[13px] text-muted">
          <Icon name="clock" className="h-4 w-4 shrink-0" />
          <time dateTime={y.tarih}>{tarihYaz(y.tarih)}</time>
        </div>
      </div>
    </article>
  );
}

function OneCikanKart({ m, y }) {
  return (
    <article className="group relative grid min-w-0 overflow-hidden rounded-3xl border border-line bg-surface shadow-[0_20px_60px_-30px_rgba(15,41,66,0.3)] transition-[border-color,box-shadow] hover:border-brandline lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
      <div className="relative aspect-[16/9] overflow-hidden bg-surface2 lg:aspect-auto lg:min-h-[340px]">
        <Gorsel g={y.kapak} oncelikli sizes="(min-width:1024px) 680px, 100vw" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 lg:absolute lg:inset-0" />
      </div>
      <div className="flex min-w-0 flex-col justify-center p-6 sm:p-8 lg:p-10">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-1 text-[12px] font-bold text-amber-600 ring-1 ring-amber-500/30 dark:text-amber-400">
            <Icon name="star" className="h-3.5 w-3.5" /> {m('blog.one_cikan')}
          </span>
          <KategoriRozet k={y.kategori} />
        </div>
        <h2 className="mt-4 text-2xl font-extrabold leading-tight tracking-tight text-strong text-balance sm:text-[28px]">
          <Link href={`/blog/${y.slug}`} className="after:absolute after:inset-0 group-hover:text-brandtext">{y.baslik}</Link>
        </h2>
        <p className="mt-3 text-[15.5px] leading-relaxed text-body">{y.ozet}</p>
        <div className="mt-6 flex items-center gap-2 text-[13px] text-muted">
          <Icon name="clock" className="h-4 w-4 shrink-0" />
          <time dateTime={y.tarih}>{tarihYaz(y.tarih)}</time>
          <span aria-hidden>·</span>
          <span className="font-bold text-brandtext">{m('blog.yaziyi_oku')}</span>
        </div>
      </div>
    </article>
  );
}

function Sayfalama({ m, sayfa, sayfaSayisi, tabanYol }) {
  if (sayfaSayisi <= 1) return null;
  const href = (n) => (n <= 1 ? tabanYol : `${tabanYol}/sayfa/${n}`);
  const sayilar = [];
  for (let n = 1; n <= sayfaSayisi; n++) {
    if (n === 1 || n === sayfaSayisi || Math.abs(n - sayfa) <= 1) sayilar.push(n);
    else if (sayilar[sayilar.length - 1] !== '…') sayilar.push('…');
  }
  const kutu = 'inline-flex h-10 min-w-10 items-center justify-center rounded-xl px-3 text-[14px] font-bold transition-colors';
  return (
    <nav aria-label={m('blog.sayfalar_aria')} className="mt-12 flex flex-wrap items-center justify-center gap-2">
      {sayfa > 1 && (
        <Link href={href(sayfa - 1)} rel="prev" className={`${kutu} bg-surface text-body ring-1 ring-line hover:text-brandtext`}>
          <Icon name="chevron" className="h-4 w-4 rotate-90" /> <span className="ml-1">{m('blog.onceki')}</span>
        </Link>
      )}
      {sayilar.map((n, i) =>
        n === '…' ? (
          <span key={`b${i}`} className="px-1 text-muted">…</span>
        ) : (
          <Link key={n} href={href(n)} aria-current={n === sayfa ? 'page' : undefined} className={`${kutu} ${n === sayfa ? 'bg-brand-500 text-white' : 'bg-surface text-body ring-1 ring-line hover:text-brandtext'}`}>
            {n}
          </Link>
        )
      )}
      {sayfa < sayfaSayisi && (
        <Link href={href(sayfa + 1)} rel="next" className={`${kutu} bg-surface text-body ring-1 ring-line hover:text-brandtext`}>
          <span className="mr-1">{m('blog.sonraki')}</span> <Icon name="chevron" className="h-4 w-4 -rotate-90" />
        </Link>
      )}
    </nav>
  );
}

function BosDurum({ m }) {
  return (
    <div className="mx-auto max-w-2xl rounded-3xl border border-line bg-surface p-8 text-center sm:p-12">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brandsoft text-brandtext ring-1 ring-brandline">
        <Icon name="doc" className="h-7 w-7" />
      </span>
      <h2 className="mt-5 text-2xl font-extrabold tracking-tight text-strong">{m('blog.bos_baslik')}</h2>
      <p className="mt-3 text-[15.5px] leading-relaxed text-body">{m('blog.bos_metin')}</p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link href="/web-hosting" className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-3 text-[14px] font-bold text-white hover:bg-brand-600">{m('blog.bos_hosting')} <Icon name="arrow" className="h-4 w-4" /></Link>
        <Link href="/iletisim" className="inline-flex items-center gap-2 rounded-xl bg-surface px-5 py-3 text-[14px] font-bold text-strong ring-1 ring-line hover:text-brandtext">{m('blog.bos_iletisim')}</Link>
      </div>
    </div>
  );
}

export async function BlogListe({ yazilar, oneCikan, kategoriler, aktifKategori, sayfa, sayfaSayisi, tabanYol, baslik, aciklama, yol }) {
  const m = await metinAl();
  const listeSemasi = yazilar.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: baslik,
        url: mutlakUrl(sayfa > 1 ? `${tabanYol}/sayfa/${sayfa}` : tabanYol),
        inLanguage: 'tr-TR',
        blogPost: [oneCikan, ...yazilar].filter(Boolean).map((y) => ({
          '@type': 'BlogPosting',
          headline: y.baslik,
          url: mutlakUrl(`/blog/${y.slug}`),
          datePublished: y.tarih,
          ...(y.kapak?.url ? { image: y.kapak.url } : {}),
        })),
      }
    : null;
  return (
    <SiteShell>
      <Sema veri={listeSemasi} />
      <BlogHero m={m} yol={yol} baslik={baslik} aciklama={aciklama} />
      <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
        <Kategoriler m={m} kategoriler={kategoriler} aktif={aktifKategori} />
        {!yazilar.length && !oneCikan ? (
          <div className="mt-10"><BosDurum m={m} /></div>
        ) : (
          <>
            {oneCikan && <div className="mt-10"><OneCikanKart m={m} y={oneCikan} /></div>}
            {yazilar.length > 0 && (
              <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {yazilar.map((y) => <BlogKart key={y.slug} y={y} />)}
              </div>
            )}
            <Sayfalama m={m} sayfa={sayfa} sayfaSayisi={sayfaSayisi} tabanYol={tabanYol} />
          </>
        )}
      </section>
      <BultenFormu kaynak="blog" />
      <CtaBand title={m('blog.cta_baslik')} text={m('blog.cta_metin')} />
    </SiteShell>
  );
}

function Icindekiler({ m, basliklar, mobil = false }) {
  if (basliklar.length < 2) return null;
  const liste = (
    <ol className="mt-3 space-y-1.5 text-[14px]">
      {basliklar.map((b) => (
        <li key={b.id} className={b.seviye === 3 ? 'pl-4' : ''}>
          <a href={`#${b.id}`} className="block rounded-lg px-2 py-1 leading-snug text-body transition-colors hover:bg-brandsoft hover:text-brandtext">{b.metin}</a>
        </li>
      ))}
    </ol>
  );
  if (mobil) {
    return (
      <details className="mb-8 rounded-2xl border border-line bg-surface p-4 lg:hidden">
        <summary className="cursor-pointer text-[14px] font-bold text-strong">{m('blog.icindekiler')}</summary>
        {liste}
      </details>
    );
  }
  return (
    <nav aria-label={m('blog.icindekiler')} className="rounded-2xl border border-line bg-surface p-5">
      <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-muted">{m('blog.icindekiler')}</p>
      {liste}
    </nav>
  );
}

function Paylas({ m, url, baslik }) {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(baslik);
  const linkler = [
    ['X', `https://x.com/intent/post?url=${u}&text=${t}`],
    ['LinkedIn', `https://www.linkedin.com/sharing/share-offsite/?url=${u}`],
    ['Facebook', `https://www.facebook.com/sharer/sharer.php?u=${u}`],
    ['WhatsApp', `https://wa.me/?text=${t}%20${u}`],
  ];
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-[13px] font-bold text-muted">{m('blog.paylas')}</span>
      {linkler.map(([ad, href]) => (
        <a key={ad} href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center rounded-lg bg-surface px-3 py-1.5 text-[13px] font-semibold text-body ring-1 ring-line transition-colors hover:text-brandtext hover:ring-brandline">
          {ad}
        </a>
      ))}
    </div>
  );
}

function YazarKutusu({ m, yazar }) {
  const y = yazar || { ad: m('blog.varsayilan_yazar'), unvan: m('blog.varsayilan_unvan'), biyografi: '' };
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-line bg-surface p-5 sm:p-6">
      {y.fotograf?.url ? (
        <img src={y.fotograf.url} alt={y.ad} width={64} height={64} loading="lazy" className="h-16 w-16 shrink-0 rounded-full object-cover ring-2 ring-brandline" />
      ) : (
        <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-brandsoft text-xl font-extrabold text-brandtext ring-2 ring-brandline">{y.ad.slice(0, 1)}</span>
      )}
      <div className="min-w-0">
        <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-muted">{m('blog.yazar')}</p>
        <p className="mt-1 text-[17px] font-extrabold text-strong">{y.ad}</p>
        {y.unvan && <p className="text-[13.5px] font-semibold text-brandtext">{y.unvan}</p>}
        {y.biyografi && <p className="mt-2 text-[14.5px] leading-relaxed text-body">{y.biyografi}</p>}
      </div>
    </div>
  );
}

export async function BlogDetay({ yazi, islenmis, ilgili }) {
  const m = await metinAl();
  const url = mutlakUrl(`/blog/${yazi.slug}`);
  const guncellendi = yazi.guncelleme && new Date(yazi.guncelleme) - new Date(yazi.tarih) > 86400000;
  const yol = [
    { ad: m('blog.kirinti_ana_sayfa'), yol: '/' },
    { ad: m('blog.baslik'), yol: '/blog' },
    ...(yazi.kategori ? [{ ad: yazi.kategori.ad, yol: `/blog/kategori/${yazi.kategori.slug}` }] : []),
    { ad: yazi.baslik, yol: `/blog/${yazi.slug}` },
  ];
  const semalar = [
    ekmekKirintisi(yol),
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: yazi.baslik,
      description: yazi.seoAciklama || yazi.ozet,
      ...(yazi.kapak?.url ? { image: [yazi.kapak.url] } : {}),
      datePublished: yazi.tarih,
      dateModified: yazi.guncelleme || yazi.tarih,
      inLanguage: 'tr-TR',
      wordCount: islenmis.kelime,
      ...(yazi.kategori ? { articleSection: yazi.kategori.ad } : {}),
      ...(yazi.etiketler.length ? { keywords: yazi.etiketler.join(', ') } : {}),
      author: yazi.yazar ? { '@type': 'Person', name: yazi.yazar.ad, ...(yazi.yazar.unvan ? { jobTitle: yazi.yazar.unvan } : {}) } : { '@type': 'Organization', name: 'SunucumWEB', url: mutlakUrl('/') },
      publisher: { '@type': 'Organization', name: 'SunucumWEB', url: mutlakUrl('/'), logo: { '@type': 'ImageObject', url: mutlakUrl('/icon/logo.png') } },
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    },
    ...(yazi.sss.length
      ? [{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: yazi.sss.map((s) => ({ '@type': 'Question', name: s.q, acceptedAnswer: { '@type': 'Answer', text: s.a } })) }]
      : []),
  ];
  return (
    <SiteShell>
      <Sema veri={semalar} />
      <article>
        <header className="relative overflow-hidden border-b border-line">
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -top-32 right-[-8%] h-[420px] w-[420px] rounded-full bg-brand-200/40 blur-[120px]" />
          </div>
          <div className="mx-auto max-w-4xl px-5 pb-10 pt-12 lg:px-8 lg:pt-16">
            <nav aria-label={m('blog.kirinti_aria')} className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted">
              {yol.slice(0, -1).map((p, i) => (
                <span key={p.ad} className="flex items-center gap-2">
                  {i > 0 && <span aria-hidden>/</span>}
                  <Link href={p.yol} className="hover:text-brandtext">{p.ad}</Link>
                </span>
              ))}
            </nav>
            <KategoriRozet k={yazi.kategori} />
            <h1 className="mt-4 tipo-dev font-extrabold tracking-tight text-strong text-balance">{yazi.baslik}</h1>
            <p className="mt-5 tipo-giris text-body">{yazi.ozet}</p>
            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-[14px] text-muted">
              <span className="font-semibold text-strong">{yazi.yazar?.ad || m('blog.varsayilan_yazar')}</span>
              <span className="flex items-center gap-1.5"><Icon name="clock" className="h-4 w-4" /><time dateTime={yazi.tarih}>{tarihYaz(yazi.tarih)}</time></span>
              {guncellendi && <span>{m('blog.guncellendi')} <time dateTime={yazi.guncelleme}>{tarihYaz(yazi.guncelleme)}</time></span>}
              <span>{m('blog.okuma_suresi', { dk: islenmis.okumaDk })}</span>
            </div>
          </div>
        </header>

        {yazi.kapak?.url && (
          <div className="mx-auto max-w-5xl px-5 pt-10 lg:px-8">
            <Gorsel g={yazi.kapak} oncelikli sizes="(min-width:1024px) 960px, 100vw" className="aspect-[16/9] h-auto w-full rounded-3xl border border-line object-cover shadow-[0_30px_80px_-40px_rgba(15,41,66,0.45)]" />
          </div>
        )}

        <div className="mx-auto max-w-6xl px-5 py-12 lg:px-8 lg:py-16">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_260px]">
            <div className="min-w-0 max-w-3xl">
              <Icindekiler m={m} basliklar={islenmis.basliklar} mobil />
              <style dangerouslySetInnerHTML={{ __html: PROSE }} />
              <div className="blog-prose" dangerouslySetInnerHTML={{ __html: islenmis.html }} />

              {yazi.etiketler.length > 0 && (
                <ul className="mt-10 flex flex-wrap gap-2" aria-label={m('blog.etiketler_aria')}>
                  {yazi.etiketler.map((e) => (
                    <li key={e} className="rounded-full bg-surface2 px-3 py-1 text-[13px] font-semibold text-body ring-1 ring-line">#{e}</li>
                  ))}
                </ul>
              )}

              {yazi.sss.length > 0 && (
                <section className="mt-12" aria-labelledby="blog-sss">
                  <h2 id="blog-sss" className="text-2xl font-extrabold tracking-tight text-strong">{m('blog.sss_baslik')}</h2>
                  <div className="mt-5 space-y-3">
                    {yazi.sss.map((s) => (
                      <details key={s.q} className="group rounded-2xl border border-line bg-surface p-5 open:border-brandline">
                        <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-[16px] font-bold text-strong">
                          {s.q}
                          <Icon name="plus" className="mt-1 h-4 w-4 shrink-0 text-brandtext transition-transform group-open:rotate-45" />
                        </summary>
                        <p className="mt-3 text-[15px] leading-relaxed text-body">{s.a}</p>
                      </details>
                    ))}
                  </div>
                </section>
              )}

              <div className="mt-12 space-y-6 border-t border-line pt-8">
                <Paylas m={m} url={url} baslik={yazi.baslik} />
                <YazarKutusu m={m} yazar={yazi.yazar} />
              </div>
            </div>
            <aside className="hidden lg:block">
              <div className="sticky top-28 space-y-5">
                <Icindekiler m={m} basliklar={islenmis.basliklar} />
                <Link href="/blog" className="flex items-center gap-2 rounded-2xl border border-line bg-surface p-4 text-[14px] font-bold text-strong transition-colors hover:border-brandline hover:text-brandtext">
                  <Icon name="arrow" className="h-4 w-4 rotate-180" /> {m('blog.tum_yazilar')}
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </article>

      {ilgili.length > 0 && (
        <section className="border-t border-line bg-surface2" aria-labelledby="ilgili-yazilar">
          <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
            <h2 id="ilgili-yazilar" className="text-2xl font-extrabold tracking-tight text-strong sm:text-3xl">{m('blog.ilgili_baslik')}</h2>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {ilgili.map((y) => <BlogKart key={y.slug} y={y} baslikEtiketi="h3" />)}
            </div>
          </div>
        </section>
      )}
      <BultenFormu kaynak="blog" />
      <CtaBand />
    </SiteShell>
  );
}
