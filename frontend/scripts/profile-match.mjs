// Porte fiel de backend/.../ProfileMatchScorer.java e dos grupos de eixos de
// DimensionMatcherService.java. As páginas estáticas mostram as mesmas
// porcentagens que o quiz mostraria para um usuário com o vetor da pessoa.
// Se a fórmula mudar no backend, mude aqui também.

export const AXIS_IDS = [
  'estrutura', 'representacao', 'poder', 'imigracao', 'diplomacia', 'intervencao',
  'economia', 'controle', 'comercio', 'religiao', 'moral', 'tecnologia'
];

export const DIMENSIONS = [
  {
    key: 'political',
    axes: ['estrutura', 'representacao', 'poder', 'diplomacia', 'imigracao', 'intervencao',
      'tecnologia', 'controle', 'comercio', 'religiao', 'economia', 'moral']
  },
  { key: 'social', axes: ['representacao', 'moral', 'religiao', 'economia', 'controle', 'comercio', 'imigracao', 'poder', 'tecnologia'] },
  { key: 'economic', axes: ['economia', 'controle', 'comercio'] }
];

const CENTER = 50;
const AXIS_SPREAD = 50;
const AXIS_WEIGHT = 0.42;
const DIRECTION_WEIGHT = 0.33;
const MAGNITUDE_WEIGHT = 0.18;
const OUTLIER_WEIGHT = 0.07;
const OPPOSITE_SIDE_MAX_PENALTY = 0.45;
const OPPOSITE_SIDE_SPREAD = 25;
const OUTLIER_FULL_SPREAD = 100;
const OUTLIER_EXPONENT = 2.5;
const DIRECTION_AUGMENT_RADIUS = 8;

const get = (v, id) => v?.[id] ?? CENTER;
const round1 = (x) => Math.round(x * 10) / 10;

export function compatibility(user, target, axisIds = AXIS_IDS) {
  const n = axisIds.length;
  let axisSum = 0;
  let dot = 0;
  let uu = 0;
  let tt = 0;
  let uMag = 0;
  let tMag = 0;
  let maxDiff = 0;
  for (const id of axisIds) {
    const u = get(user, id);
    const t = get(target, id);
    const diff = Math.abs(u - t);
    let sim = Math.max(0, 1 - (diff / AXIS_SPREAD) ** 2);
    if ((u - CENTER) * (t - CENTER) < 0) {
      sim *= 1 - OPPOSITE_SIDE_MAX_PENALTY
        * Math.tanh(Math.abs(u - CENTER) / OPPOSITE_SIDE_SPREAD)
        * Math.tanh(Math.abs(t - CENTER) / OPPOSITE_SIDE_SPREAD);
    }
    axisSum += sim;
    const cu = u - CENTER;
    const ct = t - CENTER;
    dot += cu * ct;
    uu += cu * cu;
    tt += ct * ct;
    uMag += Math.abs(cu);
    tMag += Math.abs(ct);
    maxDiff = Math.max(maxDiff, diff);
  }
  const augment = n * DIRECTION_AUGMENT_RADIUS * DIRECTION_AUGMENT_RADIUS;
  const cosine = (dot + augment) / Math.sqrt((uu + augment) * (tt + augment));
  const axisSimilarity = (100 * axisSum) / n;
  const directionSimilarity = CENTER + CENTER * cosine;
  const magnitudeSimilarity = 100 - 2 * Math.abs(uMag / n - tMag / n);
  const outlierSimilarity = 100 * Math.max(0, 1 - (maxDiff / OUTLIER_FULL_SPREAD) ** OUTLIER_EXPONENT);
  const score = AXIS_WEIGHT * axisSimilarity
    + DIRECTION_WEIGHT * directionSimilarity
    + MAGNITUDE_WEIGHT * magnitudeSimilarity
    + OUTLIER_WEIGHT * outlierSimilarity;
  return round1(Math.max(0, Math.min(100, score)));
}

// Ranking decrescente de um catálogo contra `user`, com desempate por nome
// (mesmo comparador dos matcher services).
export function rank(user, items, vectorOf, axisIds = AXIS_IDS) {
  return items
    .map((item) => ({ item, score: compatibility(user, vectorOf(item), axisIds) }))
    .sort((a, b) => b.score - a.score || a.item.name.localeCompare(b.item.name));
}

// Destaque por dimensão (política, social, econômica), excluindo em sequência
// quem já apareceu — como DimensionMatcherService.findAll.
export function dimensionMatches(user, items, vectorOf, excludeIds = []) {
  const excluded = new Set(excludeIds);
  const out = [];
  for (const dim of DIMENSIONS) {
    const best = rank(user, items.filter((i) => !excluded.has(i.id)), vectorOf, dim.axes)[0];
    if (!best) continue;
    out.push({ dimension: dim.key, ...best });
    excluded.add(best.item.id);
  }
  return out;
}

// ── Filtro de religião ──────────────────────────────────────────────────────
// Porte de ReligionFilter.java. Na tela de resultado o usuário escolhe uma
// religião e o ranking exclui os perfis ligados só a outras religiões; "only"
// torna o perfil exclusivo de quem escolheu uma das religiões listadas.
export const SELECTABLE_RELIGIONS = ['christianity', 'judaism', 'islam', 'buddhism'];
const ONLY = 'only';

export function religionAllows(religions, preference) {
  if (!religions || religions.length === 0) return true;
  if (religions.includes(ONLY)) return preference != null && religions.includes(preference);
  if (preference == null) return true;
  return religions.includes(preference) || !religions.some((r) => SELECTABLE_RELIGIONS.includes(r));
}

// Nas páginas de perfil, a religião do próprio perfil faz o papel da escolha
// do usuário: um perfil cristão só vê, nos rankings, perfis compatíveis com o
// cristianismo (some o "only" de outras religiões); um perfil sem religião
// selecionável equivale a "nenhuma" e também não vê perfis "only".
// Com mais de uma religião, basta o item servir a uma delas.
export function religionVisibility(subject) {
  const prefs = (subject?.religions ?? []).filter((r) => SELECTABLE_RELIGIONS.includes(r));
  if (prefs.length === 0) return (item) => religionAllows(item.religions, null);
  return (item) => prefs.some((pref) => religionAllows(item.religions, pref));
}
