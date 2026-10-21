import type { AxisResult } from '../types/quiz';
import type { IdeologyColorKey } from './ideologyColors';

/** Posição do usuário na bússola política, cada valor de 0 a 100. */
export interface CompassPosition {
  /** 0 = esquerda, 100 = direita. */
  right: number;
  /** 0 = libertário, 100 = autoritário. */
  authoritarian: number;
  /** 0 = progressista, 100 = tradicionalista. */
  traditional: number;
}

const mean = (values: number[]): number => values.reduce((sum, value) => sum + value, 0) / values.length;

// Pesos do eixo esquerda-direita: estritamente econômicos, focados nos dois pilares da
// economia política clássica: `economia` (propriedade privada dos meios de produção, 60%) e
// `controle` (livre mercado contra planejamento e regulação, 40%). Pautas como comércio
// internacional (livre comércio vs tarifas), imigração e costumes não entram no cálculo
// Pesos do eixo esquerda-direita: estritamente econômicos, focados nos dois pilares da
// economia política clássica: `economia` (propriedade privada dos meios de produção, 60%) e
// `controle` (livre mercado contra planejamento e regulação, 40%). Cálculo direto linear de 0 a 100,
// proporcional aos eixos sem distorção ou afastamento não-linear.
const WEIGHT_ECONOMIA = 0.6;
const WEIGHT_CONTROLE = 0.4;

/**
 * Compõe a bússola a partir dos eixos do quiz. `leftPercent` é o quanto o usuário pende ao polo
 * esquerdo do eixo em `axes.json` (100 = polo esquerdo inteiro), então cada eixo é invertido
 * quando o polo esquerdo não é o que a bússola chama de direita, autoritário ou tradicionalista:
 *
 * - direita: média ponderada linear (60% economia privada, 40% livre mercado):
 *   `economia` (esq. Público) e `controle` (esq. Planejamento) entram invertidos;
 * - autoritário: `poder` (esq. Segurança, direto), `representacao` (esq. Democracia) e `estrutura`
 *   (esq. Federal), estes dois invertidos;
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
    right: WEIGHT_ECONOMIA * (100 - values.economia) + WEIGHT_CONTROLE * (100 - values.controle),
    authoritarian: mean([values.poder, 100 - values.representacao, 100 - values.estrutura]),
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
 * Nível dos valores sociais a partir da barra progressista/tradicionalista (0-100):
 * até 19 fortemente progressistas, 20-39 progressistas, 40-60 moderados, 61-80 tradicionalistas,
 * acima de 80 fortemente tradicionalistas.
 */
export function socialLevel(traditional: number): SocialKey {
  if (traditional < 20) return 'veryProgressive';
  if (traditional < 40) return 'progressive';
  if (traditional <= 60) return 'moderate';
  if (traditional <= 80) return 'traditional';
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
export function compassRegion({ right, authoritarian }: CompassPosition): IdeologyColorKey {
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

/**
 * Quando a ideologia e a região da bússola são Centro e Esquerda (ou Centro e Direita), a posição
 * intermediária se chama centro-esquerda (ou centro-direita) em vez de "entre". Qualquer outro par,
 * ou o mesmo lado nos dois, devolve null.
 */
export function centerSide(first: IdeologyColorKey, second: IdeologyColorKey): 'esquerda' | 'direita' | null {
  if (first === second) return null;
  const keys = [first, second];
  if (!keys.includes('centro')) return null;
  if (keys.includes('esquerda')) return 'esquerda';
  if (keys.includes('direita')) return 'direita';
  return null;
}
