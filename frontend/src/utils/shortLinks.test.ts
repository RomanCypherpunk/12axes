import jsQR from 'jsqr';
import { describe, expect, it } from 'vitest';
import { qrModules } from './qrMatrix';
import { compactCompareUrl, parseShortResult, PUBLIC_ORIGIN, shortResultQuery, shortResultUrl } from './shortLinks';

const VALUES = [88.8, 13.8, 50, 87.5, 68.8, 41.3, 20, 30.25, 40, 66, 27.6, 88.9];

// Rasteriza a matriz do QR (com a margem de silêncio) e decodifica com o jsQR, como faria um leitor.
function decode(modules: boolean[][]): string | null {
  const scale = 4;
  const margin = 4;
  const size = (modules.length + margin * 2) * scale;
  const data = new Uint8ClampedArray(size * size * 4).fill(255);
  modules.forEach((row, y) =>
    row.forEach((dark, x) => {
      if (!dark) return;
      for (let dy = 0; dy < scale; dy++) {
        for (let dx = 0; dx < scale; dx++) {
          const index = (((y + margin) * scale + dy) * size + (x + margin) * scale + dx) * 4;
          data[index] = data[index + 1] = data[index + 2] = 0;
        }
      }
    })
  );
  return jsQR(data, size, size)?.data ?? null;
}

describe('link curto do resultado', () => {
  it('usa uma casa decimal só quando precisa e vai e volta', () => {
    const query = shortResultQuery(VALUES, 'catholic', 'pt');
    expect(query).toBe('v=88.8-13.8-50-87.5-68.8-41.3-20-30.3-40-66-27.6-88.9&r=c');
    const parsed = parseShortResult(`?${query}`);
    expect(parsed?.religion).toBe('catholic');
    expect(parsed?.values).toEqual([88.8, 13.8, 50, 87.5, 68.8, 41.3, 20, 30.3, 40, 66, 27.6, 88.9]);
  });

  it('inclui o idioma inglês e ignora o português (padrão)', () => {
    expect(shortResultQuery(VALUES, null, 'en')).toContain('&l=en');
    expect(shortResultQuery(VALUES, null, 'pt')).not.toContain('lang');
  });

  it('a religião vai em uma letra e o link aceita também o nome inteiro', () => {
    const codes = { catholic: 'c', protestant: 'p', orthodox: 'o', judaism: 'j', islam: 'i', buddhism: 'b', hinduism: 'h', other: 'x' } as const;
    for (const [religion, code] of Object.entries(codes)) {
      const query = shortResultQuery(VALUES, religion as keyof typeof codes, 'pt');
      expect(query.endsWith(`&r=${code}`)).toBe(true);
      expect(parseShortResult(`?${query}`)?.religion).toBe(religion);
    }
    expect(parseShortResult(`?v=${VALUES.join('-')}&r=protestant`)?.religion).toBe('protestant');
    expect(parseShortResult(`?v=${VALUES.join('-')}&r=z`)?.religion).toBeNull();
  });

  it('recusa links incompletos ou com valores fora de 0 a 100', () => {
    expect(parseShortResult('?v=1-2-3')).toBeNull();
    expect(parseShortResult('')).toBeNull();
    expect(parseShortResult(`?v=${[...VALUES.slice(0, 11), 101].join('-')}`)).toBeNull();
    expect(parseShortResult(`?v=${[...VALUES.slice(0, 11), 'x'].join('-')}`)).toBeNull();
  });
});

describe('QR code do cartão', () => {
  it('o link curto do resultado cabe num QR pequeno e é lido de volta', () => {
    const url = shortResultUrl(VALUES, 'catholic', 'pt');
    expect(url.startsWith(`${PUBLIC_ORIGIN}/r?v=`)).toBe(true);
    expect(url.length).toBeLessThan(100);
    const modules = qrModules(url);
    expect(modules.length).toBeLessThanOrEqual(41);
    expect(decode(modules)).toBe(url);
  });

  it('com religião e inglês o link curto típico ainda cabe num QR de 33x33', () => {
    const url = shortResultUrl(VALUES.map(Math.round), 'protestant', 'en');
    expect(url.length).toBeLessThanOrEqual(78);
    expect(qrModules(url, 'L').length).toBe(33);
    expect(decode(qrModules(url, 'L'))).toBe(url);
  });

  it('no pior caso (todos os eixos em 100, religião e inglês) o QR sobe só para 37x37', () => {
    const url = shortResultUrl(Array(12).fill(100), 'protestant', 'en');
    expect(qrModules(url, 'L').length).toBeLessThanOrEqual(37);
    expect(decode(qrModules(url, 'L'))).toBe(url);
  });

  it('com valores inteiros e nível L o QR do resultado cai para 33x33 e continua legível', () => {
    const url = shortResultUrl(VALUES.map(Math.round), null, 'pt');
    const modules = qrModules(url, 'L');
    expect(modules.length).toBe(33);
    expect(decode(modules)).toBe(url);
  });

  it('o link da comparação entre duas pessoas também é lido de volta', () => {
    const other = VALUES.map((value) => 100 - value);
    const url = compactCompareUrl(['Você', 'José Antonio'], [VALUES, other], [null, 'catholic'], 'pt');
    expect(url).not.toContain('%2C');
    expect(url).toContain('a=89,14,50,88,69,41,20,30,40,66,28,89');
    expect(qrModules(url, 'L').length).toBeLessThanOrEqual(53);
    expect(decode(qrModules(url, 'L'))).toBe(url);
  });
});
