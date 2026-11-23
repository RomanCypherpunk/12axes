import { describe, expect, it } from 'vitest';
import { isFeedbackOpen } from '../src/utils/feedbackWindow';

describe('janela de sugestões', () => {
  // Datas ao meio-dia de Brasília (UTC-3), para o dia da semana não depender do fuso da máquina.
  const at = (day: number) => new Date(`2026-11-${String(day).padStart(2, '0')}T15:00:00Z`);

  it('abre de segunda a quinta', () => {
    expect(isFeedbackOpen(at(23))).toBe(true); // segunda
    expect(isFeedbackOpen(at(24))).toBe(true); // terça
    expect(isFeedbackOpen(at(25))).toBe(true); // quarta
    expect(isFeedbackOpen(at(26))).toBe(true); // quinta
  });

  it('fecha de sexta a domingo', () => {
    expect(isFeedbackOpen(at(27))).toBe(false); // sexta
    expect(isFeedbackOpen(at(28))).toBe(false); // sábado
    expect(isFeedbackOpen(at(29))).toBe(false); // domingo
  });

  it('usa o horário de Brasília na virada do dia', () => {
    expect(isFeedbackOpen(new Date('2026-11-27T02:59:00Z'))).toBe(true); // quinta 23:59 em Brasília
    expect(isFeedbackOpen(new Date('2026-11-27T03:00:00Z'))).toBe(false); // sexta 00:00 em Brasília
    expect(isFeedbackOpen(new Date('2026-11-30T02:59:00Z'))).toBe(false); // domingo 23:59 em Brasília
    expect(isFeedbackOpen(new Date('2026-11-30T03:00:00Z'))).toBe(true); // segunda 00:00 em Brasília
  });
});
