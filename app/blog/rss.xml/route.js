import { tumBlogYazilari, metinAl } from '@/lib/cms';
import { mutlakUrl } from '@/lib/seo';

export const revalidate = 300;

const kacis = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export async function GET() {
  const m = await metinAl();
  const yazilar = (await tumBlogYazilari()).slice(0, 50);
  const ogeler = yazilar
    .map((y) => {
      const url = mutlakUrl(`/blog/${y.slug}`);
      const kategori = y.kategori ? `<category>${kacis(y.kategori.ad)}</category>` : '';
      const gorsel = y.kapak?.url ? `<enclosure url="${kacis(y.kapak.url)}" type="image/webp" length="0"/>` : '';
      return `<item><title>${kacis(y.baslik)}</title><link>${url}</link><guid isPermaLink="true">${url}</guid><pubDate>${new Date(y.tarih).toUTCString()}</pubDate><description>${kacis(y.ozet)}</description>${kategori}${gorsel}</item>`;
    })
    .join('');
  const son = yazilar[0] ? `<lastBuildDate>${new Date(yazilar[0].tarih).toUTCString()}</lastBuildDate>` : '';
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>${kacis(m('blog.rss_baslik'))}</title><link>${mutlakUrl('/blog')}</link><description>${kacis(m('blog.rss_aciklama'))}</description><language>tr-TR</language><atom:link href="${mutlakUrl('/blog/rss.xml')}" rel="self" type="application/rss+xml"/>${son}${ogeler}</channel></rss>`;
  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8', 'Cache-Control': 'public, max-age=300, s-maxage=300' },
  });
}
