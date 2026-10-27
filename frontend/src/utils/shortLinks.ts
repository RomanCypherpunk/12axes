import { parseReligion, type Religion } from './religion';

/** Origem pública do site: o QR do cartão aponta para ela, não para o endereço de onde a pessoa gerou a imagem. */
export const PUBLIC_ORIGIN = 'https://12axes.vercel.app';

/** Caminho do link curto de resultado: /r?v=70-80-20-… (os 12 eixos, % do polo esquerdo, separados por traço). */
export const SHORT_RESULT_PATH = '/r';

const AXIS_COUNT = 12;

/** Religião em uma letra no link curto (o QR code fica menor). Ortodoxo é "o" e "outra religião" é "x". */
const RELIGION_CODES: Record<Religion, string> = {
  catholic: 'c',
  protestant: 'p',
  orthodox: 'o',
  judaism: 'j',
  islam: 'i',
  buddhism: 'b',
  hinduism: 'h',
  other: 'x'
};

/** Aceita o código de uma letra ("c") e o nome inteiro ("catholic"), dos links já espalhados. */
function parseReligionCode(raw: string | null): Religion | null {
  const value = (raw ?? '').trim().toLowerCase();
  const byCode = (Object.keys(RELIGION_CODES) as Religion[]).find((religion) => RELIGION_CODES[religion] === value);
  return byCode ?? parseReligion(value);
}

/** "88.8" ou "70" (sem o ".0"): o menor texto que volta ao mesmo número com uma casa decimal. */
function compact(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

export function shortResultQuery(values: number[], religion: Religion | null, lang: 'pt' | 'en'): string {
  const parts = [`v=${values.map(compact).join('-')}`];
  if (religion) parts.push(`r=${RELIGION_CODES[religion]}`);
  if (lang === 'en') parts.push('l=en');
  return parts.join('&');
}

/** Link curto de um resultado, para o QR code do cartão de compartilhamento. */
export function shortResultUrl(values: number[], religion: Religion | null, lang: 'pt' | 'en', origin = PUBLIC_ORIGIN): string {
  return `${origin}${SHORT_RESULT_PATH}?${shortResultQuery(values, religion, lang)}`;
}

/** Lê /r?v=…&r=…: null quando não traz os 12 valores válidos (0 a 100). */
export function parseShortResult(search: string): { values: number[]; religion: Religion | null } | null {
  const params = new URLSearchParams(search);
  const raw = params.get('v');
  if (!raw) return null;
  const values = raw.split(/[-,]/).map((part) => Number(part));
  if (values.length !== AXIS_COUNT || values.some((value) => !Number.isFinite(value) || value < 0 || value > 100)) return null;
  return { values, religion: parseReligionCode(params.get('r') ?? params.get('religion')) };
}

/**
 * Link da comparação entre duas pessoas para o QR code: igual ao /compare/people de sempre, mas com as vírgulas
 * dos vetores sem codificar (cada "%2C" a menos deixa o QR menor) e os valores arredondados para inteiros.
 */
export function compactCompareUrl(
  names: [string, string],
  values: [number[], number[]],
  religions: [string | null, string | null],
  lang: 'pt' | 'en',
  origin = PUBLIC_ORIGIN
): string {
  // Inteiros: meio ponto a menos de precisão no QR, em troca de um link bem mais curto (e um QR mais fácil de ler).
  const list = (items: number[]): string => items.map((value) => String(Math.round(value))).join(',');
  const parts = [
    `an=${encodeURIComponent(names[0])}`,
    `a=${list(values[0])}`,
    ...(religions[0] ? [`ra=${religions[0]}`] : []),
    `bn=${encodeURIComponent(names[1])}`,
    `b=${list(values[1])}`,
    ...(religions[1] ? [`rb=${religions[1]}`] : []),
    ...(lang === 'en' ? ['lang=en'] : [])
  ];
  return `${origin}/compare/people?${parts.join('&')}`;
}
