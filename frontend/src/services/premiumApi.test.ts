import { describe, expect, it } from 'vitest';
import { archetypeOnly } from './premiumApi';

describe('archetypeOnly', () => {
  it('tira as escolhas de religião, que o servidor não aceita como arquétipo', () => {
    expect(archetypeOnly({ sociedade: 'A', poder: 'C', religiao: 'budismo', denominacao: 'catolico' })).toEqual({
      sociedade: 'A',
      poder: 'C'
    });
  });

  it('mantém as alternativas de arquétipo como estão', () => {
    expect(archetypeOnly({ mundo: 'B', tecnologia: 'D' })).toEqual({ mundo: 'B', tecnologia: 'D' });
  });
});
