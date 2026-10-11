import 'server-only';
import sanitizeHtml from 'sanitize-html';

const AYAR = {
  allowedTags: [
    'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'hr', 'blockquote', 'pre', 'code', 'span', 'div',
    'strong', 'b', 'em', 'i', 'u', 's', 'del', 'ins', 'mark', 'small', 'sub', 'sup', 'kbd', 'abbr',
    'ul', 'ol', 'li', 'dl', 'dt', 'dd',
    'a', 'img', 'figure', 'figcaption',
    'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption',
  ],
  allowedAttributes: {
    a: ['href', 'title', 'target', 'rel'],
    img: ['src', 'alt', 'title', 'width', 'height', 'loading', 'decoding'],
    h2: ['id'], h3: ['id'], h4: ['id'], h5: ['id'], h6: ['id'],
    div: ['class'], span: ['class'], code: ['class'], pre: ['class'],
    th: ['align', 'colspan', 'rowspan'], td: ['align', 'colspan', 'rowspan'],
    ol: ['start'], abbr: ['title'],
  },
  allowedClasses: {
    div: ['blog-tablo'],
    code: [/^language-[a-z0-9-]+$/],
    pre: [/^language-[a-z0-9-]+$/],
    span: [/^hljs[a-z0-9-]*$/],
  },
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  allowedSchemesByTag: { img: ['http', 'https'] },
  allowProtocolRelative: false,
  disallowedTagsMode: 'discard',
  transformTags: {
    a: (etiket, nit) => {
      const yeni = { ...nit };
      if (yeni.target === '_blank') yeni.rel = 'noopener noreferrer';
      else delete yeni.target;
      return { tagName: 'a', attribs: yeni };
    },
  },
};

export const htmlTemizle = (html) => sanitizeHtml(String(html || ''), AYAR);
