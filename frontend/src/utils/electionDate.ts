/** "2026-11-29" no idioma da página (ex.: "29 de noviembre de 2026"). Lê a data em UTC para não mudar o dia por causa do fuso. */
export function formatElectionDate(iso: string, lang: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return iso;
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat(lang, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(date);
}

/** A eleição já passou: só a partir do dia seguinte ao da votação (data local do usuário). Data inválida = não passou. */
export function isElectionOver(iso: string, now: Date = new Date()): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
  const pad = (n: number) => String(n).padStart(2, '0');
  const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  return today > iso;
}
