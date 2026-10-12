// Lê o :root de src/styles/tokens.css (fonte única das cores) e gera src/styles/tokens.generated.ts,
// que não é versionado. Também expõe os tokens para as páginas estáticas e o index.html.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const TOKENS_CSS = fileURLToPath(new URL('../src/styles/tokens.css', import.meta.url));
const OUTPUT_TS = fileURLToPath(new URL('../src/styles/tokens.generated.ts', import.meta.url));
const COLOUR = /^(#[0-9a-f]{3,8}|rgba?\([^()]*\))$/i;

function rootBlock(css) {
  const start = css.indexOf(':root {');
  if (start < 0) throw new Error('tokens.css sem bloco :root');
  let depth = 0;
  for (let i = css.indexOf('{', start); i < css.length; i++) {
    if (css[i] === '{') depth++;
    if (css[i] === '}' && --depth === 0) return css.slice(css.indexOf('{', start) + 1, i);
  }
  throw new Error('bloco :root sem fechamento em tokens.css');
}

export function readDeclarations(css = readFileSync(TOKENS_CSS, 'utf8')) {
  const body = rootBlock(css).replace(/\/\*[\s\S]*?\*\//g, '');
  const declarations = new Map();
  for (const [, name, value] of body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
    declarations.set(name, value.trim().replace(/\s+/g, ' '));
  }
  return declarations;
}

function resolve(value, declarations, seen = new Set()) {
  return value.replace(/var\((--[\w-]+)(?:\s*,[^()]*)?\)/g, (match, name) => {
    if (seen.has(name) || !declarations.has(name)) return match;
    return resolve(declarations.get(name), declarations, new Set([...seen, name]));
  });
}

export function readColourTokens(css) {
  const declarations = readDeclarations(css);
  const colours = {};
  for (const [name, value] of declarations) {
    const resolved = resolve(value, declarations);
    if (COLOUR.test(resolved)) colours[name.slice(2)] = resolved;
  }
  return colours;
}

export function tokensRootCss(css) {
  const declarations = [...readDeclarations(css)].map(([name, value]) => `${name}:${value}`);
  return `:root{${declarations.join(';')}}`;
}

export function generateTokensModule(css) {
  const entries = Object.entries(readColourTokens(css))
    .map(([name, value]) => `  '${name}': '${value}',`)
    .join('\n');
  return `// Gerado por scripts/generate-tokens.mjs a partir de src/styles/tokens.css. Não edite.\nexport const tokens = {\n${entries}\n} as const;\n\nexport type TokenName = keyof typeof tokens;\n`;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  writeFileSync(OUTPUT_TS, generateTokensModule());
  console.log(`Tokens gerados em ${OUTPUT_TS}`);
}
