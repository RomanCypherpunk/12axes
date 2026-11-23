/** Fuso da janela de sugestões: o horário de Brasília, onde está quem lê e responde as issues. */
export const FEEDBACK_TIME_ZONE = 'America/Sao_Paulo';

/** Dias em que "Sugerir melhoria" e "Contribuir" ficam disponíveis: segunda, terça, quarta e quinta. */
const OPEN_DAYS = new Set(['Mon', 'Tue', 'Wed', 'Thu']);

function weekdayInBrasilia(now: Date): string {
  try {
    return new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone: FEEDBACK_TIME_ZONE }).format(now);
  } catch {
    // Navegador sem suporte a fuso: usa o dia local, que é a melhor aproximação.
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][now.getDay()];
  }
}

/** Se os botões de sugestão estão disponíveis agora (segunda a quinta, horário de Brasília). */
export function isFeedbackOpen(now: Date = new Date()): boolean {
  return OPEN_DAYS.has(weekdayInBrasilia(now));
}
