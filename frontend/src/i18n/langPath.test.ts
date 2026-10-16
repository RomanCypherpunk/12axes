import { describe, expect, it } from 'vitest';
import { langForcedByPath, langSwitchPath } from './index';

describe('idioma pelo caminho', () => {
  it('a comparação segue o catálogo: /compare em português e /en/compare em inglês', () => {
    expect(langForcedByPath('/compare')).toBe('pt');
    expect(langForcedByPath('/en/compare')).toBe('en');
    expect(langForcedByPath('/en/compare/')).toBe('en');
    expect(langForcedByPath('/compare.html')).toBe('pt');
  });

  it('home em /en e /br continua forçada; o resto não', () => {
    expect(langForcedByPath('/en')).toBe('en');
    expect(langForcedByPath('/br')).toBe('pt');
    expect(langForcedByPath('/')).toBeNull();
    expect(langForcedByPath('/results')).toBeNull();
  });

  it('o toggle troca entre /compare e /en/compare', () => {
    expect(langSwitchPath('/compare', 'en')).toBe('/en/compare');
    expect(langSwitchPath('/en/compare/', 'pt')).toBe('/compare');
    expect(langSwitchPath('/en', 'pt')).toBe('/br');
    expect(langSwitchPath('/br', 'en')).toBe('/en');
    expect(langSwitchPath('/results', 'en')).toBeNull();
  });
});
