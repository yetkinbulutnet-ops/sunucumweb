import { Marked } from 'marked';
import { SITE_URL } from './seo';

const kacis = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const slugla = (s) =>
  String(s || '')
    .toLocaleLowerCase('tr')
    .replace(/ç/g, 'c')
    .replace(/ğ/g, 'g')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ş/g, 's')
    .replace(/ü/g, 'u')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const disLink = (href) => /^https?:\/\//i.test(href) && !href.startsWith(SITE_URL);

export function makaleIsle(md) {
  const basliklar = [];
  const kullanilan = {};
  const m = new Marked({
    gfm: true,
    breaks: false,
    renderer: {
      heading({ tokens, depth }) {
        const ic = this.parser.parseInline(tokens);
        const duz = ic.replace(/<[^>]+>/g, '').replace(/&[a-z#0-9]+;/gi, ' ').trim();
        let id = slugla(duz) || 'baslik';
        if (kullanilan[id]) {
          kullanilan[id] += 1;
          id = `${id}-${kullanilan[id]}`;
        } else kullanilan[id] = 1;
        const seviye = Math.min(Math.max(depth, 2), 4);
        if (seviye === 2 || seviye === 3) basliklar.push({ id, metin: duz, seviye });
        return `<h${seviye} id="${id}">${ic}</h${seviye}>\n`;
      },
      image({ href, title, text }) {
        return `<img src="${kacis(href)}" alt="${kacis(text)}" loading="lazy" decoding="async"${title ? ` title="${kacis(title)}"` : ''}>`;
      },
      link({ href, title, tokens }) {
        const ic = this.parser.parseInline(tokens);
        const dis = disLink(href);
        return `<a href="${kacis(href)}"${title ? ` title="${kacis(title)}"` : ''}${dis ? ' target="_blank" rel="noopener noreferrer"' : ''}>${ic}</a>`;
      },
    },
  });
  const html = m
    .parse(String(md || ''))
    .replace(/<table>/g, '<div class="blog-tablo"><table>')
    .replace(/<\/table>/g, '</table></div>');
  const kelime = String(md || '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/[#>*_`~[\]()|-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return { html, basliklar, okumaDk: Math.max(1, Math.round(kelime / 200)), kelime };
}

export const tarihYaz = (d) =>
  d ? new Date(d).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Istanbul' }) : '';

export const SAYFA_BOYUTU = 12;
