import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { loadCatalogs } from './catalogs.ts';
import { buildProfileResult } from './profileResult.ts';

const DATA = resolve(__dirname, '../../../../backend/src/main/resources/data');
const pt = loadCatalogs(DATA, 'pt');
const en = loadCatalogs(DATA, 'en');
const de = loadCatalogs(DATA, 'de');

describe('buildProfileResult', () => {
  it('mesma ideologia em pt e en, com o nome no idioma', () => {
    const a = buildProfileResult({ catalog: 'personality', id: 'donald-trump' }, pt);
    const b = buildProfileResult({ catalog: 'personality', id: 'donald-trump' }, en);
    expect(b.topMatch.ideologyId).toBe(a.topMatch.ideologyId);
    expect(a.topMatch.name).toBe(pt.ideologies.find((i) => i.id === a.topMatch.ideologyId)!.name);
    expect(b.topMatch.name).toBe(en.ideologies.find((i) => i.id === a.topMatch.ideologyId)!.name);
  });

  it('oito valores, com texto no idioma pedido', () => {
    const r = buildProfileResult({ catalog: 'personality', id: 'donald-trump' }, de);
    expect(r.politicalValues).toHaveLength(8);
    const first = r.politicalValues![0];
    expect(first.name).toBe(de.valueText!.get(first.valueId)?.name || de.valueEnglish.get(first.valueId)!.name);
  });

  it('eixos iguais ao vetor do perfil', () => {
    const r = buildProfileResult({ catalog: 'personality', id: 'donald-trump' }, pt);
    const vector = pt.vectors.personality.get('donald-trump')!;
    for (const axis of r.axes) expect(axis.leftPercent).toBeCloseTo(Math.round(vector[axis.axisId] * 10) / 10, 5);
  });

  it('o próprio perfil não aparece entre os mais próximos', () => {
    const r = buildProfileResult({ catalog: 'personality', id: 'donald-trump' }, pt);
    expect(r.personalityMatches.map((m) => m.personalityId)).not.toContain('donald-trump');
    expect(r.dimensionMatches.map((d) => d.match.personalityId)).not.toContain('donald-trump');
  });

  it('id inexistente lança erro com o id', () => {
    expect(() => buildProfileResult({ catalog: 'personality', id: 'ninguem-xyz' }, pt)).toThrow('ninguem-xyz');
  });
});
