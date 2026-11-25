import type { AxisResult } from '../types/quiz';
import type { IdeologyColorKey } from './ideologyColors';

/** Posição do usuário na bússola política, cada valor de 0 a 100. */
export interface CompassPosition {
  /** 0 = esquerda, 100 = direita. */
  right: number;
  /** 0 = esquerda, 100 = direita, só pela `economia`: o que a pessoa pensa de economia, sem a moral (cartão "Economicamente"). */
  economy: number;
  /** 0 = livre mercado, 100 = planejamento, só pelo `controle`: o método econômico (cartão "Economicamente"). */
  planning: number;
  /** 0 = libertário, 100 = autoritário. */
  authoritarian: number;
  /** 0 = progressista, 100 = tradicionalista. */
  traditional: number;
}

const mean = (values: number[]): number => values.reduce((sum, value) => sum + value, 0) / values.length;

// Eixo esquerda-direita: `economia` (propriedade dos meios de produção, privada à direita) com peso 2 e `moral` (conservadora
// à direita) com peso 1. Só a economia colocava a economia dirigida com moral conservadora (Terceira Posição, teocracias,
// comunismos nacionais) na esquerda radical; com a moral no eixo, ela cai no meio. O planejamento estatal (`controle`) fica
// fora do horizontal (também é alto na extrema direita) e entra no eixo vertical, com um peso pequeno. Simulação nas 291
// ideologias do catálogo: acerto da própria região 56,4% -> 59,8% (Terceira Posição 45% -> 77%, Centro 70% -> 88%).
const WEIGHT_ECONOMY_IN_RIGHT = 2;
const WEIGHT_MORAL_IN_RIGHT = 1;
const WEIGHT_PLANNING_IN_AUTHORITY = 0.1;

/**
 * Compõe a bússola a partir dos eixos do quiz. `leftPercent` é o quanto o usuário pende ao polo
 * esquerdo do eixo em `axes.json` (100 = polo esquerdo inteiro), então cada eixo é invertido
 * quando o polo esquerdo não é o que a bússola chama de direita, autoritário ou tradicionalista:
 *
 * - direita: média ponderada (2:1) de `economia` (esq. Público) e `moral` (esq. Progressista), invertida;
 * - autoritário: 90% a média de `poder` (esq. Segurança, direto), `representacao` (esq. Democracia) e `estrutura`
 *   (esq. Federal), estes dois invertidos, e 10% `controle` (esq. Planejamento, direto);
 * - tradicionalista (a barra): `moral` (esq. Progressista), invertido.
 *
 * Devolve null se algum desses eixos faltar no resultado (ex.: resultado compartilhado antigo).
 */
export function computeCompass(results: Map<string, AxisResult>): CompassPosition | null {
  return compassFromLeftPercents((axisId) => results.get(axisId)?.leftPercent);
}

/** Mesma conta para o vetor de um perfil do catálogo (leftPercent por eixo, a mesma escala do usuário). */
export function compassFromVector(vector: Record<string, number>): CompassPosition | null {
  return compassFromLeftPercents((axisId) => vector[axisId]);
}

function compassFromLeftPercents(left: (axisId: string) => number | undefined): CompassPosition | null {
  const ids = ['economia', 'controle', 'poder', 'representacao', 'estrutura', 'moral'] as const;
  const values: Record<string, number> = {};
  for (const id of ids) {
    const value = left(id);
    if (value === undefined || value === null) return null;
    values[id] = value;
  }
  return {
    economy: 100 - values.economia,
    planning: values.controle,
    right: 100 - (WEIGHT_ECONOMY_IN_RIGHT * values.economia + WEIGHT_MORAL_IN_RIGHT * values.moral) / (WEIGHT_ECONOMY_IN_RIGHT + WEIGHT_MORAL_IN_RIGHT),
    authoritarian:
      (1 - WEIGHT_PLANNING_IN_AUTHORITY) * mean([values.poder, 100 - values.representacao, 100 - values.estrutura]) +
      WEIGHT_PLANNING_IN_AUTHORITY * values.controle,
    traditional: 100 - values.moral
  };
}

export interface CompassPoint {
  key: string;
  label: string;
  color: string;
  position: CompassPosition;
}

/** Um ponto por perfil (na ordem recebida); perfis sem os eixos da bússola ficam de fora. */
export function compassPoints(
  profiles: { key: string; label: string; color: string; vector: Record<string, number> }[]
): CompassPoint[] {
  return profiles.flatMap(({ key, label, color, vector }) => {
    const position = compassFromVector(vector);
    return position ? [{ key, label, color, position }] : [];
  });
}

export type SocialKey = 'veryProgressive' | 'progressive' | 'moderate' | 'traditional' | 'veryTraditional';

/**
 * Nível dos valores sociais a partir do eixo progressista/tradicionalista (0-100), com as mesmas faixas do eixo
 * econômico: abaixo de 27,5 fortemente progressista, até 42,5 progressista, até 57,5 moderado, até 72,5
 * tradicionalista e acima disso fortemente tradicionalista.
 */
export function socialLevel(traditional: number): SocialKey {
  if (traditional < 27.5) return 'veryProgressive';
  if (traditional < 42.5) return 'progressive';
  if (traditional <= 57.5) return 'moderate';
  if (traditional <= 72.5) return 'traditional';
  return 'veryTraditional';
}

const GRID_SIZE = 9;

const toCell = (percent: number): number => Math.max(0, Math.min(GRID_SIZE - 1, Math.floor((percent / 100) * GRID_SIZE)));

/**
 * Região da grade da bússola em que a posição cai, com as mesmas fronteiras do mapa de cores
 * (grade 9x9): linhas de cima = autoritários (Esquerda Radical, Terceira Posição, Extrema Direita),
 * do meio = Esquerda, Centro e Direita, e de baixo = Anarquismo e Libertário. A coluna do meio da
 * faixa de baixo é dividida pelo lado esquerda-direita.
 */
export function compassRegion({ right, authoritarian }: Pick<CompassPosition, 'right' | 'authoritarian'>): IdeologyColorKey {
  const column = toCell(right);
  const row = toCell(100 - authoritarian);
  if (row <= 2) {
    return column <= 2 ? 'esq-radical' : column <= 5 ? 'terceira' : 'ext-direita';
  }
  if (row <= 6) {
    return column <= 2 ? 'esquerda' : column <= 5 ? 'centro' : 'direita';
  }
  if (column <= 3) return 'anarquismo';
  if (column >= 5) return 'libertario';
  return right < 50 ? 'anarquismo' : 'libertario';
}

export type EconomicKey = 'socialism' | 'left' | 'centerLeft' | 'center' | 'centerRight' | 'right' | 'capitalism';

/**
 * Nível econômico a partir da posição no eixo esquerda-direita da economia (0-100, só `economia`), em sete faixas:
 * até 12,5 Socialismo (propriedade pública alta), 12,5-27,5 Esquerda, 27,5-42,5 Centro-esquerda, 42,5-57,5 Centro,
 * 57,5-72,5 Centro-direita, 72,5-87,5 Direita e acima de 87,5 Capitalismo (propriedade privada alta).
 * Independe da categoria da ideologia.
 */
export function economicLevel(right: number): EconomicKey {
  if (right < 12.5) return 'socialism';
  if (right < 27.5) return 'left';
  if (right < 42.5) return 'centerLeft';
  if (right <= 57.5) return 'center';
  if (right <= 72.5) return 'centerRight';
  if (right <= 87.5) return 'right';
  return 'capitalism';
}

export type EconomicMethod = 'planned' | 'market';

/**
 * Método econômico pelo eixo `controle` (0-100, 100 = planejamento): planejada a partir de 66,7, de mercado até 33,3 e,
 * entre os dois, nenhum (o meio-termo não ganha rótulo). Independe do nível de propriedade (`economicLevel`).
 */
export function economicMethod(planning: number): EconomicMethod | null {
  if (planning >= 66.7) return 'planned';
  if (planning <= 33.3) return 'market';
  return null;
}

/**
 * O nível de propriedade e, quando há um, o método, separados por vírgula: "Esquerda, economia planejada". Nos níveis de nome
 * longo (Centro-esquerda e Centro-direita) a vírgula é seguida de quebra de linha, para o nome não ficar espremido.
 */
export function economicName(
  t: { compassEconomicLabels: Record<EconomicKey, string>; compassEconomicMethodLabels: Record<EconomicMethod, string> },
  level: EconomicKey,
  method: EconomicMethod | null
): string {
  if (!method) return t.compassEconomicLabels[level];
  const separator = level === 'centerLeft' || level === 'centerRight' ? ',\n' : ', ';
  return `${t.compassEconomicLabels[level]}${separator}${t.compassEconomicMethodLabels[method]}`;
}
