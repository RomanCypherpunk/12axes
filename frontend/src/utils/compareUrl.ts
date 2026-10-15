import type { Lang } from '../i18n';
import type { CompareType } from '../types/quiz';
import { parseReligion, type Religion } from './religion';

// Comparação entre perfis do catálogo: /compare?items=personality:alvaro-uribe,country:colombia
// (mesmo formato "tipo:id" que GET /api/compare/profiles recebe). A página aceita de 2 a 3.
// Como no catálogo, o idioma está no caminho: /compare em português e /en/compare em inglês.
export const MIN_COMPARE = 2;
export const MAX_COMPARE = 3;

const TYPES: readonly CompareType[] = ['personality', 'country', 'ideology', 'party'];

export interface CompareRef {
  type: CompareType;
  id: string;
}

export function refKey(ref: CompareRef): string {
  return `${ref.type}:${ref.id}`;
}

/**
 * Lê o parâmetro items do link. Tokens sem tipo conhecido ou sem id são ignorados, repetidos
 * contam uma vez e o que passar de MAX_COMPARE fica de fora, para um link editado à mão
 * ainda abrir o que dá. Ids desconhecidos passam: quem responde por eles é o backend (404).
 */
export function parseCompareItems(raw: string | null | undefined): CompareRef[] {
  const refs: CompareRef[] = [];
  const seen = new Set<string>();
  for (const token of (raw ?? '').split(',')) {
    const colon = token.indexOf(':');
    if (colon < 0) continue;
    const type = token.slice(0, colon).trim() as CompareType;
    const id = token.slice(colon + 1).trim();
    if (!TYPES.includes(type) || !id) continue;
    const ref = { type, id };
    if (seen.has(refKey(ref))) continue;
    seen.add(refKey(ref));
    refs.push(ref);
    if (refs.length === MAX_COMPARE) break;
  }
  return refs;
}

export function serializeCompareItems(refs: CompareRef[]): string {
  return refs.map((ref) => `${ref.type}:${encodeURIComponent(ref.id)}`).join(',');
}

export function comparePath(lang: Lang): string {
  return lang === 'en' ? '/en/compare' : '/compare';
}

/** Link da comparação; a religião só entra quando há uma (ela filtra o seletor, não os perfis do link). */
export function compareUrl(refs: CompareRef[], religion: Religion | null = null, lang: Lang = 'pt'): string {
  const params: string[] = [];
  if (refs.length > 0) params.push(`items=${serializeCompareItems(refs)}`);
  if (religion) params.push(`religion=${religion}`);
  const path = comparePath(lang);
  return params.length > 0 ? `${path}?${params.join('&')}` : path;
}

export function parseCompareUrl(search: string): { refs: CompareRef[]; religion: Religion | null } {
  const params = new URLSearchParams(search);
  return { refs: parseCompareItems(params.get('items')), religion: parseReligion(params.get('religion')) };
}
