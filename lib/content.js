import fs from 'fs';
import path from 'path';

const CONTENT = path.join(process.cwd(), 'content');

export function getManifest() {
  return JSON.parse(fs.readFileSync(path.join(CONTENT, 'manifest.json'), 'utf8'));
}

export function pageBySlug(slug) {
  return getManifest().pages.find((p) => p.slug === slug) || null;
}
