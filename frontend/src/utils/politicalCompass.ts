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

// Eixo esquerda-direita: 60% `economia` (propriedade dos meios de produção, privada à direita), 30% `moral` (tradicional à
// direita) e 10% `religiao` (religioso à direita). Só a economia colocava a economia dirigida com moral conservadora
// (Terceira Posição, teocracias, comunismos nacionais) na esquerda radical; com moral e religião (o conservadorismo
// cultural, 40%) ela cai no meio, e a extrema direita religiosa vai para a direita. Planejamento (`controle`) e imigração
// não melhoraram o encaixe (o planejamento também é alto na extrema direita; libertários são abertos à imigração) e ficam
// de fora. Simulação nas 291 ideologias do catálogo, já com o eixo vertical abaixo (todas as combinações de economia,
// controle, religião, imigração e moral, conferida por validação cruzada): acerto da própria região 65,6% -> 68,0%,
// média por espectro 70,1% -> 73,1% (Extrema Direita 27% -> 42%).
const RIGHT_WEIGHTS: RightWeights = { economia: 60, moral: 30, religiao: 10 };

// Pesos do eixo esquerda-direita por canto da bússola. O que separa os espectros muda com o canto: embaixo, anarquista e
// libertário se distinguem pela economia (e, à direita, pelo livre mercado e pelo globalismo), não pela moral nem pela
// religião; em cima à direita, a religião, a moral e a imigração pesam mais. A posição de partida vem da fórmula acima
// (`RIGHT_WEIGHTS`), e os pesos usados são a mistura dos quatro cantos proporcional à proximidade de cada um (bilinear,
// sem cortes). O canto esquerdo autoritário fica com a fórmula de partida. Simulação nas 291 ideologias: acerto da própria
// região igual (68,0%), média por espectro 73,1% -> 73,4%, Libertário 83% -> 87%, e a direita libertária vai para o
// extremo (anarcocapitalismo 73 -> 91, Rothbard 73 -> 90), sem mexer na esquerda.
const CORNER_RIGHT_WEIGHTS: Record<'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight', RightWeights> = {
  topLeft: RIGHT_WEIGHTS,
  topRight: { economia: 40, moral: 25, religiao: 20, imigracao: 15 },
  bottomLeft: { economia: 80, moral: 20 },
  bottomRight: { economia: 70, controle: 15, comercio: 15 }
};

type RightAxis = 'economia' | 'moral' | 'religiao' | 'imigracao' | 'controle' | 'comercio';
type RightWeights = Partial<Record<RightAxis, number>>;

/** Valor de cada eixo no sentido da direita: privado, tradicional, religioso, assimilação, livre mercado e globalismo. */
function rightValue(axis: RightAxis, values: Record<string, number>): number {
  switch (axis) {
    case 'imigracao':
      return values.imigracao; // esq. Assimilação: o polo esquerdo do eixo é o lado direito da bússola
    default:
      return 100 - values[axis]; // esq. Público, Progressista, Irreligioso, Planejamento e Protecionismo
  }
}

function weightedRight(weights: RightWeights, values: Record<string, number>): number {
  let sum = 0;
  let total = 0;
  for (const [axis, weight] of Object.entries(weights) as [RightAxis, number][]) {
    sum += weight * rightValue(axis, values);
    total += weight;
  }
  return sum / total;
}

/** Posição esquerda-direita com os pesos de cada canto misturados pela posição de partida e pela altura. */
function rightPosition(values: Record<string, number>, authoritarian: number): number {
  const up = authoritarian / 100;
  const toRight = weightedRight(RIGHT_WEIGHTS, values) / 100;
  const corners: [RightWeights, number][] = [
    [CORNER_RIGHT_WEIGHTS.topLeft, up * (1 - toRight)],
    [CORNER_RIGHT_WEIGHTS.topRight, up * toRight],
    [CORNER_RIGHT_WEIGHTS.bottomLeft, (1 - up) * (1 - toRight)],
    [CORNER_RIGHT_WEIGHTS.bottomRight, (1 - up) * toRight]
  ];
  const mixed: RightWeights = {};
  for (const [weights, share] of corners) {
    const total = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
    for (const [axis, weight] of Object.entries(weights) as [RightAxis, number][]) {
      mixed[axis] = (mixed[axis] ?? 0) + (share * weight) / total;
    }
  }
  return weightedRight(mixed, values);
}

// Eixo autoritário-libertário: `poder` (segurança e vigilância contra liberdade civil) domina, com 70%; `representacao`
// (autocracia) e `estrutura` (unitarismo) entram com 12,5% cada e `controle` (planejamento) com 5%. O poder é o eixo que
// mais separa os espectros: sozinho acerta a faixa vertical de 82% das ideologias, contra 63-66% de cada um dos outros.
// Simulação nas 291 ideologias do catálogo (busca em todos os 12 eixos, conferida por validação cruzada): acerto da
// própria região 61,9% -> 65,3% e média por espectro 65,1% -> 69,8%, sem nenhum espectro piorar. Comércio, imigração,
// diplomacia, religião e moral não melhoraram o encaixe e ficam de fora.
const AUTHORITY_WEIGHTS = { poder: 0.7, representacao: 0.125, estrutura: 0.125, controle: 0.05 } as const;

/**
 * Compõe a bússola a partir dos eixos do quiz. `leftPercent` é o quanto o usuário pende ao polo
 * esquerdo do eixo em `axes.json` (100 = polo esquerdo inteiro), então cada eixo é invertido
 * quando o polo esquerdo não é o que a bússola chama de direita, autoritário ou tradicionalista:
 *
 * - direita: parte de 60% `economia` (esq. Público), 30% `moral` (esq. Progressista) e 10% `religiao` (esq. Irreligioso),
 *   os três invertidos, e mistura os pesos de cada canto (`CORNER_RIGHT_WEIGHTS`), que trazem também `imigracao`
 *   (esq. Assimilação, direto), `controle` e `comercio` (esq. Planejamento e Protecionismo, invertidos);
 * - autoritário: 70% `poder` (esq. Segurança, direto), 12,5% `representacao` (esq. Democracia) e 12,5% `estrutura`
 *   (esq. Federal), estes dois invertidos, e 5% `controle` (esq. Planejamento, direto);
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
  const ids = ['economia', 'controle', 'comercio', 'poder', 'representacao', 'estrutura', 'imigracao', 'moral', 'religiao'] as const;
  const values: Record<string, number> = {};
  for (const id of ids) {
    const value = left(id);
    if (value === undefined || value === null) return null;
    values[id] = value;
  }
  const authoritarian =
    AUTHORITY_WEIGHTS.poder * values.poder +
    AUTHORITY_WEIGHTS.representacao * (100 - values.representacao) +
    AUTHORITY_WEIGHTS.estrutura * (100 - values.estrutura) +
    AUTHORITY_WEIGHTS.controle * values.controle;
  return {
    economy: 100 - values.economia,
    planning: values.controle,
    right: rightPosition(values, authoritarian),
    authoritarian,
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
