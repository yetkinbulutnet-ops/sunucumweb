import { ticariBilgiler, metinAl, siteAyarlari } from '@/lib/cms';
import { belgeBul, belgeYolu, eskiBelge, pdfYolu, tarihKisa } from '@/lib/yasal';
import { yasalPdf } from '@/lib/yasal-pdf';
import { SITE_URL } from '@/lib/seo';

export const dynamic = 'force-dynamic';

const ONBELLEK = new Map();
const AZAMI = 40;
const OMUR = 10 * 60 * 1000;
const bekleyen = new Map();

const bulunamadi = () => new Response('Not found', { status: 404, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });

const uret = async (belge) => {
  const [t, m, ayar] = await Promise.all([ticariBilgiler(), metinAl(), siteAyarlari()]);
  const unvan = t.ticari.bilgiler[0]?.[1] || ayar.firma?.unvan || 'SunucumWEB';
  const satirlar = t.ticari.bilgiler.slice(1).filter(([a, b]) => b && !/yetkilendirme|yer sağlayıcı/i.test(a)).map(([a, b]) => `${a}: ${b}`);
  if (t.ticari.epostalar[0]) satirlar.push(`${t.ticari.epostalar[0][0]}: ${t.ticari.epostalar[0][1]}`);
  satirlar.push(SITE_URL.replace(/^https?:\/\//, ''));
  const tarih = tarihKisa(belge.yururluk || belge.guncelleme);
  const guncelUrl = `${SITE_URL}${belgeYolu(belge.slug)}`;
  return yasalPdf({
    belge: { ...belge, tarih },
    ticari: { unvan, satirlar, bilgiler: t.ticari.bilgiler, epostalar: t.ticari.epostalar, hizmetler: t.ticari.hizmetler },
    site: SITE_URL,
    etiket: {
      surum: m('yasal.surum', { surum: belge.surum }),
      tarih: m(belge.yururluk ? 'yasal.yururluk' : 'yasal.guncelleme', { tarih }),
      guncel: m('yasal.pdf_guncel', { url: guncelUrl.replace(/^https?:\/\//, '') }),
      guncelUrl,
      sayfa: (n, toplam) => m('yasal.pdf_sayfa', { n, toplam }),
      bilgi: belge.baslik,
      hizmetler: m('legal.hizmet_kapsami'),
    },
  });
};

export async function GET(_istek, { params }) {
  const { dosya } = await params;
  const eslesme = /^([a-z0-9-]{1,80})\.pdf$/.exec(String(dosya || ''));
  if (!eslesme) return bulunamadi();
  const belge = await belgeBul(eslesme[1]);
  if (!belge) {
    const hedef = await eskiBelge(eslesme[1]);
    return hedef ? Response.redirect(new URL(pdfYolu(hedef), SITE_URL), 308) : bulunamadi();
  }

  const imza = `${belge.slug}|${belge.guncelleme || ''}|${belge.surum || ''}`;
  const kayit = ONBELLEK.get(belge.slug);
  let veri;
  if (kayit && kayit.imza === imza && Date.now() - kayit.zaman < OMUR) {
    veri = kayit.veri;
  } else {
    let is = bekleyen.get(imza);
    if (!is) {
      is = uret(belge).finally(() => bekleyen.delete(imza));
      bekleyen.set(imza, is);
    }
    veri = await is;
    ONBELLEK.delete(belge.slug);
    ONBELLEK.set(belge.slug, { imza, veri, zaman: Date.now() });
    while (ONBELLEK.size > AZAMI) ONBELLEK.delete(ONBELLEK.keys().next().value);
  }

  return new Response(veri, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${belge.slug}.pdf"`,
      'Content-Length': String(veri.length),
      'Cache-Control': 'public, max-age=300',
      'X-Robots-Tag': 'noindex',
    },
  });
}
