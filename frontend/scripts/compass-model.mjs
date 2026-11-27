// Pesos da bússola: X (direita) e Y (autoritário) são somas ponderadas dos 12 eixos, com um conjunto de pesos por quadrante
// (cima-esquerda, cima-direita, baixo-esquerda, baixo-direita), misturados pela posição do ponto (transição gradual).
// Os pesos são ajustados por mínimos quadrados para levar cada perfil dos quatro catálogos ao centro da região do seu espectro
// (ideologias pela categoria; personalidades, países e partidos pela categoria da ideologia mais próxima), com cada espectro
// pesando o mesmo e cada quadrante puxado para o modelo linear único (evita pesos absurdos num quadrante com poucos perfis).
// O resultado é usado direto, sem esticar. Gera src/data/compassModel.json, que o front lê (src/utils/politicalCompass.ts).
//
// Uso: node scripts/compass-model.mjs   (o build roda antes do vite; o teste compassModel.test.ts acusa arquivo velho)
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { compatibility } from '../src/wiki/engine/score.ts';
import { resolveIdeologyColor } from '../src/utils/ideologyColors.ts';
import { AXIS_IDS, REGION_ANCHORS, compassModelPosition, quadrantShares } from '../src/utils/compassModel.ts';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DATA = resolve(ROOT, '../backend/src/main/resources/data');
export const MODEL_FILE = join(ROOT, 'src/data/compassModel.json');
const RIDGE = 0.3;
const ITERATIONS = 3;

const read = (file) => JSON.parse(readFileSync(join(DATA, file), 'utf8'));
const features = (vector) => [1, ...AXIS_IDS.map((axis) => (vector[axis] - 50) / 50)];

function solve(rows, targets) {
  const n = rows[0].length;
  const m = Array.from({ length: n }, () => Array(n + 1).fill(0));
  rows.forEach((row, r) => {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) m[i][j] += row[i] * row[j];
      m[i][n] += row[i] * targets[r];
    }
  });
  for (let i = 0; i < n; i++) m[i][i] += 1e-3;
  for (let c = 0; c < n; c++) {
    let p = c;
    for (let r = c + 1; r < n; r++) if (Math.abs(m[r][c]) > Math.abs(m[p][c])) p = r;
    [m[c], m[p]] = [m[p], m[c]];
    for (let r = 0; r < n; r++) {
      if (r === c) continue;
      const f = m[r][c] / m[c][c];
      for (let k = c; k <= n; k++) m[r][k] -= f * m[c][k];
    }
  }
  return m.map((row, i) => row[n] / row[i]);
}

function catalogue() {
  const category = new Map(read('ideologies.json').map((ideology) => [ideology.id, ideology.category]));
  const ideologies = read('ideology-profiles.json').map((profile) => ({ key: resolveIdeologyColor(category.get(profile.ideologyId) ?? '').key, vector: profile.vector }));
  const nearestKey = (vector) => {
    let best = ideologies[0];
    let bestScore = -1;
    for (const ideology of ideologies) {
      const score = compatibility(vector, ideology.vector);
      if (score > bestScore) {
        bestScore = score;
        best = ideology;
      }
    }
    return best.key;
  };
  const others = [...read('personality-profiles.json'), ...read('countries-profiles.json'), ...read('parties-profiles.json')].map((profile) => ({ key: nearestKey(profile.vector), vector: profile.vector }));
  return [...ideologies, ...others];
}

const round = (value) => Math.round(value * 1e4) / 1e4;

export function computeCompassModel() {
  const all = catalogue();
  const count = {};
  for (const item of all) count[item.key] = (count[item.key] ?? 0) + 1;
  const weight = (item) => Math.sqrt(all.length / Object.keys(REGION_ANCHORS).length / count[item.key]);

  // Modelo linear único: ponto de partida e referência da regularização.
  const rows = all.map((item) => features(item.vector).map((f) => f * weight(item)));
  const base = {
    wx: solve(rows, all.map((item) => REGION_ANCHORS[item.key][0] * weight(item))),
    wy: solve(rows, all.map((item) => REGION_ANCHORS[item.key][1] * weight(item)))
  };
  const linear = (vector) => {
    const f = features(vector);
    const clamp = (v) => Math.max(0, Math.min(100, v));
    return [clamp(f.reduce((s, z, i) => s + z * base.wx[i], 0)), clamp(f.reduce((s, z, i) => s + z * base.wy[i], 0))];
  };
  let positions = all.map((item) => linear(item.vector));
  const n = AXIS_IDS.length + 1;
  const pull = RIDGE * Math.sqrt(all.length / 50);
  let model = null;
  for (let it = 0; it < ITERATIONS; it++) {
    const a = [];
    const bx = [];
    const by = [];
    all.forEach((item, index) => {
      const w = weight(item);
      const f = features(item.vector);
      a.push(quadrantShares(positions[index][0], positions[index][1]).flatMap((share) => f.map((z) => z * share * w)));
      bx.push(REGION_ANCHORS[item.key][0] * w);
      by.push(REGION_ANCHORS[item.key][1] * w);
    });
    for (let q = 0; q < 4; q++) {
      for (let i = 0; i < n; i++) {
        const row = Array(4 * n).fill(0);
        row[q * n + i] = pull;
        a.push(row);
        bx.push(pull * base.wx[i]);
        by.push(pull * base.wy[i]);
      }
    }
    model = { wx: solve(a, bx), wy: solve(a, by) };
    positions = all.map((item) => {
      const p = compassModelPosition(item.vector, model);
      return [p.right, p.authoritarian];
    });
  }
  return { axes: AXIS_IDS, wx: model.wx.map(round), wy: model.wy.map(round) };
}

export function compassModelJson() {
  return `${JSON.stringify(computeCompassModel())}\n`;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  writeFileSync(MODEL_FILE, compassModelJson());
  console.log(`compass: pesos da bússola gravados em ${MODEL_FILE}`);
}
