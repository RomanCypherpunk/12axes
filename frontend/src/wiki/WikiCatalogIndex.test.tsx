import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { WIKI_LIST_TEXT, WIKI_TEXT } from './strings';
import { filterItems, WikiCatalogIndex, type WikiListItem } from './WikiCatalogIndex';

const people: WikiListItem[] = Array.from({ length: 30 }, (_, index) => ({
  id: `p${index}`,
  name: index === 7 ? 'Abraham Lincoln' : `Pessoa ${index}`,
  subtitle: index === 7 ? '16º Presidente dos EUA' : 'Cargo',
  group: index % 2 ? 'politico' : 'filosofo',
  groupLabel: index % 2 ? 'Política' : 'Filosofia',
  image: '/personalities/portraits/x.jpg',
  href: `/personalities/p${index}`
}));
const groups = [
  { id: 'politico', label: 'Política', count: 15 },
  { id: 'filosofo', label: 'Filosofia', count: 15 }
];

describe('WikiCatalogIndex', () => {
  it('HTML inicial com 24 caixas, a contagem e sem a etiqueta de catálogo', () => {
    const html = renderToStaticMarkup(<WikiCatalogIndex items={people} groups={groups} text={WIKI_TEXT.pt} list={WIKI_LIST_TEXT.pt.personality} />);
    expect(html.match(/class="e-dim-row"/g)).toHaveLength(24);
    expect(html).toContain('Mostrando 24 de 30');
    expect(html).toContain('href="/personalities/p0"');
    expect(html).not.toContain('Catálogo');
  });

  it('ideologias sem imagem viram o cartão colorido com o espectro', () => {
    const html = renderToStaticMarkup(
      <WikiCatalogIndex
        items={[{ id: 'marxismo-leninismo', name: 'Marxismo-Leninismo', subtitle: '', group: 'esq', groupLabel: 'Esquerda Radical', category: 'Esquerda Radical', href: '/ideologies/marxismo-leninismo' }]}
        groups={[]}
        text={WIKI_TEXT.pt}
        list={WIKI_LIST_TEXT.pt.ideology}
      />
    );
    expect(html).toContain('class="e-ocard e-wiki-ocard"');
    expect(html).toContain('>Esquerda Radical</span>');
  });

  it('filtro por grupo e busca sem acento', () => {
    expect(filterItems(people, 'filosofo', '')).toHaveLength(15);
    expect(filterItems(people, null, 'LINCÓLN').map((p) => p.name)).toEqual(['Abraham Lincoln']);
    expect(filterItems(people, null, 'presidente').map((p) => p.id)).toEqual(['p7']);
    expect(filterItems(people, 'filosofo', 'lincoln')).toHaveLength(0);
  });
});
