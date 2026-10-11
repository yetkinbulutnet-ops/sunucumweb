import 'server-only';
import path from 'node:path';
import PDFDocument from 'pdfkit';
import { marked } from 'marked';

const KOK = process.cwd();
const FONT = {
  normal: path.join(KOK, 'public/fonts/Poppins-Regular.ttf'),
  yari: path.join(KOK, 'public/fonts/Poppins-SemiBold.ttf'),
  kalin: path.join(KOK, 'public/fonts/Poppins-Bold.ttf'),
};
const LOGO = path.join(KOK, 'public/icon/logo.png');

const RENK = { koyu: '#0f2942', metin: '#33475b', soluk: '#6b7c90', marka: '#0f766e', cizgi: '#d9e1ea', zemin: '#f2f6f8' };
const KENAR = { ust: 92, alt: 64, sol: 52, sag: 52 };

const varlik = (s) =>
  String(s ?? '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

const parcalar = (tokenlar, stil = {}) => {
  const sonuc = [];
  for (const t of tokenlar || []) {
    if (t.type === 'strong') sonuc.push(...parcalar(t.tokens, { ...stil, kalin: true }));
    else if (t.type === 'em' || t.type === 'del') sonuc.push(...parcalar(t.tokens, stil));
    else if (t.type === 'link') sonuc.push(...parcalar(t.tokens, { ...stil, link: t.href }));
    else if (t.type === 'br') sonuc.push({ metin: '\n', ...stil });
    else if (t.type === 'codespan') sonuc.push({ metin: varlik(t.text), ...stil });
    else if (t.type === 'html') continue;
    else if (t.tokens?.length) sonuc.push(...parcalar(t.tokens, stil));
    else sonuc.push({ metin: varlik(t.text ?? t.raw ?? ''), ...stil });
  }
  const birlesik = [];
  for (const p of sonuc) {
    if (!p.metin) continue;
    const son = birlesik[birlesik.length - 1];
    if (son && !!son.kalin === !!p.kalin && son.link === p.link) son.metin += p.metin;
    else birlesik.push({ ...p });
  }
  return birlesik;
};

const mutlak = (href, site) => {
  if (!href) return undefined;
  if (/^(https?:|mailto:|tel:)/i.test(href)) return href;
  if (href.startsWith('/')) return `${site}${href}`;
  return undefined;
};

export function yasalPdf({ belge, ticari, site, etiket }) {
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: KENAR.ust, bottom: KENAR.alt, left: KENAR.sol, right: KENAR.sag },
    bufferPages: true,
    autoFirstPage: false,
    info: { Title: belge.baslik, Author: ticari.unvan || 'SunucumWEB', Subject: belge.ozet || belge.baslik, Creator: site.replace(/^https?:\/\//, '') },
    lang: 'tr-TR',
    displayTitle: true,
  });
  doc.registerFont('n', FONT.normal);
  doc.registerFont('y', FONT.yari);
  doc.registerFont('k', FONT.kalin);

  const genislik = () => doc.page.width - KENAR.sol - KENAR.sag;
  const altSinir = () => doc.page.height - KENAR.alt;
  const yerAc = (h) => {
    if (doc.y + h > altSinir()) doc.addPage();
  };

  let ilkSayfa = true;
  doc.on('pageAdded', () => {
    const w = doc.page.width;
    if (!ilkSayfa) {
      doc.image(LOGO, KENAR.sol, 34, { height: 18 });
      doc.font('y').fontSize(8.5).fillColor(RENK.soluk).text(belge.baslik, KENAR.sol + 160, 38, { width: w - KENAR.sol - KENAR.sag - 160, align: 'right', lineBreak: false });
      doc.moveTo(KENAR.sol, 64).lineTo(w - KENAR.sag, 64).lineWidth(0.6).strokeColor(RENK.cizgi).stroke();
      doc.x = KENAR.sol;
      doc.y = KENAR.ust;
    }
    ilkSayfa = false;
  });

  doc.addPage({ size: 'A4', margins: { top: 40, bottom: KENAR.alt, left: KENAR.sol, right: KENAR.sag } });
  doc.image(LOGO, KENAR.sol, 40, { height: 28 });
  const bilgiX = KENAR.sol + 250;
  const bilgiW = doc.page.width - KENAR.sag - bilgiX;
  doc.font('k').fontSize(9.5).fillColor(RENK.koyu).text(ticari.unvan, bilgiX, 38, { width: bilgiW, align: 'right' });
  doc.font('n').fontSize(8).fillColor(RENK.metin);
  for (const satir of ticari.satirlar) doc.text(satir, bilgiX, doc.y + 1, { width: bilgiW, align: 'right' });
  const ustAlt = Math.max(doc.y, 80) + 12;
  doc.moveTo(KENAR.sol, ustAlt).lineTo(doc.page.width - KENAR.sag, ustAlt).lineWidth(0.8).strokeColor(RENK.cizgi).stroke();

  doc.x = KENAR.sol;
  doc.y = ustAlt + 22;
  doc.font('k').fontSize(20).fillColor(RENK.koyu).text(belge.baslik, { width: genislik() });
  const meta = [belge.surum && etiket.surum, belge.tarih && etiket.tarih].filter(Boolean).join('    ');
  if (meta) doc.moveDown(0.3).font('y').fontSize(9).fillColor(RENK.marka).text(meta, { width: genislik() });
  if (belge.ozet) doc.moveDown(0.5).font('n').fontSize(10).fillColor(RENK.metin).text(belge.ozet, { width: genislik(), lineGap: 2 });
  doc.moveDown(1.2);

  const yaz = (runs, { boyut = 10, renk = RENK.metin, x = KENAR.sol, w = genislik(), satirAra = 3, yaziTipi } = {}) => {
    if (!runs.length) return;
    doc.x = x;
    runs.forEach((p, i) => {
      const son = i === runs.length - 1;
      const link = mutlak(p.link, site);
      const secenek = { width: w, lineGap: satirAra, continued: !son, link: link || null, underline: false };
      doc.font(yaziTipi || (p.kalin ? 'y' : 'n')).fontSize(boyut).fillColor(link ? RENK.marka : p.kalin ? RENK.koyu : renk);
      if (i === 0) doc.text(p.metin, x, doc.y, secenek);
      else doc.text(p.metin, secenek);
    });
  };

  const liste = (token, girinti = 0) => {
    token.items.forEach((item, i) => {
      const isaret = token.ordered ? `${(Number(token.start) || 1) + i}.` : '•';
      const x = KENAR.sol + girinti;
      yerAc(28);
      const y = doc.y;
      doc.font('y').fontSize(10).fillColor(RENK.marka).text(isaret, x, y, { width: 18, lineBreak: false });
      doc.y = y;
      const ic = [];
      for (const t of item.tokens || []) {
        if (t.type === 'list') {
          if (ic.length) {
            yaz(parcalar(ic), { x: x + 18, w: genislik() - girinti - 18 });
            ic.length = 0;
          }
          doc.moveDown(0.2);
          liste(t, girinti + 18);
        } else ic.push(...(t.type === 'text' || t.type === 'paragraph' ? [t] : [t]));
      }
      if (ic.length) yaz(parcalar(ic), { x: x + 18, w: genislik() - girinti - 18 });
      doc.moveDown(0.35);
    });
    doc.x = KENAR.sol;
  };

  const tablo = (token) => {
    const sutun = token.header.length;
    const w = genislik() / sutun;
    const pad = 5;
    const satirCiz = (hucreler, baslik) => {
      doc.font(baslik ? 'y' : 'n').fontSize(8.8);
      const metinler = hucreler.map((h) => parcalar(h.tokens).map((p) => p.metin).join(''));
      const h = Math.max(...metinler.map((t) => doc.heightOfString(t, { width: w - pad * 2, lineGap: 1.5 }))) + pad * 2;
      yerAc(h);
      const y = doc.y;
      metinler.forEach((t, i) => {
        const x = KENAR.sol + i * w;
        if (baslik) doc.rect(x, y, w, h).fill(RENK.zemin);
        doc.rect(x, y, w, h).lineWidth(0.5).strokeColor(RENK.cizgi).stroke();
        doc.font(baslik ? 'y' : 'n').fontSize(8.8).fillColor(baslik ? RENK.koyu : RENK.metin).text(t, x + pad, y + pad, { width: w - pad * 2, lineGap: 1.5 });
      });
      doc.x = KENAR.sol;
      doc.y = y + h;
    };
    satirCiz(token.header, true);
    for (const satir of token.rows) satirCiz(satir, false);
    doc.moveDown(0.8);
  };

  const govde = (tokenlar) => {
    for (const t of tokenlar) {
      if (t.type === 'heading') {
        const boyut = t.depth <= 2 ? 13 : 11;
        doc.moveDown(t.depth <= 2 ? 0.7 : 0.4);
        yerAc(boyut * 4);
        yaz(parcalar(t.tokens), { boyut, renk: RENK.koyu, yaziTipi: t.depth <= 2 ? 'k' : 'y', satirAra: 2 });
        doc.moveDown(0.35);
      } else if (t.type === 'paragraph' || t.type === 'text') {
        yerAc(24);
        yaz(parcalar(t.tokens || [t]));
        doc.moveDown(0.55);
      } else if (t.type === 'list') {
        liste(t);
        doc.moveDown(0.3);
      } else if (t.type === 'table') {
        tablo(t);
      } else if (t.type === 'blockquote') {
        const y = doc.y;
        govdeGirintili(t.tokens);
        doc.moveTo(KENAR.sol + 2, y).lineTo(KENAR.sol + 2, doc.y - 6).lineWidth(2).strokeColor(RENK.marka).stroke();
      } else if (t.type === 'hr') {
        yerAc(20);
        doc.moveTo(KENAR.sol, doc.y + 4).lineTo(doc.page.width - KENAR.sag, doc.y + 4).lineWidth(0.6).strokeColor(RENK.cizgi).stroke();
        doc.moveDown(1);
      } else if (t.type === 'code') {
        yerAc(24);
        doc.font('n').fontSize(9).fillColor(RENK.metin).text(t.text, KENAR.sol, doc.y, { width: genislik() });
        doc.moveDown(0.6);
      }
    }
  };
  const govdeGirintili = (tokenlar) => {
    for (const t of tokenlar) {
      if (t.type === 'paragraph' || t.type === 'text') {
        yerAc(24);
        yaz(parcalar(t.tokens || [t]), { x: KENAR.sol + 12, w: genislik() - 12 });
        doc.moveDown(0.55);
      }
    }
  };

  if (belge.tur === 'ticari') {
    tablo({
      header: [{ tokens: [{ type: 'text', text: etiket.bilgi }] }, { tokens: [{ type: 'text', text: '' }] }],
      rows: [...ticari.bilgiler, ...ticari.epostalar].map(([a, b]) => [{ tokens: [{ type: 'strong', tokens: [{ type: 'text', text: a }] }] }, { tokens: [{ type: 'text', text: b }] }]),
    });
    if (ticari.hizmetler.length) {
      doc.moveDown(0.4);
      yaz([{ metin: etiket.hizmetler }], { boyut: 11, renk: RENK.koyu, yaziTipi: 'k' });
      doc.moveDown(0.3);
      yaz([{ metin: ticari.hizmetler.join(', ') }]);
    }
  } else {
    govde(marked.lexer(String(belge.icerik || ''), { gfm: true }));
  }

  const sayfalar = doc.bufferedPageRange();
  for (let i = 0; i < sayfalar.count; i++) {
    doc.switchToPage(sayfalar.start + i);
    const altY = doc.page.height - 42;
    const eskiAlt = doc.page.margins.bottom;
    doc.page.margins.bottom = 0;
    doc.moveTo(KENAR.sol, altY - 8).lineTo(doc.page.width - KENAR.sag, altY - 8).lineWidth(0.5).strokeColor(RENK.cizgi).stroke();
    doc.font('n').fontSize(7.5).fillColor(RENK.soluk).text(etiket.guncel, KENAR.sol, altY, { width: genislik() - 90, lineBreak: false, link: etiket.guncelUrl });
    doc.text(etiket.sayfa(i + 1, sayfalar.count), doc.page.width - KENAR.sag - 90, altY, { width: 90, align: 'right', lineBreak: false });
    doc.page.margins.bottom = eskiAlt;
  }

  return new Promise((coz, reddet) => {
    const parca = [];
    doc.on('data', (p) => parca.push(p));
    doc.on('end', () => coz(Buffer.concat(parca)));
    doc.on('error', reddet);
    doc.end();
  });
}
