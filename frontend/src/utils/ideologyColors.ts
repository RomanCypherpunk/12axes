import { tokens } from '../styles/tokens.generated';

/**
 * Par de cores (base + pastel) de cada categoria do espectro, lido de --i-<chave> e
 * --i-<chave>-bg em src/styles/tokens.css. Ver docs/nova-identidade/12axes-identidade-visual.md §5.
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

function colorOf(key: IdeologyColorKey): IdeologyColor {
  return { key, base: tokens[`i-${key}`], bg: tokens[`i-${key}-bg`] };
}

const PALETTE: Record<IdeologyColorKey, IdeologyColor> = {
  'esq-radical': colorOf('esq-radical'),
  esquerda: colorOf('esquerda'),
  centro: colorOf('centro'),
  direita: colorOf('direita'),
  'ext-direita': colorOf('ext-direita'),
  terceira: colorOf('terceira'),
  libertario: colorOf('libertario'),
  anarquismo: colorOf('anarquismo')
};

// Nomes de categoria vindos da API (PT e EN) e ids do espectro da home.
const ALIASES: Record<string, IdeologyColorKey> = {
  'esquerda radical': 'esq-radical',
  'radical left': 'esq-radical',
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
  anarquista: 'anarquismo',
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

export function resolveIdeologyColor(category: string): IdeologyColor {
  return PALETTE[ALIASES[category.trim().toLowerCase()] ?? 'centro'];
}

/** Variáveis CSS que os componentes editoriais leem (--cat/--cat-bg ou --c/--cb). */
export function catStyle(category: string): Record<string, string> {
  const color = resolveIdeologyColor(category);
  return { '--cat': color.base, '--cat-bg': color.bg };
}

export function localCatStyle(category: string): Record<string, string> {
  const color = resolveIdeologyColor(category);
  return { '--c': color.base, '--cb': color.bg };
}
