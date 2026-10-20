// Dados prontos da visualização em teia (/tree/*): o build calcula a similaridade entre todos os pares,
// o layout e as listas de "mais próximas" e grava um JSON por catálogo e idioma em dist/tree-data/.
// O navegador só baixa o arquivo (cacheável na CDN e no navegador) e desenha: nada pesado roda no cliente.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { compatibility, religionVisibility } from './profile-match.mjs';
import { buildTreeLayout } from './tree-layout.mjs';
import { CATEGORY_KEY } from './ideologies-index.mjs';

export const TREE_KINDS = ['ideologies', 'personalities', 'countries', 'parties'];
const LOCALES = ['pt', 'en'];

// Centro de cada região da bússola política (direita, autoritário), em 0–100.
const REGION_CENTERS = {
  'esq-radical': [15, 85],
  terceira: [50, 85],
  'ext-direita': [85, 85],
  esquerda: [15, 50],
  centro: [50, 50],
  direita: [85, 50],
  anarquismo: [20, 12],
  libertario: [80, 12]
};
const BASE_X = 1170;
const BASE_Y = 900;
const SIMILAR_COUNT = 6;

const KIND_FILES = {
  ideologies: { meta: 'ideologies.json', profiles: 'ideology-profiles.json', idKey: 'ideologyId' },
  personalities: { meta: 'personalities.json', profiles: 'personality-profiles.json', idKey: 'personalityId' },
  countries: { meta: 'countries.json', profiles: 'countries-profiles.json', idKey: 'countryId' },
  parties: { meta: 'parties.json', profiles: 'parties-profiles.json', idKey: 'partyId' }
};

const round = (value, digits) => {
  const f = 10 ** digits;
  return Math.round(value * f) / f;
};

const keyOfCategory = (category) => CATEGORY_KEY[String(category ?? '').trim().toLowerCase()] ?? 'centro';

/** Posição na bússola (mesmas fórmulas de src/utils/politicalCompass.ts). */
function compassOf(vector, axisIds) {
  const at = (id) => vector[axisIds.indexOf(id)] ?? 50;
  return {
    right: 0.6 * (100 - at('economia')) + 0.4 * (100 - at('controle')),
    authoritarian: (at('poder') + (100 - at('representacao')) + (100 - at('estrutura'))) / 3
  };
}

function percentile(values) {
  const order = values.map((_, i) => i).sort((a, b) => values[a] - values[b] || a - b);
  const out = new Array(values.length);
  order.forEach((idx, pos) => {
    out[idx] = (pos / Math.max(1, values.length - 1)) * 100;
  });
  return out;
}

/** @param {string} dataDir backend/src/main/resources/data */
export function buildTreeData(dataDir) {
  const read = (path) => JSON.parse(readFileSync(join(dataDir, path), 'utf8'));
  const readOverlay = (locale, file) => {
    const path = join(dataDir, 'i18n', locale, file);
    return existsSync(path) ? new Map(JSON.parse(readFileSync(path, 'utf8')).map((item) => [item.id, item])) : new Map();
  };

  const axesPt = read('axes.json');
  const axisIds = axesPt.map((axis) => axis.id);
  const axesByLocale = {
    pt: axesPt,
    en: (() => {
      const tr = readOverlay('en', 'axes.json');
      return axesPt.map((axis) => ({ ...axis, ...(tr.get(axis.id) ?? {}) }));
    })()
  };

  // Referências do espectro: categoria de cada ideologia, para etiquetar os demais catálogos como o quiz faz.
  const ideologyMetas = read('ideologies.json');
  const ideologyVectors = new Map(read('ideology-profiles.json').map((p) => [p.ideologyId, p.vector]));
  const refs = ideologyMetas
    .filter((meta) => ideologyVectors.has(meta.id))
    .map((meta) => ({ key: keyOfCategory(meta.category), vector: ideologyVectors.get(meta.id), religions: meta.religions ?? [] }));
  // Como nas páginas de perfil: só conta o que é compatível com a religião do próprio perfil.
  const nearestSpectrum = (vector, subject) => {
    const visible = religionVisibility(subject);
    let best = 'centro';
    let bestScore = -1;
    for (const ref of refs) {
      if (!visible(ref)) continue;
      const score = compatibility(vector, ref.vector);
      if (score > bestScore) {
        bestScore = score;
        best = ref.key;
      }
    }
    return best;
  };

  const out = new Map();
  for (const kind of TREE_KINDS) {
    const files = KIND_FILES[kind];
    const metas = read(files.meta);
    const vectors = new Map(read(files.profiles).map((p) => [p[files.idKey], p.vector]));
    const items = metas.filter((meta) => vectors.has(meta.id));
    const n = items.length;
    const objects = items.map((meta) => vectors.get(meta.id));
    const arrays = objects.map((vector) => axisIds.map((id) => vector[id] ?? 50));

    // Similaridade = a pontuação do quiz (ProfileMatchScorer), média dos dois sentidos. Perfis de religiões
    // incompatíveis (ex.: um grupo islâmico e um católico) nunca são vizinhos: pontuação 0, como no filtro do quiz.
    const visible = items.map((meta) => religionVisibility(meta));
    const related = (i, j) => visible[i](items[j]) && visible[j](items[i]);
    const matrix = new Float32Array(n * n);
    for (let i = 0; i < n; i += 1) {
      for (let j = i + 1; j < n; j += 1) {
        const score = related(i, j) ? (compatibility(objects[i], objects[j]) + compatibility(objects[j], objects[i])) / 2 : 0;
        matrix[i * n + j] = score;
        matrix[j * n + i] = score;
      }
    }

    const keys = items.map((meta, i) => (kind === 'ideologies' ? keyOfCategory(meta.category) : nearestSpectrum(objects[i], meta)));

    // Posição-alvo: metade o posto na bússola (espalha uniformemente), metade o centro da região do espectro.
    const scale = Math.max(0.85, Math.sqrt(n / 271));
    const worldX = BASE_X * scale;
    const worldY = BASE_Y * scale;
    const own = arrays.map((vector) => compassOf(vector, axisIds));
    const rightRank = percentile(own.map((o) => o.right));
    const authRank = percentile(own.map((o) => o.authoritarian));
    const anchors = items.map((_, i) => {
      const region = REGION_CENTERS[keys[i]];
      const right = rightRank[i] * 0.5 + region[0] * 0.5;
      const authoritarian = authRank[i] * 0.5 + region[1] * 0.5;
      return [((right - 50) / 50) * (worldX / 900), (-(authoritarian - 50) / 50) * (worldY / 900)];
    });
    const similarity = (i, j) => Math.max(0, Math.min(1, (matrix[i * n + j] - 50) / 50));
    const layout = buildTreeLayout(
      items.map((meta, i) => ({ id: meta.id, vector: arrays[i] })),
      3,
      anchors,
      similarity
    );

    const similar = items.map((_, i) =>
      Array.from({ length: n }, (_, j) => j)
        .filter((j) => j !== i && related(i, j))
        .sort((a, b) => matrix[i * n + b] - matrix[i * n + a] || a - b)
        .slice(0, SIMILAR_COUNT)
        .map((j) => [j, round(matrix[i * n + j], 1)])
    );

    for (const locale of LOCALES) {
      const tr = readOverlay(locale === 'pt' ? 'en' : locale, files.meta); // PT usa o arquivo base
      const nodes = items.map((meta, i) => {
        const t = locale === 'pt' ? undefined : tr.get(meta.id);
        const category = t?.category ?? meta.category ?? '';
        const period = meta.historical && meta.period ? ` · ${meta.period}` : '';
        const sub = kind === 'personalities' ? (t?.role ?? meta.role ?? '') : kind === 'ideologies' ? '' : `${category}${period}`;
        return {
          id: meta.id,
          name: t?.name ?? meta.name,
          sub,
          desc: t?.description ?? meta.description,
          vec: arrays[i].map((v) => round(v, 1)),
          key: keys[i],
          img: meta.imagePath ?? meta.flagPath ?? meta.logoPath ?? ''
        };
      });
      out.set(`${locale}-${kind}`, {
        v: 1,
        kind,
        locale,
        worldX: round(worldX, 1),
        worldY: round(worldY, 1),
        scale: round(scale, 3),
        axes: axesByLocale[locale].map(({ id, label, leftPole, rightPole, leftColor, rightColor }) => ({
          id,
          label,
          leftPole,
          rightPole,
          leftColor,
          rightColor
        })),
        nodes,
        x: Array.from(layout.x, (v) => round(v, 1)),
        y: Array.from(layout.y, (v) => round(v, 1)),
        deg: layout.degree,
        edges: layout.edges.map((e) => [e.a, e.b, round(e.similarity, 2)]),
        similar
      });
    }
  }
  return out;
}

/** Grava dist/tree-data/{locale}-{kind}.json (minificado). */
export function writeTreeData(dataDir, outDir) {
  const dir = join(outDir, 'tree-data');
  mkdirSync(dir, { recursive: true });
  const all = buildTreeData(dataDir);
  for (const [name, payload] of all) writeFileSync(join(dir, `${name}.json`), JSON.stringify(payload));
  return all.size;
}
