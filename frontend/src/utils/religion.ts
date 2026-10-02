// Mesmos ids de ReligionFilter.SELECTABLE no backend.
export const RELIGIONS = ['christianity', 'judaism', 'islam', 'buddhism', 'hinduism'] as const;
export type Religion = (typeof RELIGIONS)[number];

export function parseReligion(raw: string | null | undefined): Religion | null {
  const value = raw?.trim().toLowerCase();
  return (RELIGIONS as readonly string[]).includes(value ?? '') ? (value as Religion) : null;
}

// Keep E for "none" so saved quiz progress retains its original meaning.
export const RELIGION_OPTION_IDS: Record<Religion | 'none', string> = {
  christianity: 'A', judaism: 'B', islam: 'C', buddhism: 'D', hinduism: 'F', none: 'E'
};

export function religionForOption(option: string | undefined): Religion | null {
  return RELIGIONS.find(religion => RELIGION_OPTION_IDS[religion] === option) ?? null;
}
