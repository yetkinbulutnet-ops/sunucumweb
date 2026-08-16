import parse from 'html-react-parser';
import { SiteShell, PageHero } from './chrome';

/* Renkler tema degiskenlerinden gelir -> koyu modda da okunur kalir.
   (Sabit hex kullanmayin; koyu zeminde metin kaybolur.) */
const PROSE = `
.legal-prose h2{font-size:1.4rem;font-weight:800;color:rgb(var(--c-strong));margin:2.2rem 0 .75rem;letter-spacing:-.01em}
.legal-prose h2:first-child{margin-top:0}
.legal-prose h3{font-size:1.1rem;font-weight:700;color:rgb(var(--c-strong));opacity:.92;margin:1.6rem 0 .5rem}
.legal-prose p{color:rgb(var(--c-body));line-height:1.75;margin:.7rem 0;font-size:15px}
.legal-prose a{color:rgb(var(--c-brandtext));font-weight:600}
.legal-prose strong{color:rgb(var(--c-strong))}
.legal-prose table{width:100%;border-collapse:collapse;margin:1rem 0;font-size:14px;color:rgb(var(--c-body))}
.legal-prose td,.legal-prose th{border:1px solid rgb(var(--c-line));padding:.55rem .7rem;text-align:left}
.legal-prose ul{margin:1rem 0;padding:0;list-style:none;display:flex;flex-direction:column;gap:.55rem}
.legal-prose li{position:relative;padding-left:1.75rem;color:rgb(var(--c-body));line-height:1.7;font-size:15px}
.legal-prose li::before{content:'';position:absolute;left:.15rem;top:.6em;width:.5rem;height:.5rem;border-radius:9999px;background:rgb(var(--c-brandtext))}
`;

export default function LegalPage({ title, eyebrow = 'Yasal', html }) {
  return (
    <SiteShell>
      <PageHero eyebrow={eyebrow} title={title} breadcrumb={title} />
      <section className="mx-auto max-w-3xl px-5 lg:px-8 py-16">
        <style dangerouslySetInnerHTML={{ __html: PROSE }} />
        <div className="legal-prose">{parse(html || '')}</div>
        <p className="mt-12 border-t border-line pt-6 text-sm text-muted">
          Sorularınız için <a href="/iletisim" className="font-semibold text-brandtext hover:underline">iletişim</a> sayfamızdan bize ulaşabilirsiniz.
        </p>
      </section>
    </SiteShell>
  );
}
