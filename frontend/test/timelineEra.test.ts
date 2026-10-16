import { describe, expect, it } from 'vitest';
import { bestTimelineEra, eraCompatibility, eraHighlights } from '../src/components/results/TimelineSection';
import type { CountryMatch, TimelineEra } from '../src/types/quiz';

const country = (compatibility: number) =>
  ({ type: 'country', personality: null, party: null, country: { compatibility } as CountryMatch }) as const;

const era = (key: TimelineEra['key'], compatibility: number | undefined, entryValues: number[]): TimelineEra =>
  ({ key, fromYear: null, toYear: null, compatibility, entries: entryValues.map(country) }) as unknown as TimelineEra;

describe('timeline era compatibility', () => {
  it('uses the compatibility computed by the backend', () => {
    expect(eraCompatibility(era('xx', 86.2, [90, 80]))).toBe(86.2);
  });

  it('falls back to the average of the shown profiles when the API has no era compatibility', () => {
    expect(eraCompatibility(era('xx', undefined, [90, 80]))).toBe(85);
    expect(eraCompatibility(era('xx', Number.NaN, [90, 70]))).toBe(80);
  });

  it('never returns NaN, even for an era without profiles', () => {
    expect(eraCompatibility(era('xx', undefined, []))).toBe(0);
  });

  it('picks the era with the highest compatibility, the oldest on a tie', () => {
    const eras = [era('antiguidade', 70, [70]), era('medieval', 85, [85]), era('moderna', 85, [85]), era('xx', 60, [60])];
    expect(bestTimelineEra(eras)?.key).toBe('medieval');
    expect(bestTimelineEra([era('xx', undefined, [])])).toBeNull();
  });

  it('lists the 2 highlights of the era, falling back to the first 2 profiles for an older API', () => {
    const withHighlights = { ...era('xx', 80, [90, 80, 70, 60]), highlights: [country(90), country(70)] } as TimelineEra;
    expect(eraHighlights(withHighlights)).toHaveLength(2);
    expect(eraHighlights(withHighlights)[1].country?.compatibility).toBe(70);
    expect(eraHighlights(era('xx', 80, [90, 80, 70, 60])).map((e) => e.country?.compatibility)).toEqual([90, 80]);
  });
});
