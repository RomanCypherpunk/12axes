import { describe, expect, it } from 'vitest';
import { pdfButtonAction } from './pdfAccess';

describe('pdfButtonAction', () => {
  it('sem acesso e com a compra ligada, abre o modal de compra', () => {
    expect(pdfButtonAction(true, false)).toBe('openModal');
  });

  it('com acesso, gera o PDF', () => {
    expect(pdfButtonAction(true, true)).toBe('print');
  });

  it('com a compra desligada, o PDF continua livre', () => {
    expect(pdfButtonAction(false, false)).toBe('print');
    expect(pdfButtonAction(false, true)).toBe('print');
  });
});
