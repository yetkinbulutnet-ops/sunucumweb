import fs from 'fs';
import path from 'path';

const CONTENT = path.join(process.cwd(), 'content');

export function getManifest() {
  return JSON.parse(fs.readFileSync(path.join(CONTENT, 'manifest.json'), 'utf8'));
}

export function getHeader() {
  return fs.readFileSync(path.join(CONTENT, '_header.html'), 'utf8');
}

export function getFooter() {
  return fs.readFileSync(path.join(CONTENT, '_footer.html'), 'utf8');
}

export function getPageHtml(slug) {
  const p = path.join(CONTENT, 'pages', `${slug}.html`);
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null;
}

export function getPageScripts(slug) {
  const p = path.join(CONTENT, 'pages', `${slug}.scripts.js`);
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null;
}

export function pageBySlug(slug) {
  return getManifest().pages.find((p) => p.slug === slug) || null;
}

function readStandalone(slug, ext) {
  const p = path.join(CONTENT, 'standalone', `${slug}${ext}`);
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null;
}
export const getStandaloneHtml = (slug) => readStandalone(slug, '.html');
export const getStandaloneCss = (slug) => readStandalone(slug, '.css');
export const getStandaloneScripts = (slug) => readStandalone(slug, '.scripts.js');

export function getLegalHtml(slug) {
  const p = path.join(CONTENT, 'site', 'legal', `${slug}.html`);
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
}
