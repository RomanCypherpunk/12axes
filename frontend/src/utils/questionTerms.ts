import type { QuestionTerm } from '../types/quiz';

interface TextSegment {
  text: string;
  /** Índice do termo em `terms` quando o trecho é um termo do glossário. */
  termIndex?: number;
}

/**
 * Corta o texto da pergunta nos trechos do glossário, sem diferenciar maiúsculas.
 * Só a primeira ocorrência de cada termo é marcada; trechos sobrepostos ficam com o
 * que começa antes. Termo que não aparece no texto é ignorado.
 *
 * @returns segmentos na ordem de leitura; concatenados, reproduzem `text` exatamente
 */
export function splitByTerms(text: string, terms: readonly QuestionTerm[]): TextSegment[] {
  const lower = text.toLowerCase();
  const hits = terms
    .map((term, termIndex) => {
      const needle = term.match.toLowerCase();
      const start = needle ? lower.indexOf(needle) : -1;
      return { termIndex, start, end: start + needle.length };
    })
    .filter((hit) => hit.start >= 0)
    .sort((a, b) => a.start - b.start || b.end - a.end);

  const segments: TextSegment[] = [];
  let cursor = 0;
  for (const hit of hits) {
    if (hit.start < cursor) continue;
    if (hit.start > cursor) segments.push({ text: text.slice(cursor, hit.start) });
    segments.push({ text: text.slice(hit.start, hit.end), termIndex: hit.termIndex });
    cursor = hit.end;
  }
  if (cursor < text.length) segments.push({ text: text.slice(cursor) });
  return segments;
}
