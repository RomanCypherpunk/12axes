import type { GovernmentSeat, PersonalityMatch, PremiumReport } from '../types/quiz';

/** Quantas figuras o usuário vê para trocar quem ocupa um cargo. */
export const SWAP_OPTIONS = 3;

/** Cargo (seatKey) -> id da personalidade escolhida no lugar da sugerida. */
export type GovernmentSwaps = Record<string, string>;

/** Quem o usuário achou na busca (fora das sugestões do cargo): id -> dados, para montar o governo sem nova consulta. */
export type GovernmentPicks = Record<string, PersonalityMatch>;

/**
 * As figuras da categoria do cargo, da mais para a menos compatível, para trocar quem o ocupa: sem a atual e sem quem já
 * ocupa outra cadeira (o vice sai da mesma categoria do líder e não pode repetir).
 */
export function swapOptions(seats: readonly GovernmentSeat[], seatKey: string): PersonalityMatch[] {
  const seat = seats.find((item) => item.seatKey === seatKey);
  if (!seat) return [];
  const taken = new Set(seats.filter((item) => item.seatKey !== seatKey).map((item) => item.holder.personalityId));
  return seat.candidates
    .filter((candidate) => candidate.personalityId !== seat.holder.personalityId && !taken.has(candidate.personalityId))
    .slice(0, SWAP_OPTIONS);
}

/**
 * Aplica as trocas do usuário ao governo ideal do relatório. Cada cargo fica com a escolha do usuário (quando ela é uma
 * das opções dele) ou com o titular sugerido. Se a mesma pessoa cairia em duas cadeiras, a troca é desfeita e o cargo
 * volta ao sugerido. O resultado não depende da ordem dos cargos: dois cargos podem trocar de pessoas entre si.
 */
export function applyGovernmentSwaps(report: PremiumReport, swaps: GovernmentSwaps, picks: GovernmentPicks = {}): PremiumReport {
  if (Object.keys(swaps).length === 0) return report;
  const seats = report.idealGovernment;
  const wanted = new Map<string, PersonalityMatch>();
  const swapped = new Set<string>();
  for (const seat of seats) {
    const choice = swaps[seat.seatKey];
    // Quem veio da busca pode ser de qualquer categoria: o cargo só fala dos eixos dele.
    const picked = choice ? (seat.candidates.find((candidate) => candidate.personalityId === choice) ?? picks[choice]) : undefined;
    wanted.set(seat.seatKey, picked ?? seat.holder);
    if (picked) swapped.add(seat.seatKey);
  }
  // A mesma pessoa em duas cadeiras: desfaz a troca de uma delas e confere de novo (limitado ao número de trocas).
  for (let round = 0; round <= seats.length; round += 1) {
    const owner = new Map<string, string>();
    let undo: string | null = null;
    for (const seat of seats) {
      const id = (wanted.get(seat.seatKey) as PersonalityMatch).personalityId;
      const previous = owner.get(id);
      if (previous === undefined) {
        owner.set(id, seat.seatKey);
      } else {
        undo = swapped.has(seat.seatKey) ? seat.seatKey : swapped.has(previous) ? previous : null;
        break;
      }
    }
    if (!undo) break;
    wanted.set(undo, seats.find((seat) => seat.seatKey === undo)?.holder as PersonalityMatch);
    swapped.delete(undo);
  }
  const idealGovernment = seats.map((seat) => ({ ...seat, holder: wanted.get(seat.seatKey) as PersonalityMatch }));
  return { ...report, idealGovernment };
}

const STORAGE_KEY = '12axes-government-swaps';
const PICKS_KEY = '12axes-government-picks';
const MAX_SAVED = 20;
const MAX_PICKS = 18;

type Saved = Record<string, GovernmentSwaps>;

function readAll(storageKey: string = STORAGE_KEY): Saved {
  try {
    const raw = window.localStorage.getItem(storageKey);
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? (parsed as Saved) : {};
  } catch {
    return {};
  }
}

/** As pessoas achadas na busca neste resultado; sem armazenamento, nenhuma. */
export function loadGovernmentPicks(resultKey: string): GovernmentPicks {
  const saved = (readAll(PICKS_KEY) as unknown as Record<string, GovernmentPicks>)[resultKey];
  if (!saved || typeof saved !== 'object') return {};
  return Object.fromEntries(Object.entries(saved).filter(([id, match]) => match && typeof match === 'object' && match.personalityId === id));
}

/** Guarda as pessoas achadas na busca (as últimas 18 por resultado e os últimos vinte resultados). */
export function saveGovernmentPicks(resultKey: string, picks: GovernmentPicks): void {
  try {
    const all = readAll(PICKS_KEY) as unknown as Record<string, GovernmentPicks>;
    delete all[resultKey];
    if (Object.keys(picks).length > 0) all[resultKey] = Object.fromEntries(Object.entries(picks).slice(-MAX_PICKS));
    window.localStorage.setItem(PICKS_KEY, JSON.stringify(Object.fromEntries(Object.entries(all).slice(-MAX_SAVED))));
  } catch {
    // Sem armazenamento: a escolha vale só até recarregar.
  }
}

/** As trocas guardadas deste resultado (a chave é o vetor dos 12 eixos); sem armazenamento, nenhuma. */
export function loadGovernmentSwaps(resultKey: string): GovernmentSwaps {
  const saved = readAll()[resultKey];
  if (!saved || typeof saved !== 'object') return {};
  return Object.fromEntries(Object.entries(saved).filter(([, id]) => typeof id === 'string'));
}

/** Guarda as trocas deste resultado (só as últimas vinte, para não crescer sem fim); vazio apaga a entrada. */
export function saveGovernmentSwaps(resultKey: string, swaps: GovernmentSwaps): void {
  try {
    const all = readAll();
    delete all[resultKey];
    if (Object.keys(swaps).length > 0) all[resultKey] = swaps;
    const kept = Object.fromEntries(Object.entries(all).slice(-MAX_SAVED));
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(kept));
  } catch {
    // Sem armazenamento (janela privada, por exemplo): a troca vale só até recarregar.
  }
}
