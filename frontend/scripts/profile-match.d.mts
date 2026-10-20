export const AXIS_IDS: string[];
/** Mesma pontuação (0–100) que o quiz usa para o "mais compatível". */
export function compatibility(
  user: Record<string, number> | undefined,
  target: Record<string, number> | undefined,
  axisIds?: string[]
): number;
