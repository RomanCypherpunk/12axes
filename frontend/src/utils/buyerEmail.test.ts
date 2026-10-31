import { describe, expect, it } from 'vitest';
import { isValidEmail } from './buyerEmail';

describe('isValidEmail', () => {
  it('accepts ordinary addresses, ignoring surrounding spaces', () => {
    expect(isValidEmail('ana@exemplo.com.br')).toBe(true);
    expect(isValidEmail('  ana+x@gmail.com ')).toBe(true);
  });

  it('refuses what the server refuses', () => {
    for (const email of ['', 'sem-arroba', 'a@b', 'a b@c.com', 'a@@c.com', '@c.com', 'a@c.']) {
      expect(isValidEmail(email)).toBe(false);
    }
  });
});
