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

// Pesos do eixo esquerda-direita, escolhidos por busca sobre o catálogo para levar cada ideologia
// ao seu canto (anarcocapitalismo na direita, marxismo-leninismo na esquerda, corporativismo,
// fascismo e centrismo no meio). Os três eixos econômicos pesam: `economia` (propriedade),
// `controle` (planejamento contra mercado) e `comercio` (protecionismo contra livre comércio),
// este último para que um protecionista como Trump não fique no mesmo ponto de um anarcocapitalista.
const WEIGHT_ECONOMIA = 0.2;
const WEIGHT_CONTROLE = 0.3;
const WEIGHT_COMERCIO = 0.2;
const WEIGHT_IMIGRACAO = 0.25;
const WEIGHT_MORAL = 0.05;

// Ganhos do alongamento a partir do centro. A média ponderada encolhe os extremos (um
// anarcocapitalista é ~95 em economia, controle e comércio, mas só ~40 em assimilação), então sem
// isso ele ficaria em ~75. O lado direito se dilui mais que o esquerdo.
const GAIN_LEFT = 1.6;
const GAIN_RIGHT = 2.6;

/**
 * Alonga a média para os cantos sem cortar: tangente hiperbólica, que se aproxima de 0 e de 100
 * sem nunca cravá-los. Um corte seco empilharia ~7% dos perfis exatamente na borda.
 */
function stretch(average: number): number {
  const distance = average - 50;
  const gain = distance < 0 ? GAIN_LEFT : GAIN_RIGHT;
  return 50 + 50 * Math.tanh((distance * gain) / 50);
}

/**
 * Compõe a bússola a partir dos eixos do quiz. `leftPercent` é o quanto o usuário pende ao polo
 * esquerdo do eixo em `axes.json` (100 = polo esquerdo inteiro), então cada eixo é invertido
 * quando o polo esquerdo não é o que a bússola chama de direita, autoritário ou tradicionalista:
 *
 * - direita, média ponderada (20% economia, 30% controle, 20% comércio, 25% imigração, 5% moral)
 *   e depois alongada: `economia` (esq. Público), `controle` (esq. Planejamento), `comercio`
 *   (esq. Protecionismo) e `moral` (esq. Progressista) entram invertidos, e `imigracao`
 *   (esq. Assimilação) entra direto;
 * - autoritário: `poder` (esq. Segurança, direto), `representacao` (esq. Democracia) e `estrutura`
 *   (esq. Federal), estes dois invertidos;
 * - tradicionalista (a barra): `moral` (esq. Progressista), invertido.
 *
 * Devolve null se algum desses eixos faltar no resultado (ex.: resultado compartilhado antigo).
 */
export function computeCompass(results: Map<string, AxisResult>): CompassPosition | null {
  const left = (axisId: string): number | null => results.get(axisId)?.leftPercent ?? null;
  const ids = ['economia', 'controle', 'comercio', 'imigracao', 'moral', 'poder', 'representacao', 'estrutura'] as const;
  const values: Record<string, number> = {};
  for (const id of ids) {
    const value = left(id);
    if (value === null) return null;
    values[id] = value;
  }
  return {
    right: stretch(
      WEIGHT_ECONOMIA * (100 - values.economia) +
        WEIGHT_CONTROLE * (100 - values.controle) +
        WEIGHT_COMERCIO * (100 - values.comercio) +
        WEIGHT_IMIGRACAO * values.imigracao +
        WEIGHT_MORAL * (100 - values.moral)
    ),
    authoritarian: mean([values.poder, 100 - values.representacao, 100 - values.estrutura]),
    traditional: 100 - values.moral
  };
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
