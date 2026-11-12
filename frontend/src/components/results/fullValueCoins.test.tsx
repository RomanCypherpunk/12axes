import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import catalog from '../../../../backend/src/main/resources/data/full-values.json';
import { FILLED_POLE_ICONS } from '../../data/filledPoleIcons';
import type { FullValue } from '../../types/quiz';
import { FULL_VALUE_COINS } from './fullValueCoins';
import { FullValueCoin } from './FullValueParts';

interface CatalogValue {
  id: string;
  neutral: boolean;
}

const politica = (catalog as { id: string; values: CatalogValue[] }[]).find((category) => category.id === 'politica')!;

const value = (id: string, name = id): FullValue => ({
  categoryId: 'politica',
  categoryLabel: 'Política',
  valueId: id,
  name,
  description: '',
  neutral: false,
  icon: null
});

describe('moedas dos valores completos', () => {
  it('todo valor de Política do catálogo (menos o neutro) tem ícone, e nenhum ícone sobra sem valor', () => {
    const ids = politica.values.filter((item) => !item.neutral).map((item) => item.id);
    expect(ids.length).toBeGreaterThanOrEqual(19);
    for (const id of ids) {
      expect(FULL_VALUE_COINS[id], `moeda de ${id}`).toBeDefined();
    }
    expect(Object.keys(FULL_VALUE_COINS).sort()).toEqual([...ids].sort());
  });

  it('o ícone vem na cor do espectro: círculo --cat e glifo --cat-bg, como as moedas dos valores derivados', () => {
    const html = renderToStaticMarkup(<FullValueCoin value={value('tecnocracia', 'Tecnocracia')} size={56} />);
    expect(html).toContain('class="e-vcoin"');
    expect(html).toContain('var(--cat');
    expect(html).toContain('var(--cat-bg');
    expect(html).not.toContain('<img');
    expect(html).toContain(`viewBox="${FULL_VALUE_COINS.tecnocracia.viewBox}"`);
  });

  it('a teocracia usa o símbolo da religião do usuário (a cruz, por padrão), o mesmo do eixo de religião', () => {
    const html = renderToStaticMarkup(<FullValueCoin value={value('teocracia', 'Teocracia')} size={56} />);
    const cross = FILLED_POLE_ICONS.religiao.right!;
    expect(html).toContain(`viewBox="${cross.viewBox}"`);
    expect(html).toContain(cross.paths[0].slice(0, 30));
  });

  it('o valor neutro não tem ícone e mostra a inicial', () => {
    const html = renderToStaticMarkup(<FullValueCoin value={value('politica_equilibrada', 'Equilibrado')} size={56} />);
    expect(html).toContain('>E<');
    expect(html).not.toContain('<path');
  });

  it('a comunalismo desenha em traço (não em preenchimento), na cor clara da moeda', () => {
    const html = renderToStaticMarkup(<FullValueCoin value={value('comunalismo', 'Comunalismo')} size={56} />);
    expect(html).toContain('stroke-linecap="round"');
    expect(html).toContain('stroke:var(--cat-bg');
  });
});
