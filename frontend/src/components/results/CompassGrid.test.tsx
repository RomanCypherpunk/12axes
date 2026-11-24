import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { CompassChart } from './PoliticalCompassSection';

describe('grade da bússola', () => {
  it('a bússola da página tem a grade de linhas finas (10×10 por quadrante, como o Political Compass), abaixo dos eixos e do marcador', () => {
    const html = renderToStaticMarkup(<CompassChart ariaLabel="bússola" markers={[]} />);
    expect(html).toContain('e-compass-grid');
    // a grade fica depois dos quadrantes e antes dos eixos, para não cobrir as linhas dos eixos nem o "X"
    expect(html.indexOf('e-compass-quad')).toBeLessThan(html.indexOf('e-compass-grid'));
    expect(html.indexOf('e-compass-grid')).toBeLessThan(html.indexOf('e-compass-axis'));
  });
});
