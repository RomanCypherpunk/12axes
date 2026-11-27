// Ponte para o motor de resultados da wiki (src/wiki/engine), a cópia fiel do backend conferida contra o gabarito que o
// próprio backend grava (WikiParityFixtureTest + parity.test.ts). As páginas estáticas usam estas funções para mostrar
// as mesmas porcentagens que o quiz mostraria para um usuário com o vetor do perfil. Não reimplemente cálculo aqui.
import { AXIS_IDS, compatibility as score, javaCompare } from '../src/wiki/engine/score.ts';
import { OTHER, SELECTABLE, profileReligion, religionAllows as allows } from '../src/wiki/engine/religion.ts';
import { axisDimensions, personalityDimensions } from '../src/wiki/engine/matchers.ts';

export { AXIS_IDS };
export const SELECTABLE_RELIGIONS = SELECTABLE;
export const OTHER_RELIGION = OTHER;

export function compatibility(user, target, axisIds = AXIS_IDS) {
  return score(user, target, axisIds);
}

// Ranking por compatibilidade, com desempate pelo nome como no backend (String.compareTo).
export function rank(user, items, vectorOf, axisIds = AXIS_IDS) {
  return items
    .map((item) => ({ item, score: score(user, vectorOf(item), axisIds) }))
    .sort((a, b) => b.score - a.score || javaCompare(a.item.name, b.item.name));
}

// Destaques por dimensão como no backend: personalidades (itens com `role`) pela área de atuação, nos 12 eixos
// (DimensionMatcherService); países e partidos pelo grupo de eixos de cada dimensão (Country/PartyDimensionMatcherService).
// A lista já chega filtrada pela religião.
export function dimensionMatches(user, items, vectorOf, excludeIds = []) {
  const vectors = new Map(items.map((item) => [item.id, vectorOf(item)]));
  const people = items.length > 0 && 'role' in items[0];
  const found = people
    ? personalityDimensions(user, items, vectors, null, excludeIds[0] ?? null).filter((d) => !excludeIds.includes(d.ranked.item.id))
    : axisDimensions(user, items, vectors, null, excludeIds);
  return found.map(({ dimension, ranked }) => ({ dimension, item: ranked.item, score: ranked.compatibility }));
}

export function religionAllows(religions, preference) {
  return allows(religions, preference);
}

// Na página de um perfil, a religião dele faz o papel da escolha do usuário (a mesma regra do gabarito do backend).
export function religionVisibility(subject) {
  const preference = profileReligion(subject?.religions);
  return (item) => allows(item.religions, preference);
}
