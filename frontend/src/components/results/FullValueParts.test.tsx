import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { t } from '../../i18n';
import type { FullValue } from '../../types/quiz';
import { FullValueCoin, FullValueDetail, safeSourceUrl } from './FullValueParts';

const withIcon: FullValue = {
  categoryId: 'politica',
  categoryLabel: 'Política',
  valueId: 'democracia',
  name: 'Democracia',
  description: 'Governo escolhido por eleições livres.',
  neutral: false,
  icon: { file: 'democracia.svg', sourceUrl: 'https://commons.wikimedia.org/wiki/File:X.svg', author: 'Fulano', license: 'CC BY 3.0', modified: true }
};

// 'valor_sem_moeda' não tem ícone em fullValueCoins.tsx: cai no círculo com a inicial.
const withoutIcon: FullValue = { ...withIcon, valueId: 'valor_sem_moeda', name: 'Tecnocracia', icon: null };

describe('FullValueDetail', () => {
  it('mostra nome, categoria e descrição', () => {
    const html = renderToStaticMarkup(<FullValueDetail value={withIcon} />);
    expect(html).toContain('Democracia');
    expect(html).toContain('Política');
    expect(html).toContain('Governo escolhido por eleições livres.');
  });

  it('com ícone mostra autor, licença, aviso de modificação e o botão "Fonte original" para a página do arquivo', () => {
    const html = renderToStaticMarkup(<FullValueDetail value={withIcon} />);
    expect(html).toContain('Fulano');
    expect(html).toContain('CC BY 3.0');
    expect(html).toContain(t.valuesSourceModified);
    expect(html).toContain(t.valuesSourceButton);
    expect(html).toContain('href="https://commons.wikimedia.org/wiki/File:X.svg"');
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).toContain('target="_blank"');
  });

  it('sem ícone não mostra fonte nem botão', () => {
    const html = renderToStaticMarkup(<FullValueDetail value={withoutIcon} />);
    expect(html).not.toContain(t.valuesSourceButton);
    expect(html).not.toContain('<a ');
  });

  it('o valor neutro leva a etiqueta de posição equilibrada', () => {
    expect(renderToStaticMarkup(<FullValueDetail value={{ ...withoutIcon, neutral: true }} />)).toContain(t.valuesNeutralTag);
    expect(renderToStaticMarkup(<FullValueDetail value={withoutIcon} />)).not.toContain(t.valuesNeutralTag);
  });

  it('não vira link uma fonte que não é http(s)', () => {
    const evil: FullValue = { ...withIcon, icon: { ...withIcon.icon!, sourceUrl: 'javascript:alert(1)' } };
    const html = renderToStaticMarkup(<FullValueDetail value={evil} />);
    expect(html).not.toContain('javascript:');
    expect(html).not.toContain('<a ');
  });
});

describe('FullValueCoin', () => {
  it('com ícone mostra a imagem do arquivo da categoria, sem recolorir', () => {
    const html = renderToStaticMarkup(<FullValueCoin value={withIcon} size={56} />);
    expect(html).toContain('<img');
    expect(html).toContain('/values/politica/democracia.svg');
    expect(html).toContain('alt=""');
  });

  it('sem ícone mostra o círculo com a inicial do valor', () => {
    const html = renderToStaticMarkup(<FullValueCoin value={withoutIcon} size={56} />);
    expect(html).not.toContain('<img');
    expect(html).toContain('<circle');
    expect(html).toContain('>T<');
  });
});

describe('safeSourceUrl', () => {
  it('aceita só http e https', () => {
    expect(safeSourceUrl('https://a.org/x')).toBe('https://a.org/x');
    expect(safeSourceUrl('http://a.org/x')).toBe('http://a.org/x');
    for (const bad of ['javascript:alert(1)', 'data:text/html,x', '//a.org', '/relativo', '']) {
      expect(safeSourceUrl(bad)).toBeNull();
    }
  });
});
