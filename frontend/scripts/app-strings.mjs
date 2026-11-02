// Textos do app reaproveitados pelas páginas estáticas, lidos direto de
// src/i18n/pt.ts, en.ts e fr.ts (explicação de cada eixo, usada no helper "?" das barras),
// para não manter uma cópia própria.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Normaliza CRLF: num checkout no Windows o arquivo vem com \r\n e os marcadores abaixo não casariam.
const read = (file) =>
  readFileSync(join(dirname(fileURLToPath(import.meta.url)), '../src/i18n', file), 'utf8').replace(/\r\n/g, '\n');

// Cada dicionário (pt.ts, en.ts e fr.ts) tem um bloco `axisExplanations: { ... }` com entradas `id: 'texto'`.
function explanationBlock(file) {
  const source = read(file);
  const marker = 'axisExplanations: {\n';
  const start = source.indexOf(marker);
  if (start === -1) throw new Error(`app-strings: bloco axisExplanations não encontrado em ${file}`);
  const end = source.indexOf('\n  },', start);
  const body = source.slice(start + marker.length, end);
  const entries = {};
  // Aceita aspas simples ou duplas (en.ts/pt.ts usam simples; fr.ts pode usar duplas).
  for (const m of body.matchAll(/(\w+):\s*(?:'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)")/g)) {
    entries[m[1]] = (m[2] ?? m[3]).replace(/\\(['"])/g, '$1');
  }
  return entries;
}

export const AXIS_EXPLANATIONS = { pt: explanationBlock('pt.ts'), en: explanationBlock('en.ts'), fr: explanationBlock('fr.ts') };
