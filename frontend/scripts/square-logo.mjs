// Gera o logo/simbolo de um partido ou organização em formato quadrado 1:1 (480x480 PNG).
// O simbolo oficial (SVG ou raster, normalmente da Wikipedia/Wikimedia Commons) é centralizado
// numa tela quadrada transparente sem distorcer nem cortar, com uma margem pequena.
//
// Uso:
//   node scripts/square-logo.mjs <entrada.svg|png|jpg|gif|webp> <saida.png>
//   npm run square:logo -- <entrada> public/parties/logos/<id>.png
import sharp from 'sharp';
import { existsSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const SIZE = 480;
const MARGIN = 0.06; // fração da tela reservada de cada lado

const [input, output] = process.argv.slice(2);
if (!input || !output) {
  console.error('Uso: node scripts/square-logo.mjs <entrada> <saida.png>');
  process.exit(1);
}
if (!existsSync(input)) {
  console.error(`[square-logo] entrada não encontrada: ${input}`);
  process.exit(1);
}
if (!/\.png$/i.test(output)) {
  console.error('[square-logo] a saída precisa ser .png (preserva transparência)');
  process.exit(1);
}
mkdirSync(dirname(output), { recursive: true });

const inner = Math.round(SIZE * (1 - 2 * MARGIN));
// density alta só afeta SVG: rasteriza em boa resolução antes de reduzir. SVGs com tela
// gigante estouram o limite de pixels; nesse caso tenta de novo com densidades menores.
async function rasterize() {
  let lastError;
  for (const density of [300, 150, 72, 36]) {
    try {
      return await sharp(input, { density })
        .resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toBuffer();
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}
const resized = await rasterize();

const pad = Math.round((SIZE - inner) / 2);
await sharp({
  create: { width: SIZE, height: SIZE, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
})
  .composite([{ input: resized, left: pad, top: pad }])
  .png({ compressionLevel: 9, palette: true, quality: 85 })
  .toFile(output);

const meta = await sharp(output).metadata();
console.log(`[square-logo] ${output}: ${meta.width}x${meta.height}`);
