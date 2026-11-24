/**
 * Par de cores (base + pastel) de cada categoria do espectro. Ver
 * docs/nova-identidade/12axes-identidade-visual.md §5.
 */
export interface IdeologyColor {
  key: IdeologyColorKey;
  base: string;
  bg: string;
}

export type IdeologyColorKey =
  | 'esq-radical'
  | 'esquerda'
  | 'centro'
  | 'direita'
  | 'ext-direita'
  | 'terceira'
  | 'libertario'
  | 'anarquismo';

const PALETTE: Record<IdeologyColorKey, IdeologyColor> = {
  'esq-radical': { key: 'esq-radical', base: '#830214', bg: '#ECD5D8' },
  esquerda: { key: 'esquerda', base: '#035732', bg: '#D5ECE2' },
  centro: { key: 'centro', base: '#4B5058', bg: '#DDE0E3' },
  direita: { key: 'direita', base: '#2D4778', bg: '#D6E0F2' },
  'ext-direita': { key: 'ext-direita', base: '#001743', bg: '#D5DAE6' },
  terceira: { key: 'terceira', base: '#4B2A63', bg: '#E2D5EC' },
  libertario: { key: 'libertario', base: '#946201', bg: '#F0E4C8' },
  anarquismo: { key: 'anarquismo', base: '#2B2B2B', bg: '#E2DFD8' }
};

// Conjunto próprio do cluster neorreacionário (neorreação, iluminismo sombrio, aceleracionismo de direita, tecno-monarquismo, tecno-feudalismo, neocameralismo e tecno-comercialismo): base do anarquismo (grafite) com o pastel do libertário (creme dourado).
const DARK_YELLOW = { base: '#2B2B2B', bg: '#F0E4C8' };

/**
 * Ideologias com cores próprias em vez das da categoria (id da ideologia → par base/pastel). A chave continua sendo a da
 * categoria, para os mapas por espectro (bússola, árvore, PDF) seguirem funcionando.
 */
const IDEOLOGY_OVERRIDES: Record<string, { base: string; bg: string }> = {
  'aceleracionismo-de-direita': DARK_YELLOW,
  'iluminismo-sombrio': DARK_YELLOW,
  neorreacionarismo: DARK_YELLOW,
  'tecno-monarquismo': DARK_YELLOW,
  'tecno-feudalismo': DARK_YELLOW,
  neocameralismo: DARK_YELLOW,
  'tecno-comercialismo': DARK_YELLOW
};

// Nomes de categoria vindos da API (PT, EN e ES) e ids do espectro da home.
const ALIASES: Record<string, IdeologyColorKey> = {
  'esquerda radical': 'esq-radical',
  'radical left': 'esq-radical',
  'izquierda radical': 'esq-radical',
  izquierda: 'esquerda',
  derecha: 'direita',
  'extrema derecha': 'ext-direita',
  'tercera posición': 'terceira',
  'radikale linke': 'esq-radical',
  linke: 'esquerda',
  mitte: 'centro',
  rechte: 'direita',
  'extreme rechte': 'ext-direita',
  'dritte position': 'terceira',
  'sinistra radicale': 'esq-radical',
  sinistra: 'esquerda',
  destra: 'direita',
  'estrema destra': 'ext-direita',
  'terza posizione': 'terceira',
  'радикальные левые': 'esq-radical',
  левые: 'esquerda',
  центр: 'centro',
  правые: 'direita',
  'крайне правые': 'ext-direita',
  'третья позиция': 'terceira',
  либертарианцы: 'libertario',
  анархисты: 'anarquismo',
  'gauche radicale': 'esq-radical',
  gauche: 'esquerda',
  centre: 'centro',
  droite: 'direita',
  'extrême droite': 'ext-direita',
  'troisième position': 'terceira',
  libertarien: 'libertario',
  anarchiste: 'anarquismo',
  anarchico: 'anarquismo',
  libertär: 'libertario',
  anarchistisch: 'anarquismo',
  libertario: 'libertario',
  anarquista: 'anarquismo',
  'left-radical': 'esq-radical',
  esquerda: 'esquerda',
  left: 'esquerda',
  centro: 'centro',
  center: 'centro',
  direita: 'direita',
  right: 'direita',
  'extrema direita': 'ext-direita',
  'far-right': 'ext-direita',
  'right-extreme': 'ext-direita',
  'terceira posição': 'terceira',
  'third position': 'terceira',
  'third-position': 'terceira',
  libertário: 'libertario',
  libertarian: 'libertario',
  anarquismo: 'anarquismo',
  anarchist: 'anarquismo'
};

export const SPECTRUM_ORDER: IdeologyColor[] = [
  PALETTE['esq-radical'],
  PALETTE.esquerda,
  PALETTE.centro,
  PALETTE.direita,
  PALETTE['ext-direita'],
  PALETTE.terceira,
  PALETTE.libertario,
  PALETTE.anarquismo
];

/** Cor de uma categoria pela chave interna (sem passar pelos nomes vindos da API). */
export function ideologyColorByKey(key: IdeologyColorKey): IdeologyColor {
  return PALETTE[key];
}

/** Com o id da ideologia, as que têm conjunto próprio usam o dele; as demais (e quem não passa o id) seguem a categoria. */
export function resolveIdeologyColor(category: string, ideologyId?: string): IdeologyColor {
  const byCategory = PALETTE[ALIASES[category.trim().toLowerCase()] ?? 'centro'];
  const own = ideologyId ? IDEOLOGY_OVERRIDES[ideologyId] : undefined;
  return own ? { key: byCategory.key, ...own } : byCategory;
}

/** Variáveis CSS que os componentes editoriais leem (--cat/--cat-bg ou --c/--cb). */
export function catStyle(category: string, ideologyId?: string): Record<string, string> {
  const color = resolveIdeologyColor(category, ideologyId);
  return { '--cat': color.base, '--cat-bg': color.bg };
}

export function localCatStyle(category: string, ideologyId?: string): Record<string, string> {
  const color = resolveIdeologyColor(category, ideologyId);
  return { '--c': color.base, '--cb': color.bg };
}
