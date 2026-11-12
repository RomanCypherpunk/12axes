import { describe, expect, it } from 'vitest';
import { fullValuesParam, readFullValuesKey } from './sharedResultUrl';

describe('fullValuesParam', () => {
  it('monta o parâmetro f só para uma chave com a forma certa (10 caracteres base64url)', () => {
    expect(fullValuesParam('1AbCdEfGhI')).toBe('&f=1AbCdEfGhI');
    expect(fullValuesParam('1AbC-_fGhI')).toBe('&f=1AbC-_fGhI');
  });

  it('não acrescenta nada sem chave ou com chave malformada (o link fica como antes)', () => {
    for (const key of [null, undefined, '', 'curta', '1AbCdEfGhIJ', 'a b', '1AbCdEfG=I', '1AbCdEfGh&']) {
      expect(fullValuesParam(key)).toBe('');
    }
  });
});

describe('readFullValuesKey', () => {
  it('lê o f do endereço', () => {
    expect(readFullValuesKey('?est=1&f=1AbCdEfGhI&lang=en')).toBe('1AbCdEfGhI');
    expect(readFullValuesKey('?v=70-80&f=1AbCdEfGhI')).toBe('1AbCdEfGhI');
  });

  it('devolve null sem f ou com f malformado', () => {
    expect(readFullValuesKey('?est=1')).toBeNull();
    expect(readFullValuesKey('?est=1&f=')).toBeNull();
    expect(readFullValuesKey('?est=1&f=lixo')).toBeNull();
    expect(readFullValuesKey('?est=1&f=1AbCdEfGhI%20')).toBeNull();
  });
});
