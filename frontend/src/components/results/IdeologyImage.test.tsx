import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ideologyImageUrl } from '../../data/ideologyImages';
import type { IdeologyMatch } from '../../types/quiz';
import { IdeologyHero, IdeologyImageSource, safeSourceUrl } from './IdeologyImage';

const match = (ideologyId: string, name: string): IdeologyMatch => ({
  ideologyId,
  name,
  category: 'Extrema Direita',
  description: 'Descrição curta.',
  longDescription: 'Descrição longa da ideologia.',
  phrase: 'Quero acelerar a superação das instituições liberais.',
  compatibility: 91.4
});

describe('imagem da ideologia pelo nome do arquivo', () => {
  it('descobre a imagem só pelo arquivo: nome = id da ideologia, sem lista para atualizar', () => {
    expect(ideologyImageUrl('neorreacionarismo')).toMatch(/neorreacionarismo/);
    expect(ideologyImageUrl('aceleracionismo-de-direita')).toMatch(/aceleracionismo-de-direita/);
  });

  it('ideologia sem arquivo (ou sem id) não tem imagem, e um id estranho nunca monta caminho', () => {
    expect(ideologyImageUrl('reacionarismo')).toBeNull();
    expect(ideologyImageUrl(undefined)).toBeNull();
    expect(ideologyImageUrl('../neorreacionarismo')).toBeNull();
  });
});

describe('IdeologyHero (o cartão do topo com imagem, igual ao dos países)', () => {
  const html = renderToStaticMarkup(<IdeologyHero match={match('aceleracionismo-de-direita', 'Aceleracionismo de Direita')} />);

  it('usa o cartão dos países, com a imagem no lugar da bandeira', () => {
    expect(html).toContain('class="e-match e-ideology-hero"');
    expect(html).toContain('class="e-flagbig"');
    expect(html).toContain('alt="Aceleracionismo de Direita"');
  });

  it('mostra nome, espectro, match, a frase e o "Saber mais"', () => {
    expect(html).toContain('Aceleracionismo de Direita');
    expect(html).toContain('Extrema Direita');
    expect(html).toContain('91% match');
    expect(html).toContain('Quero acelerar a superação das instituições liberais.');
    expect(html).toContain('class="e-more"');
    expect(html).toContain('Descrição longa da ideologia.');
  });

  it('sem arquivo de imagem não renderiza nada (o cartão de sempre é usado)', () => {
    expect(renderToStaticMarkup(<IdeologyHero match={match('reacionarismo', 'Reacionarismo')} />)).toBe('');
  });
});

describe('IdeologyImageSource', () => {
  it('"Fonte original" só aparece com crédito cadastrado e endereço http(s)', () => {
    const html = renderToStaticMarkup(<IdeologyImageSource ideologyId="neorreacionarismo" />);
    expect(html).toContain('href="https://wiki.polcompball.co.uk/');
    expect(html).toContain('rel="noopener noreferrer"');
    // tem imagem, mas nenhum crédito cadastrado: nada de botão
    expect(renderToStaticMarkup(<IdeologyImageSource ideologyId="aceleracionismo-de-direita" />)).toBe('');
    expect(renderToStaticMarkup(<IdeologyImageSource ideologyId="reacionarismo" />)).toBe('');
  });

  it('safeSourceUrl aceita só http e https', () => {
    expect(safeSourceUrl('https://a.org/x')).toBe('https://a.org/x');
    for (const bad of ['javascript:alert(1)', 'data:text/html,x', '//a.org', '/relativo', '']) expect(safeSourceUrl(bad)).toBeNull();
  });
});
