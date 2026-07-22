// Otimiza retratos (personalities/portraits) e bandeiras (countries) em public/.
// Redimensiona para no máximo MAX_WIDTH (2x o maior uso real no site, que é
// ~220-240px) e recomprime no MESMO formato original (mantém .png como .png,
// preservando alpha quando existir, e .jpg como .jpg) para não quebrar
// nenhuma referência de path em dados/código. Roda uma vez, manualmente.
import sharp from 'sharp';
import { readdirSync, statSync, renameSync } from 'node:fs';
import { join, extname } from 'node:path';

const TARGETS = ['public/personalities/portraits', 'public/countries'];
const MAX_WIDTH = 480;
const JPEG_QUALITY = 78;
const PNG_QUALITY = 80;

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...walk(full));
    else if (/\.(jpe?g|png)$/i.test(entry)) out.push(full);
  }
  return out;
}

async function optimize(file) {
  const before = statSync(file).size;
  const img = sharp(file);
  const meta = await img.metadata();
  const ext = extname(file).toLowerCase();
  const isPng = ext === '.png';

  const pipeline = img.resize({ width: MAX_WIDTH, withoutEnlargement: true });
  const tmp = `${file}.tmp`;

  if (isPng) {
    await pipeline.png({ quality: PNG_QUALITY, compressionLevel: 9, palette: true }).toFile(tmp);
  } else {
    await pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toFile(tmp);
  }
  renameSync(tmp, file);
  return { file, before, after: statSync(file).size, width: meta.width, hasAlpha: meta.hasAlpha };
}

const files = TARGETS.flatMap((dir) => walk(dir));
console.log(`Encontrados ${files.length} arquivos.`);

let totalBefore = 0;
let totalAfter = 0;

for (const file of files) {
  const r = await optimize(file);
  totalBefore += r.before;
  totalAfter += r.after;
  const pct = (100 * (1 - r.after / r.before)).toFixed(0);
  console.log(`${r.file}  ${(r.before / 1024).toFixed(0)}KB -> ${(r.after / 1024).toFixed(0)}KB (-${pct}%)${r.hasAlpha ? ' [alpha]' : ''}`);
}

console.log('\n=== Resumo ===');
console.log(`Total antes: ${(totalBefore / 1024 / 1024).toFixed(1)}MB`);
console.log(`Total depois: ${(totalAfter / 1024 / 1024).toFixed(1)}MB`);
console.log(`Economia: ${(100 * (1 - totalAfter / totalBefore)).toFixed(0)}%`);
