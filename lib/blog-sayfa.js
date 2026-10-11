import { notFound, redirect } from 'next/navigation';
import { tumBlogYazilari, blogKategorileri, metinAl } from './cms';
import { SAYFA_BOYUTU } from './blog';
import { sayfaMeta } from './seo';

const bulunamadi = async () => {
  notFound();
};

export const blogMetinleri = async () => {
  const m = await metinAl();
  return { baslik: m('blog.baslik'), aciklama: m('blog.aciklama'), anaSayfa: m('blog.kirinti_ana_sayfa'), sayfaAyrac: (sayfa) => m('blog.sayfa_ayrac', { sayfa }), sayfaN: (sayfa) => m('blog.sayfa_n', { sayfa }) };
};

export async function listeVerisi({ sayfa = 1, kategori = null }) {
  const [hepsi, kategoriler] = await Promise.all([tumBlogYazilari(), blogKategorileri()]);
  const kat = kategori ? kategoriler.find((k) => k.slug === kategori) : null;
  if (kategori && !kat) await bulunamadi();
  const kapsam = kat ? hepsi.filter((y) => y.kategori?.slug === kat.slug) : hepsi;
  const oneCikan = !kat ? kapsam.find((y) => y.oneCikan) || null : null;
  const kalan = oneCikan ? kapsam.filter((y) => y !== oneCikan) : kapsam;
  const sayfaSayisi = Math.max(1, Math.ceil(kalan.length / SAYFA_BOYUTU));
  if (!Number.isInteger(sayfa) || sayfa < 1 || sayfa > sayfaSayisi) await bulunamadi();
  return {
    kat,
    kategoriler,
    toplam: kapsam.length,
    oneCikan: sayfa === 1 ? oneCikan : null,
    yazilar: kalan.slice((sayfa - 1) * SAYFA_BOYUTU, sayfa * SAYFA_BOYUTU),
    sayfa,
    sayfaSayisi,
  };
}

export const sayfaNo = async (ham) => {
  if (!/^[1-9]\d{0,5}$/.test(String(ham))) await bulunamadi();
  return Number(ham);
};

export const ilkSayfayaYonlendir = (n, taban) => {
  if (n === 1) redirect(taban);
};

export async function listeMeta({ sayfa = 1, kategori = null }) {
  const [hepsi, kategoriler, m] = await Promise.all([tumBlogYazilari(), blogKategorileri(), metinAl()]);
  const kat = kategori ? kategoriler.find((k) => k.slug === kategori) : null;
  if (kategori && !kat) return {};
  const aciklama = m('blog.aciklama');
  const taban = kat ? `/blog/kategori/${kat.slug}` : '/blog';
  const ek = sayfa > 1 ? ` ${m('blog.sayfa_ayrac', { sayfa })}` : '';
  const meta = sayfaMeta({
    baslik: kat ? `${kat.seoBaslik || m('blog.kategori_meta_baslik', { ad: kat.ad })}${ek}` : `${m('blog.meta_baslik')}${ek}`,
    aciklama: kat ? kat.seoAciklama || kat.aciklama || aciklama : aciklama,
    yol: sayfa > 1 ? `${taban}/sayfa/${sayfa}` : taban,
  });
  const bos = kat ? !hepsi.some((y) => y.kategori?.slug === kat.slug) : hepsi.length === 0;
  if (bos) meta.robots = { index: false, follow: true };
  meta.alternates = { ...meta.alternates, types: { 'application/rss+xml': [{ url: '/blog/rss.xml', title: m('blog.rss_baslik') }] } };
  return meta;
}
