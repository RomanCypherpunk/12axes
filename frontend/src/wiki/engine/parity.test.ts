// Paridade com o backend: o gabarito é gravado pelo próprio backend (WikiParityFixtureTest) a partir de
// /api/results/by-axes. Se este teste falhar, a cópia em TypeScript divergiu do Java: corrija a cópia, não o gabarito.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { loadCatalogs } from './catalogs.ts';
import { computeResult, PERCENTILE } from './result.ts';

const ROOT = resolve(__dirname, '../../..');
const fixture = JSON.parse(readFileSync(resolve(ROOT, 'test/fixtures/backend-results.json'), 'utf8')) as Record<string, Record<string, unknown>>;
const catalogs = loadCatalogs(resolve(ROOT, '../backend/src/main/resources/data'), 'pt');

const fmt = (value: number | undefined): string => (value ?? 0).toFixed(2);
type Match = { compatibility: number; [PERCENTILE]?: number };
const row = (id: string, match: Match): string => `${id}:${fmt(match.compatibility)}:${fmt(match[PERCENTILE])}`;
const dim = (dimension: string, id: string, match: Match): string => `${dimension}:${id}:${fmt(match.compatibility)}`;

function snapshot(vector: string, religion: string | null) {
  const values = vector.split(',').map(Number);
  const user = Object.fromEntries(catalogs.axes.map((axis, index) => [axis.id, values[index]]));
  const r = computeResult(user, religion, catalogs);
  const outlier = (o: typeof r.mostUnusualAxis) =>
    o && {
      axisId: o.axisId,
      userPercent: fmt(o.userPercent),
      catalogMedian: fmt(o.catalogMedian),
      distanceFromMedian: fmt(o.distanceFromMedian),
      dominantPole: o.dominantPole,
      balanced: o.balanced,
      abovePole: o.abovePole,
      abovePercent: fmt(o.abovePercent)
    };
  return {
    ideologies: r.matches.slice(0, 10).map((m) => row(m.ideologyId, m)),
    bottomIdeology: [row(r.bottomIdeologyMatch.ideologyId, r.bottomIdeologyMatch)],
    personalities: r.personalityMatches.map((m) => row(m.personalityId, m)),
    personalityDims: r.dimensionMatches.map((d) => dim(d.dimension, d.match.personalityId, d.match)),
    bottomPersonalities: r.bottomPersonalityMatches.map((m) => row(m.personalityId, m)),
    countryTop: [row(r.topCountryMatch.countryId, r.topCountryMatch)],
    countryHistorical: [row(r.topHistoricalCountryMatch.countryId, r.topHistoricalCountryMatch)],
    countries: r.topCountryMatches.map((m) => row(m.countryId, m)),
    countryDims: r.countryDimensionMatches.map((d) => dim(d.dimension, d.match.countryId, d.match)),
    bottomCountries: r.bottomCountryMatches.map((m) => row(m.countryId, m)),
    partyTop: r.topPartyMatch ? [row(r.topPartyMatch.partyId, r.topPartyMatch)] : [],
    partyHistorical: r.topHistoricalPartyMatch ? [row(r.topHistoricalPartyMatch.partyId, r.topHistoricalPartyMatch)] : [],
    parties: (r.topPartyMatches ?? []).map((m) => row(m.partyId, m)),
    partyDims: (r.partyDimensionMatches ?? []).map((d) => dim(d.dimension, d.match.partyId, d.match)),
    bottomParties: (r.bottomPartyMatches ?? []).map((m) => row(m.partyId, m)),
    values: (r.politicalValues ?? []).map((v) => `${v.categoryId}:${v.valueId}${v.neutral ? ':neutral' : ''}`),
    unusual: outlier(r.mostUnusualAxis),
    common: outlier(r.mostCommonAxis),
    tension: r.axisTension && {
      first: `${r.axisTension.firstAxisLabel}:${r.axisTension.firstPole}`,
      second: `${r.axisTension.secondAxisLabel}:${r.axisTension.secondPole}`,
      matching: r.axisTension.matchingIdeologies,
      catalogSize: r.axisTension.catalogSize,
      examples: r.axisTension.examples
    }
  };
}

describe('paridade com o backend (backend-results.json)', () => {
  it('reproduz o resultado de todos os perfis e vetores do gabarito', () => {
    const failures: string[] = [];
    for (const [key, expected] of Object.entries(fixture)) {
      const { v, religion, ...fields } = expected as { v: string; religion: string | null } & Record<string, unknown>;
      const actual = snapshot(v, religion) as Record<string, unknown>;
      for (const [field, value] of Object.entries(fields)) {
        if (JSON.stringify(actual[field]) !== JSON.stringify(value)) {
          failures.push(`${key} ${field}\n  java: ${JSON.stringify(value)}\n  ts:   ${JSON.stringify(actual[field])}`);
        }
      }
    }
    expect(failures.slice(0, 15).join('\n'), `${failures.length} divergências`).toBe('');
  }, 300_000);
});
