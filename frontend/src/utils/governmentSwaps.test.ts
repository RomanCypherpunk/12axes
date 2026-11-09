import { describe, expect, it } from 'vitest';
import type { GovernmentSeat, PersonalityMatch, PremiumReport } from '../types/quiz';
import { applyGovernmentSwaps, displacedSwap, SWAP_OPTIONS, swapOptions } from './governmentSwaps';

const person = (id: string, category = 'politico'): PersonalityMatch => ({ personalityId: id, name: id.toUpperCase(), category, compatibility: 90 }) as PersonalityMatch;
const seat = (seatKey: GovernmentSeat['seatKey'], holder: string, candidates: string[], category = 'politico'): GovernmentSeat => ({
  seatKey,
  category,
  holder: person(holder, category),
  candidates: candidates.map((id) => person(id, category))
});

// lider e vice saem da mesma categoria: o lider leva a, o vice leva b.
const seats = [seat('lider', 'a', ['a', 'b', 'c', 'd', 'e', 'f']), seat('vice', 'b', ['a', 'b', 'c', 'd', 'e', 'f']), seat('economia', 'x', ['x', 'y', 'z', 'w'], 'economista')];
const report = { idealGovernment: seats } as unknown as PremiumReport;

describe('swapOptions', () => {
  it('três opções da categoria, sem a atual e sem quem ocupa outra cadeira', () => {
    expect(swapOptions(seats, 'lider').map((p) => p.personalityId)).toEqual(['c', 'd', 'e']);
    expect(swapOptions(seats, 'vice').map((p) => p.personalityId)).toEqual(['c', 'd', 'e']);
    expect(swapOptions(seats, 'lider')).toHaveLength(SWAP_OPTIONS);
  });

  it('categoria com poucas figuras devolve as que existem; cargo desconhecido, nenhuma', () => {
    expect(swapOptions(seats, 'economia').map((p) => p.personalityId)).toEqual(['y', 'z', 'w']);
    expect(swapOptions(seats, 'cultura')).toEqual([]);
  });
});

describe('applyGovernmentSwaps', () => {
  it('troca o titular pelo escolhido e deixa o resto como estava', () => {
    const next = applyGovernmentSwaps(report, { lider: 'c' });
    expect(next.idealGovernment.map((item) => item.holder.personalityId)).toEqual(['c', 'b', 'x']);
    expect(report.idealGovernment[0].holder.personalityId).toBe('a');
  });

  it('sem trocas devolve o mesmo relatório', () => {
    expect(applyGovernmentSwaps(report, {})).toBe(report);
  });

  it('ignora troca por quem não é opção do cargo ou já ocupa outra cadeira', () => {
    expect(applyGovernmentSwaps(report, { lider: 'zzz' }).idealGovernment[0].holder.personalityId).toBe('a');
    // o vice já é b: o líder não pode virar b
    expect(applyGovernmentSwaps(report, { lider: 'b' }).idealGovernment[0].holder.personalityId).toBe('a');
  });

  it('duas trocas que se chocam: a segunda é ignorada', () => {
    const next = applyGovernmentSwaps(report, { lider: 'c', vice: 'c' });
    expect(next.idealGovernment.map((item) => item.holder.personalityId)).toEqual(['c', 'b', 'x']);
  });

  it('dois cargos podem trocar de pessoa entre si, em qualquer ordem', () => {
    // o vice sai de b para c e o líder entra em b: b só fica livre porque o vice saiu
    const next = applyGovernmentSwaps(report, { lider: 'b', vice: 'c' });
    expect(next.idealGovernment.map((item) => item.holder.personalityId)).toEqual(['b', 'c', 'x']);
    const swappedAround = applyGovernmentSwaps(report, { lider: 'b', vice: 'a' });
    expect(swappedAround.idealGovernment.map((item) => item.holder.personalityId)).toEqual(['b', 'a', 'x']);
  });

  it('aceita quem veio da busca, de qualquer categoria', () => {
    const picks = { q: person('q'), p: person('p', 'economista') };
    expect(applyGovernmentSwaps(report, { lider: 'q' }, picks).idealGovernment.map((item) => item.holder.personalityId)).toEqual(['q', 'b', 'x']);
    expect(applyGovernmentSwaps(report, { lider: 'p' }, picks).idealGovernment[0].holder.personalityId).toBe('p');
    expect(applyGovernmentSwaps(report, { economia: 'q' }, picks).idealGovernment[2].holder.personalityId).toBe('q');
  });

  it('quem veio da busca e já ocupa outra cadeira não duplica', () => {
    const picks = { q: person('q') };
    const next = applyGovernmentSwaps(report, { lider: 'q', vice: 'q' }, picks);
    expect(next.idealGovernment.map((item) => item.holder.personalityId)).toEqual(['q', 'b', 'x']);
  });

  it('quem sai de uma cadeira pode entrar em outra', () => {
    const next = applyGovernmentSwaps(report, { lider: 'c', vice: 'a' });
    expect(next.idealGovernment.map((item) => item.holder.personalityId)).toEqual(['c', 'a', 'x']);
  });
});

describe('displacedSwap', () => {
  it('a cadeira que a pessoa deixa passa à próxima mais compatível da categoria, fora de quem já ocupa cadeira', () => {
    // x (economia) vai para o líder: o economista seguinte livre é y
    expect(displacedSwap(seats, 'lider', 'x')).toEqual({ economia: 'y' });
  });

  it('líder e vice trocam de lugar: o vice passa a ser o antigo líder', () => {
    expect(displacedSwap(seats, 'lider', 'b')).toEqual({ vice: 'a' });
  });

  it('pessoa que não ocupa outra cadeira, ou ninguém sobrando, não gera troca', () => {
    expect(displacedSwap(seats, 'lider', 'zzz')).toBeUndefined();
    const cramped = [seat('lider', 'a', ['a']), seat('economia', 'x', ['x'], 'economista')];
    expect(displacedSwap(cramped, 'lider', 'x')).toBeUndefined();
  });

  it('as duas trocas juntas montam o governo certo', () => {
    const picks = { x: seats[2].holder };
    const next = applyGovernmentSwaps(report, { lider: 'x', economia: 'y' }, picks);
    expect(next.idealGovernment.map((item) => item.holder.personalityId)).toEqual(['x', 'b', 'y']);
  });
});

