// Índice da forma plural: duas formas (singular, plural) ou três (russo: 1, 2–4, 5+).
export const pluralIndex = (n, length) =>
  length > 2 ? (n % 10 === 1 && n % 100 !== 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? 1 : 2) : n === 1 ? 0 : 1;
