import type { CompareItem } from '../types/quiz';

const MAX_OPTIONS = 60;

/** Minúsculo, sem acento e só com letras e números separados por espaço: "Anarcho-Distributism" vira "anarcho distributism". */
function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

interface Keys {
  words: string[];
  /** Todas as palavras coladas: "anarco distributismo", "anarco-distributismo" e "anarcodistributismo" dão o mesmo. */
  compact: string;
}

function keysOf(text: string): Keys {
  const words = normalize(text).split(' ').filter(Boolean);
  return { words, compact: words.join('') };
}

/**
 * Posição do melhor tipo de acerto (menor = melhor), ou -1 quando não acerta:
 * 0 nome exato · 1 nome começa com a busca · 2 cada palavra da busca começa uma palavra do nome · 3 a busca aparece dentro do nome.
 * Espaços, hífens, acentos e maiúsculas não contam, e a busca pode vir em qualquer ordem de palavras (tier 2).
 */
function tierOf(query: Keys, name: Keys): number {
  if (name.compact === query.compact) return 0;
  if (name.compact.startsWith(query.compact)) return 1;
  if (query.words.every((word) => name.words.some((candidate) => candidate.startsWith(word)))) return 2;
  if (name.compact.includes(query.compact)) return 3;
  return -1;
}

/**
 * Busca de perfis na análise comparativa. Cada tipo de acerto vem antes do seguinte (o nome exato primeiro, depois quem
 * começa com o que foi digitado, e assim por diante) e, em cada grupo, os nomes mais curtos vêm primeiro.
 * "anarco" traz todos os anarco…; "distributismo" traz o Distributismo no topo, antes do Distributismo Georgista
 * e do Anarcodistributismo.
 */
export function searchItems(items: CompareItem[], query: string, max: number = MAX_OPTIONS): CompareItem[] {
  const needle = keysOf(query);
  if (!needle.compact) return [];
  const scored: { item: CompareItem; tier: number; length: number; order: number }[] = [];
  items.forEach((item, order) => {
    const name = keysOf(item.name);
    const tier = tierOf(needle, name);
    if (tier >= 0) scored.push({ item, tier, length: name.compact.length, order });
  });
  scored.sort((a, b) => a.tier - b.tier || a.length - b.length || a.order - b.order);
  return scored.slice(0, max).map(({ item }) => item);
}
