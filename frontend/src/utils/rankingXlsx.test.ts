import { describe, expect, it } from 'vitest';
import type { PremiumRanking, RankingRow } from '../types/quiz';
import { rankingSheets } from './rankingXlsx';

const row = (name: string, compatibility: number, extra: Partial<RankingRow> = {}): RankingRow => ({
  id: name,
  name,
  category: 'Centro',
  historical: false,
  compatibility,
  ...extra
});

const ranking: PremiumRanking = {
  ideologies: [row('A', 90), row('B', 80.04)],
  personalities: [row('P', 70)],
  countries: [row('C', 60, { historical: true })],
  parties: [row('Q', 87.34)]
};

describe('rankingSheets', () => {
  it('cria uma aba por tipo, com o nome no idioma', () => {
    expect(rankingSheets(ranking, 'pt').map((sheet) => sheet.name)).toEqual(['Ideologias', 'Personalidades', 'Países', 'Partidos']);
    expect(rankingSheets(ranking, 'en').map((sheet) => sheet.name)).toEqual(['Ideologies', 'Figures', 'Countries', 'Parties']);
  });

  it('o rótulo da coluna do nome é o do tipo', () => {
    const [ideologies, , , parties] = rankingSheets(ranking, 'pt');
    expect(ideologies.headers).toEqual(['Posição', 'Ideologia', 'Categoria', 'Compatibilidade']);
    expect(parties.headers).toEqual(['Posição', 'Partido', 'Categoria', 'Histórico', 'Compatibilidade']);
  });

  it('só países e partidos têm a coluna de histórico', () => {
    const sheets = rankingSheets(ranking, 'pt');
    expect(sheets.map((sheet) => sheet.headers.includes('Histórico'))).toEqual([false, false, true, true]);
    expect(sheets[2].rows[0].cells).toEqual([1, 'C', 'Centro', 'Sim', 0.6]);
    expect(sheets[3].rows[0].cells[3]).toBe('Não');
  });

  it('numera a partir de 1 e guarda a compatibilidade como fração com 1 casa', () => {
    const [ideologies, , , parties] = rankingSheets(ranking, 'en');
    expect(ideologies.rows.map((r) => r.cells[0])).toEqual([1, 2]);
    expect(ideologies.rows[1].cells[3]).toBe(0.8);
    expect(parties.rows[0].cells[4]).toBe(0.873);
  });

  it('aponta a coluna da categoria e a de compatibilidade', () => {
    const [ideologies, , countries] = rankingSheets(ranking, 'pt');
    expect([ideologies.categoryColumn, ideologies.compatibilityColumn]).toEqual([2, 3]);
    expect([countries.categoryColumn, countries.compatibilityColumn]).toEqual([2, 4]);
  });

  it('um tipo vazio gera só o cabeçalho', () => {
    expect(rankingSheets({ ...ranking, countries: [] }, 'pt')[2].rows).toEqual([]);
  });
});
