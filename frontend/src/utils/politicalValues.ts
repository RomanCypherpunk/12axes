const CONNECTORS = new Set(['de', 'da', 'do', 'das', 'dos', 'e', 'of', 'and', 'the']);

/** Até 2 iniciais maiúsculas do nome do valor, usadas na moeda quando ela não tem ícone próprio. */
export function valueCoinMonogram(name: string): string {
  const words = name
    .split(/[\s-]+/)
    .filter((word) => word.length > 0 && !CONNECTORS.has(word.toLowerCase()));
  return words
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');
}
