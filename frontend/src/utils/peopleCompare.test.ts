import { describe, expect, it } from 'vitest';
import {
  midpoint,
  pairCompatibility,
  parsePeopleCompareUrl,
  parseResultLink,
  personInitials,
  peopleCompareUrl,
  religionPreference,
  RESULT_URL_KEYS,
  type PersonResult
} from './peopleCompare';
import { parseReligionList } from './religion';

const QUERY = 'est=65&rep=32.5&pod=10&imi=90&dip=50&int=0&eco=100&con=44&com=12&rel=70&mor=33&tec=51';
const VALUES = [65, 32.5, 10, 90, 50, 0, 100, 44, 12, 70, 33, 51];

describe('parseResultLink', () => {
  it.each([
    ['URL completa', `https://12axes.vercel.app/results?${QUERY}`],
    ['URL em inglês', `https://12axes.vercel.app/en/results?${QUERY}&lang=en`],
    ['só o caminho', `/results?${QUERY}`],
    ['só a query com ?', `?${QUERY}`],
    ['só os parâmetros', QUERY],
    ['com espaços e quebra de linha', `  \n${QUERY}\n `],
    ['com âncora', `https://x.com/results?${QUERY}#comparar`],
    ['com &amp;', `/results?${QUERY.replace(/&/g, '&amp;')}`],
    ['em outra ordem e caixa', `/results?${[...QUERY.split('&')].reverse().join('&').toUpperCase()}`],
    ['com chave desconhecida', `/results?utm_source=zap&${QUERY}&foo=bar`]
  ])('aceita %s', (_, raw) => {
    const parsed = parseResultLink(raw);
    expect(parsed).toEqual({ ok: true, values: VALUES, religion: null });
  });

  it('lê a religião e ignora valor desconhecido', () => {
    expect(parseResultLink(`${QUERY}&religion=catholic`)).toMatchObject({ ok: true, religion: 'catholic' });
    expect(parseResultLink(`${QUERY}&religion=pastafarian`)).toMatchObject({ ok: true, religion: null });
  });

  it('aceita vírgula decimal', () => {
    expect(parseResultLink(QUERY.replace('32.5', '32,5'))).toMatchObject({ ok: true, values: VALUES });
  });

  it('aceita o link curto do cartão (/r?v=...)', () => {
    const short = 'v=65-32.5-10-90-50-0-100-44-12-70-33-51';
    expect(parseResultLink(`https://12axes.vercel.app/r?${short}`)).toEqual({ ok: true, values: VALUES, religion: null });
    expect(parseResultLink(`/r?${short}&r=c&l=en`)).toMatchObject({ ok: true, values: VALUES, religion: 'catholic' });
  });

  it('link curto incompleto é inválido', () => {
    expect(parseResultLink('/r?v=65-32')).toMatchObject({ ok: false, problem: { kind: 'invalid' } });
  });

  it('vazio', () => {
    expect(parseResultLink('   ')).toEqual({ ok: false, problem: { kind: 'empty' } });
  });

  it('diz quais eixos faltam', () => {
    const parsed = parseResultLink('/results?est=65&rep=32');
    expect(parsed).toEqual({ ok: false, problem: { kind: 'missing', keys: RESULT_URL_KEYS.slice(2) } });
  });

  it('rejeita valor fora de 0 a 100 ou não numérico', () => {
    expect(parseResultLink(QUERY.replace('est=65', 'est=101'))).toEqual({ ok: false, problem: { kind: 'invalid', keys: ['est'] } });
    expect(parseResultLink(QUERY.replace('rep=32.5', 'rep=abc'))).toEqual({ ok: false, problem: { kind: 'invalid', keys: ['rep'] } });
    expect(parseResultLink(QUERY.replace('pod=10', 'pod=-1'))).toEqual({ ok: false, problem: { kind: 'invalid', keys: ['pod'] } });
  });
});

describe('link da comparação entre pessoas', () => {
  const link = {
    names: ['Você', 'Maria & João'] as [string, string],
    people: [
      { values: VALUES, religion: null },
      { values: VALUES.map((value) => 100 - value), religion: 'islam' as const }
    ] as const
  };

  it('vai e volta', () => {
    const url = peopleCompareUrl({ names: link.names, people: [link.people[0], link.people[1]] });
    expect(url.startsWith('/compare/people?')).toBe(true);
    const back = parsePeopleCompareUrl(url.slice(url.indexOf('?')), ['A', 'B']);
    expect(back?.names).toEqual(link.names);
    expect(back?.people[0]).toEqual({ values: VALUES, religion: null });
    expect(back?.people[1].religion).toBe('islam');
    expect(back?.people[1].values[0]).toBe(35);
  });

  it('usa os nomes de reserva e recusa vetores incompletos', () => {
    const vector = VALUES.join(',');
    expect(parsePeopleCompareUrl(`?a=${vector}&b=${vector}`, ['Você', 'Outra pessoa'])?.names).toEqual(['Você', 'Outra pessoa']);
    expect(parsePeopleCompareUrl(`?a=${vector}&b=1,2,3`, ['A', 'B'])).toBeNull();
    expect(parsePeopleCompareUrl(`?a=${vector}`, ['A', 'B'])).toBeNull();
  });
});

describe('pairCompatibility', () => {
  const other = [10, 90, 33, 47, 52, 80, 5, 61, 99, 20, 45, 70];

  it('vetores iguais dão 100', () => {
    expect(pairCompatibility(VALUES, VALUES)).toBe(100);
  });

  // Valores de referência calculados por ProfileMatchScorer.compatibility no backend.
  it('bate com a fórmula do backend', () => {
    expect(pairCompatibility(VALUES, other)).toBe(42.7);
    expect(pairCompatibility(VALUES, VALUES.map((value) => 100 - value))).toBe(36.4);
  });

  it('é simétrica e fica entre 0 e 100', () => {
    const forward = pairCompatibility(VALUES, other);
    expect(forward).toBe(pairCompatibility(other, VALUES));
    expect(forward).toBeGreaterThanOrEqual(0);
    expect(forward).toBeLessThanOrEqual(100);
  });

  it('o ponto médio fica entre os dois', () => {
    expect(midpoint([0, 100], [100, 100])).toEqual([50, 100]);
  });
});

describe('personInitials', () => {
  it('uma inicial para um nome e duas para dois ou mais', () => {
    expect(personInitials('enzo')).toBe('E');
    expect(personInitials('enzo xavier')).toBe('EX');
    expect(personInitials('  maria  da   silva ')).toBe('MD');
    expect(personInitials('élio')).toBe('É');
    expect(personInitials('   ')).toBe('?');
  });
});

describe('religiões na comparação entre pessoas', () => {
  const people = [
    { values: VALUES, religion: null },
    { values: VALUES, religion: 'catholic' as const, religionFilter: 'catholic,protestant' }
  ] as [PersonResult, PersonResult];

  it('o link leva todas as religiões do perfil e a leitura devolve a primeira e a lista', () => {
    const url = peopleCompareUrl({ names: ['Você', 'Jair'], people });
    expect(new URLSearchParams(url.split('?')[1]).get('rb')).toBe('catholic,protestant');
    const parsed = parsePeopleCompareUrl(url.split('?')[1], ['Você', 'Outra']);
    expect(parsed?.people[1]).toMatchObject({ religion: 'catholic', religionFilter: 'catholic,protestant' });
    expect(parsed?.people[0]).toEqual({ values: VALUES, religion: null });
  });

  it('uma só religião vai sem lista, e valores inválidos são ignorados', () => {
    const one = peopleCompareUrl({ names: ['Você', 'José'], people: [people[0], { values: VALUES, religion: 'catholic' }] });
    expect(new URLSearchParams(one.split('?')[1]).get('rb')).toBe('catholic');
    expect(parseReligionList('protestant, xyz,catholic,catholic')).toEqual(['catholic', 'protestant']);
    expect(religionPreference(people[1])).toBe('catholic,protestant');
    expect(religionPreference(people[0])).toBeNull();
  });
});
