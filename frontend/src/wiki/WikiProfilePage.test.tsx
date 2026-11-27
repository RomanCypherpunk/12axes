import { resolve } from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { t } from '../i18n';
import type { Axis } from '../types/quiz';
import { resolveIdeologyColor } from '../utils/ideologyColors';
import { loadCatalogs } from './engine/catalogs.ts';
import { buildProfileResult } from './engine/profileResult.ts';
import { applyPerspective, WIKI_TEXT } from './strings';
import { WikiProfilePage } from './WikiProfilePage';

const catalogs = loadCatalogs(resolve(__dirname, '../../../backend/src/main/resources/data'), 'pt');

describe('WikiProfilePage', () => {
  it('cabeçalho e as oito seções, na ordem pedida, sem os mais distantes', () => {
    const person = catalogs.personalities.find((p) => p.id === 'donald-trump')!;
    const result = buildProfileResult({ catalog: 'personality', id: 'donald-trump' }, catalogs);
    applyPerspective(t, 'pt', person.name);
    const html = renderToStaticMarkup(
      <WikiProfilePage
        subject={{
          kind: 'personality', id: person.id, name: person.name,
          tags: [{ label: person.role, solid: true }, { label: 'Política' }, { label: person.lifespan }],
          description: person.description,
          image: { src: person.imagePath, alt: person.name, fit: 'cover', credit: '', creditUrl: '' },
          compareHref: '/compare?items=personality:donald-trump', quizHref: '/', prefix: ''
        }}
        result={result}
        axes={catalogs.axes as unknown as Axis[]}
        religion={null}
        text={WIKI_TEXT.pt}
      />
    );
    const order = ['eixos-resultado', 'assinatura', 'paises', 'personalidades', 'areas', 'partidos', 'valores', 'bussola', 'ideologias'].map((id) =>
      html.indexOf(`id="${id}"`)
    );
    expect(order.every((position) => position > 0)).toBe(true);
    expect([...order].sort((a, b) => a - b)).toEqual(order);
    expect(html).toContain(`>${person.name}</h1>`);
    expect(html).toContain(`<span class="e-tag e-tag-solid">${person.role}</span>`);
    expect(html).toContain('<span class="e-tag e-tag-neutral">Política</span>');
    expect(html).toContain('Espectro mais próximo');
    expect(html).toContain(`href="/ideologies/${result.topMatch.ideologyId}"`);
    expect(html).toContain(`href="/personalities/${result.topPersonalityMatch.personalityId}"`);
    expect(html).toContain('Mediana das personalidades');
    expect(html).toContain(result.topMatch.name);
    expect(html).toContain('Comparar com…');
    expect(html).toContain(`O que distingue ${person.name}`);
    expect(html).not.toContain(t.ideologyDistantTitle);
    expect(html).not.toContain('O que te distingue');
    expect(html).toContain('Compatibilidade geral');
    expect(t.compassSpectrumDescriptions.direita.startsWith(`${person.name} tende`)).toBe(true);
  });

  it('ideologia: sem imagem, com a frase, comparada com as outras ideologias', () => {
    const ideology = catalogs.ideologies.find((i) => i.id === 'marxismo-leninismo')!;
    const result = buildProfileResult({ catalog: 'ideology', id: ideology.id }, catalogs);
    applyPerspective(t, 'pt', ideology.name, 'ideology');
    const html = renderToStaticMarkup(
      <WikiProfilePage
        subject={{ kind: 'ideology', id: ideology.id, name: ideology.name, tags: [{ label: ideology.category, solid: true }], description: ideology.description,
          phrase: ideology.phrase, colorCategory: ideology.category, colorIdeologyId: ideology.id, compareHref: '/', quizHref: '/', prefix: '' }}
        result={result}
        axes={catalogs.axes as unknown as Axis[]}
        religion={null}
        text={WIKI_TEXT.pt}
      />
    );
    expect(html).toContain('e-wiki-ideo-side');
    expect(html.indexOf('e-wiki-near')).toBeLessThan(html.indexOf('e-wiki-phrase-card'));
    expect(html).toContain(ideology.phrase!);
    expect(html).toContain('Mediana das ideologias');
    expect(html).toContain('País mais próximo');
    expect(result.matches.map((m) => m.ideologyId)).not.toContain(ideology.id);
  });

  it('ideologia: a bússola usa a categoria da própria ideologia e o país mais próximo inclui os históricos', () => {
    // O Fascismo Britânico (Terceira Posição) tem como ideologia mais próxima uma de outra categoria.
    const ideology = catalogs.ideologies.find((i) => i.id === 'fascismo-britanico')!;
    const result = buildProfileResult({ catalog: 'ideology', id: ideology.id }, catalogs);
    expect(result.topMatch.category).not.toBe(ideology.category);
    // E o país mais próximo de todos é um histórico, na frente do melhor país atual.
    const best = result.topCountryMatches[0];
    expect(best.historical).toBe(true);
    applyPerspective(t, 'pt', ideology.name, 'ideology');
    const html = renderToStaticMarkup(
      <WikiProfilePage
        subject={{ kind: 'ideology', id: ideology.id, name: ideology.name, tags: [{ label: ideology.category, solid: true }], description: ideology.description,
          colorCategory: ideology.category, colorIdeologyId: ideology.id, compareHref: '/', quizHref: '/', prefix: '' }}
        result={result}
        axes={catalogs.axes as unknown as Axis[]}
        religion={null}
        text={WIKI_TEXT.pt}
      />
    );
    const compass = html.slice(html.indexOf('id="bussola"'), html.indexOf('id="ideologias"'));
    expect(compass).toContain(t.compassSpectrumLabels[resolveIdeologyColor(ideology.category, ideology.id).key]);
    expect(compass).not.toContain(t.compassSpectrumLabels[resolveIdeologyColor(result.topMatch.category, result.topMatch.ideologyId).key]);
    const hero = html.slice(0, html.indexOf('id="eixos-resultado"'));
    expect(hero).toContain(`href="/countries/${best.countryId}"`);
  });
});
