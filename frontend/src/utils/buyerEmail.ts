/** E-mail do comprador (checkout em reais): validação leve e lembrança neste navegador, para não digitar de novo. */

const KEY = '12axes:buyer-email';

// Mesma ideia do backend (PaymentController): algo@dominio.tld, sem espaços; o servidor é quem recusa de verdade.
const EMAIL = /^[^@\s]{1,64}@[^@\s]{1,255}\.[^@\s.]{2,}$/;

export function isValidEmail(value: string): boolean {
  const email = value.trim();
  return email.length <= 254 && EMAIL.test(email);
}

export function loadBuyerEmail(): string {
  try {
    return localStorage.getItem(KEY) ?? '';
  } catch {
    return '';
  }
}

export function saveBuyerEmail(email: string): void {
  try {
    localStorage.setItem(KEY, email.trim());
  } catch {
    // sem armazenamento: só não lembra
  }
}
