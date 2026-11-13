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

  it('espanhol: /es e /es/compare forçam o idioma e o seletor troca as rotas', () => {
    expect(langForcedByPath('/es')).toBe('es');
    expect(langForcedByPath('/es/compare')).toBe('es');
    expect(langSwitchPath('/es/compare', 'pt')).toBe('/compare');
    expect(langSwitchPath('/compare', 'es')).toBe('/es/compare');
    expect(langSwitchPath('/es', 'en')).toBe('/en');
    expect(langSwitchPath('/es', 'pt')).toBe('/br');
    expect(langSwitchPath('/en', 'es')).toBe('/es');
  });

  it('alemão: /de e /de/compare forçam o idioma e o seletor troca as rotas', () => {
    expect(langForcedByPath('/de')).toBe('de');
    expect(langForcedByPath('/de/compare/')).toBe('de');
    expect(langSwitchPath('/de/compare', 'pt')).toBe('/compare');
    expect(langSwitchPath('/compare', 'de')).toBe('/de/compare');
    expect(langSwitchPath('/es/compare', 'de')).toBe('/de/compare');
    expect(langSwitchPath('/de', 'es')).toBe('/es');
    expect(langSwitchPath('/de', 'pt')).toBe('/br');
    expect(langSwitchPath('/en', 'de')).toBe('/de');
    expect(langForcedByPath('/deutsch')).toBeNull();
  });

  it('italiano: /it e /it/compare forçam o idioma e o seletor troca as rotas', () => {
    expect(langForcedByPath('/it')).toBe('it');
    expect(langForcedByPath('/it/compare/')).toBe('it');
    expect(langSwitchPath('/it/compare', 'pt')).toBe('/compare');
    expect(langSwitchPath('/compare', 'it')).toBe('/it/compare');
    expect(langSwitchPath('/de/compare', 'it')).toBe('/it/compare');
    expect(langSwitchPath('/it', 'de')).toBe('/de');
    expect(langSwitchPath('/it', 'pt')).toBe('/br');
    expect(langForcedByPath('/italiano')).toBeNull();
  });

  it('o toggle troca entre /compare e /en/compare', () => {
    expect(langSwitchPath('/compare', 'en')).toBe('/en/compare');
    expect(langSwitchPath('/en/compare/', 'pt')).toBe('/compare');
    expect(langSwitchPath('/en', 'pt')).toBe('/br');
    expect(langSwitchPath('/br', 'en')).toBe('/en');
    expect(langSwitchPath('/results', 'en')).toBeNull();
  });
});
