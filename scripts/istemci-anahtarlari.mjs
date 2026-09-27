import fs from 'fs';
import path from 'path';

const kok = process.cwd();
const dosyalar = [];
const gez = (d) => {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) gez(p);
    else if (/\.(jsx?|mjs)$/.test(f)) dosyalar.push(p);
  }
};
['app', 'components', 'lib', 'content'].forEach((d) => gez(path.join(kok, d)));

const anahtarlar = new Set();
for (const d of dosyalar) {
  const s = fs.readFileSync(d, 'utf8');
  if (/metinAl\(/.test(s) || !/from '@\/lib\/metin'/.test(s)) continue;
  for (const x of s.matchAll(/['"`]([a-z]+(?:_[a-z]+)*\.[a-z0-9_]+)['"`]/g)) anahtarlar.add(x[1]);
}
fs.writeFileSync(path.join(kok, 'lib', 'istemci-anahtarlari.json'), JSON.stringify([...anahtarlar].sort()));
console.log(`istemci anahtarlari: ${anahtarlar.size}`);
