// Cópia fiel de backend/.../service/PoliticalValuesService.java (escolha do valor e textos por idioma).

import { religionAllows } from './religion.ts';
import type { Vector } from './score.ts';

export interface ValueDef {
  id: string;
  name: string;
  description: string;
  neutral?: boolean;
  profile: Record<string, number>;
  religions?: string[];
}

export interface ValueCategory {
  id: string;
  label: string;
  axes?: string[];
  values: ValueDef[];
}

/** Texto de um id (categoria: label; valor: name e description) no idioma da página. */
export type ValueText = Map<string, { label?: string; name?: string; description?: string }>;

export interface ResolvedValue {
  categoryId: string;
  categoryLabel: string;
  valueId: string;
  name: string;
  description: string;
  neutral: boolean;
}

const CENTER = 50;
const NEUTRAL_BAND = 7.5;
const EXTRA_AXIS_WEIGHT = 1 / 3;

function choose(category: ValueCategory, user: Vector, religion: string | null): ValueDef {
  const free = !category.axes || category.axes.length === 0;
  const nearCenter = !free && category.axes!.every((axis) => Math.abs((user[axis] ?? CENTER) - CENTER) <= NEUTRAL_BAND);
  if (nearCenter) {
    const neutral = category.values.find((value) => value.neutral);
    if (!neutral) throw new Error(`valores políticos: categoria ${category.id} sem valor neutro`);
    return neutral;
  }
  let best: ValueDef | null = null;
  let bestDistance = Number.MAX_VALUE;
  for (const value of category.values) {
    if (!religionAllows(value.religions, religion)) continue;
    let distance = 0;
    let total = 0;
    for (const [axis, target] of Object.entries(value.profile)) {
      const weight = free || category.axes!.includes(axis) ? 1 : EXTRA_AXIS_WEIGHT;
      const delta = (user[axis] ?? CENTER) - target;
      distance += weight * delta * delta;
      total += weight;
    }
    distance /= total;
    if (distance < bestDistance) {
      bestDistance = distance;
      best = value;
    }
  }
  if (!best) throw new Error(`valores políticos: nenhum valor permitido em ${category.id}`);
  return best;
}

/**
 * Um valor por categoria. `primary` é o texto do idioma (null em pt, que usa o próprio JSON); campo vazio usa `english`,
 * como o backend.
 */
export function resolveValues(
  categories: ValueCategory[],
  user: Vector,
  religion: string | null,
  primary: ValueText | null,
  english: ValueText
): ResolvedValue[] {
  const text = (id: string, field: 'label' | 'name' | 'description'): string => {
    const value = primary?.get(id)?.[field];
    return value && value.trim() ? value : (english.get(id)?.[field] ?? '');
  };
  return categories.map((category) => {
    const chosen = choose(category, user, religion);
    return {
      categoryId: category.id,
      categoryLabel: primary ? text(category.id, 'label') : category.label,
      valueId: chosen.id,
      name: primary ? text(chosen.id, 'name') : chosen.name,
      description: primary ? text(chosen.id, 'description') : chosen.description,
      neutral: Boolean(chosen.neutral)
    };
  });
}
