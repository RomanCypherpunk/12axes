import { describe, expect, it } from 'vitest';
import { langForcedByPath, langSwitchPath } from './index';

describe('idioma pelo caminho', () => {
  it('a comparação segue o catálogo: /compare em português, /en/compare em inglês e /fr/compare em francês', () => {
    expect(langForcedByPath('/compare')).toBe('pt');
    expect(langForcedByPath('/en/compare')).toBe('en');
    expect(langForcedByPath('/en/compare/')).toBe('en');
    expect(langForcedByPath('/fr/compare')).toBe('fr');
    expect(langForcedByPath('/compare.html')).toBe('pt');
  });

  it('home em /en, /br e /fr continua forçada; o resto não', () => {
    expect(langForcedByPath('/en')).toBe('en');
    expect(langForcedByPath('/br')).toBe('pt');
    expect(langForcedByPath('/fr')).toBe('fr');
    expect(langForcedByPath('/')).toBeNull();
    expect(langForcedByPath('/results')).toBeNull();
  });

  it('o toggle troca entre /compare, /en/compare e /fr/compare', () => {
    expect(langSwitchPath('/compare', 'en')).toBe('/en/compare');
    expect(langSwitchPath('/en/compare/', 'pt')).toBe('/compare');
    expect(langSwitchPath('/compare', 'fr')).toBe('/fr/compare');
    expect(langSwitchPath('/fr/compare', 'en')).toBe('/en/compare');
    expect(langSwitchPath('/en', 'pt')).toBe('/br');
    expect(langSwitchPath('/br', 'en')).toBe('/en');
    expect(langSwitchPath('/br', 'fr')).toBe('/fr');
    expect(langSwitchPath('/fr', 'pt')).toBe('/br');
    expect(langSwitchPath('/results', 'en')).toBeNull();
  });
});
