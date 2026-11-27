// Cópia fiel de backend/.../service/ReligionFilter.java (allows e normalize).

export const CHRISTIAN = ['catholic', 'protestant', 'orthodox'];
export const LEGACY_CHRISTIANITY = 'christianity';
export const SELECTABLE = ['catholic', 'protestant', 'orthodox', 'judaism', 'islam', 'buddhism', 'hinduism'];
export const OTHER = 'other';
export const ONLY = 'only';

export function normalizeReligion(raw: string | null | undefined): string | null {
  if (raw == null) return null;
  const order = [...SELECTABLE, OTHER, LEGACY_CHRISTIANITY];
  const kept: string[] = [];
  for (const part of raw.split(',')) {
    const value = part.trim().toLowerCase();
    if (order.includes(value) && !kept.includes(value)) kept.push(value);
  }
  if (kept.length === 0) return null;
  kept.sort((a, b) => order.indexOf(a) - order.indexOf(b));
  return kept.join(',');
}

function preferredReligions(preference: string | null): string[] {
  if (preference == null) return [];
  const result: string[] = [];
  for (const part of preference.split(',')) {
    const value = part.trim();
    if (value === LEGACY_CHRISTIANITY) {
      CHRISTIAN.filter((denomination) => !result.includes(denomination)).forEach((denomination) => result.push(denomination));
    } else if (value && !result.includes(value)) {
      result.push(value);
    }
  }
  return result;
}

/** O filtro exclui, não exige: perfil sem religião passa sempre. */
export function religionAllows(religions: string[] | null | undefined, preference: string | null): boolean {
  if (!religions || religions.length === 0) return true;
  const hasSelectable = religions.some((religion) => SELECTABLE.includes(religion));
  const preferred = preferredReligions(preference);
  if (preferred.includes(OTHER)) {
    if (!hasSelectable || religions.includes(OTHER)) return true;
    if (preferred.every((value) => value === OTHER)) return false;
  }
  const matches = religions.some((religion) => preferred.includes(religion));
  if (religions.includes(ONLY)) return hasSelectable ? matches : preference == null;
  if (preference == null) return true;
  return matches || !hasSelectable;
}

/**
 * Religião com que a wiki calcula o resultado de um perfil (a mesma do gabarito WikiParityFixtureTest.religionOf): as
 * religiões selecionáveis dele; sem nenhuma, "other" se ele tiver só "other"; senão nenhuma.
 */
export function profileReligion(religions: string[] | null | undefined): string | null {
  const list = religions ?? [];
  const selectable = list.filter((religion) => SELECTABLE.includes(religion));
  if (selectable.length > 0) return selectable.join(',');
  return list.includes(OTHER) ? OTHER : null;
}
