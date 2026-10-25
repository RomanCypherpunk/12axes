import type { CompareProfile } from '../../types/quiz';
import { ideologyColorByKey, resolveIdeologyColor } from '../../utils/ideologyColors';
import { compassFromVector, compassRegion } from '../../utils/politicalCompass';

// Cor de reserva por posição, para quando o perfil ainda não tem vetor (a resposta da API não chegou):
// Floresta e Carmim da identidade e o azul do eixo Estrutura.
export const PROFILE_COLORS = ['#102E24', '#880912', '#2F6DC0'];

/**
 * A cor de um perfil na comparação é a do seu espectro político: a categoria da região da bússola em que
 * o vetor dele cai (Esquerda, Centro, Direita…), a mesma que pinta o espectro nos resultados.
 */
export function spectrumColor(vector: Record<string, number> | undefined, fallback: string): string {
  const position = vector ? compassFromVector(vector) : null;
  return position ? ideologyColorByKey(compassRegion(position)).base : fallback;
}

export function colorOf(profile: CompareProfile, index: number): string {
  // Uma pessoa (na comparação entre pessoas, com iniciais) vale a cor da sua ideologia mais próxima, a mesma
  // das iniciais; a da região da bússola só serve para os perfis do catálogo.
  if (profile.item.initials) return resolveIdeologyColor(profile.item.category).base;
  return spectrumColor(profile.vector, PROFILE_COLORS[index]);
}
