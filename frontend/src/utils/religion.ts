// Mesmos ids de ReligionFilter.SELECTABLE no backend. O cristianismo é dividido em três
// denominações: o usuário escolhe "cristianismo" e, em seguida, a sua vertente.
export const CHRISTIAN_DENOMINATIONS = ['catholic', 'protestant', 'orthodox'] as const;
export type ChristianDenomination = (typeof CHRISTIAN_DENOMINATIONS)[number];

// "other" (outra religião) é uma preferência do usuário, não uma religião de perfil: o backend
// oculta quem é ligado a uma religião específica e mantém só os com "other" e os seculares.
export const OTHER_RELIGION = 'other';

export const RELIGIONS = [...CHRISTIAN_DENOMINATIONS, 'judaism', 'islam', 'buddhism', 'hinduism', OTHER_RELIGION] as const;
export type Religion = (typeof RELIGIONS)[number];

// Alternativas da primeira pergunta de religião (antes da escolha da denominação cristã), na
// ordem em que aparecem; "Outra religião" e "Sem religião" vêm depois (ver religionQuestion em App.tsx).
export const RELIGION_CHOICES = ['christianity', 'judaism', 'islam', 'buddhism', 'hinduism'] as const;
export type ReligionChoice = (typeof RELIGION_CHOICES)[number];

// Link antigo com religion=christianity (antes das denominações) vira "sem filtro".
export function parseReligion(raw: string | null | undefined): Religion | null {
  const value = raw?.trim().toLowerCase();
  return (RELIGIONS as readonly string[]).includes(value ?? '') ? (value as Religion) : null;
}
