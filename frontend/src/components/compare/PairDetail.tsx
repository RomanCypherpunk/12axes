import { useEffect, useMemo, useState, type ReactNode } from 'react';
import type { HOME_AXES } from '../../data/homeAxes';
import { t } from '../../i18n';
import { fetchSharedResult } from '../../services/quizApi';
import type { CompareProfile, CompareProfiles, IdeologyMatch, QuizResult } from '../../types/quiz';
import { midpoint, pairCompatibility, religionPreference, type PersonResult } from '../../utils/peopleCompare';
import { PARTIES_ENABLED } from '../../utils/partyLogos';
import { ShareImageIcon } from '../editorial/primitives';
import { stageColors, useSharePreview } from '../results/SharePhoneStage';
import { resolveIdeologyColor } from '../../utils/ideologyColors';
import type { CompareShareData } from '../../utils/compareShareCard';
import type { NavSection } from './ComparePage';
import { CountriesPair, PartiesPair, PersonalitiesPair, type NearbyPeople } from './ComparePeopleNearby';
import { CompareSharedValues, ComparePeopleValues } from './ComparePeopleValues';

export type Names = [string, string];

export interface Loaded {
  results: [QuizResult, QuizResult];
  common: IdeologyMatch;
}

/** Resultado de cada pessoa (e da média das duas) no mesmo endpoint dos resultados; null enquanto carrega ou se falhar. */
export function usePairResults(people: [PersonResult, PersonResult] | null): { loaded: Loaded | null; failed: boolean } {
  const [state, setState] = useState<{ key: string; loaded: Loaded } | null>(null);
  const [failed, setFailed] = useState(false);
  const key = people ? JSON.stringify(people) : '';

  useEffect(() => {
    if (!people) return;
    let cancelled = false;
    setFailed(false);
    Promise.all([
      fetchSharedResult(people[0].values, religionPreference(people[0])),
      fetchSharedResult(people[1].values, religionPreference(people[1])),
      fetchSharedResult(midpoint(people[0].values, people[1].values), null)
    ])
      .then(([first, second, common]) => {
        if (!cancelled) setState({ key, loaded: { results: [first, second], common: common.topMatch } });
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [key]);

  return { loaded: state?.key === key ? state.loaded : null, failed };
}

export function pairProfiles(profiles: [CompareProfile, CompareProfile], people: [PersonResult, PersonResult], common: IdeologyMatch | null): CompareProfiles {
  return { profiles, pairs: [{ first: 0, second: 1, compatibility: pairCompatibility(people[0].values, people[1].values) }], commonIdeology: common };
}

/** Cartão de compartilhamento da dupla: dados, prévia no celular e o botão que baixa a imagem. */
export function usePairShare(loaded: Loaded | null, profiles: CompareProfiles | null, names: Names, people: [PersonResult, PersonResult] | null, axes: typeof HOME_AXES) {
  const [isSharing, setIsSharing] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);

  const shareData = useMemo<CompareShareData | null>(() => {
    if (!people || !loaded || !profiles) return null;
    return {
      names,
      results: loaded.results,
      values: [people[0].values, people[1].values],
      axes,
      religions: [people[0].religion, people[1].religion],
      compatibility: profiles.pairs[0].compatibility
    };
  }, [loaded, profiles, names, people, axes]);

  const preview = useSharePreview(async () => {
    if (!shareData) throw new Error('sem dados');
    const { createCompareSharePng } = await import('../../utils/compareShareCard');
    return createCompareSharePng(shareData);
  }, [shareData]);

  const share = async () => {
    if (!shareData) return;
    setIsSharing(true);
    setShareError(null);
    try {
      const { exportCompareShare } = await import('../../utils/compareShareCard');
      await exportCompareShare(shareData);
    } catch (err) {
      setShareError(err instanceof Error ? err.message : t.errImage);
    } finally {
      setIsSharing(false);
    }
  };

  const actions = (className: string): ReactNode => (
    <>
      <div className={className}>
        <button className="e-btn e-btn-primary" type="button" onClick={share} disabled={isSharing}>
          {isSharing ? t.generatingPng : t.peopleShare} <ShareImageIcon />
        </button>
      </div>
      {shareError && (
        <p className="inline-error" role="alert">
          {shareError}
        </p>
      )}
    </>
  );

  const stage =
    loaded && shareData && preview.status !== 'error'
      ? {
          colors: stageColors(resolveIdeologyColor(loaded.results[0].topMatch.category), resolveIdeologyColor(loaded.results[1].topMatch.category)),
          src: preview.src,
          sectionRef: preview.ref,
          isSharing,
          onShare: share
        }
      : null;

  return { actions, stage };
}

// Países, personalidades e partidos lado a lado (as duas pessoas ao mesmo tempo), depois os valores:
// os de cada pessoa, categoria por categoria, e (só se houver) os que as duas têm em comum.
export function buildDetail(
  { results, common }: Loaded,
  { profiles }: CompareProfiles,
  names: Names,
  people: [PersonResult, PersonResult]
): { nearby: ReactNode; nav: NavSection[] } {
  const nearbyPeople: NearbyPeople = { profiles: [profiles[0], profiles[1]], results };
  const showParties = PARTIES_ENABLED && results.some((result) => (result.topPartyMatches?.length ?? 0) > 0);
  const hasValues = results.some((result) => (result.politicalValues?.length ?? 0) > 0);

  const first = results[0].politicalValues ?? [];
  const second = results[1].politicalValues ?? [];
  const shared = first.filter((value) => second.some((other) => other.categoryId === value.categoryId && other.valueId === value.valueId));
  const sharedReligion = people[0].religion === people[1].religion ? people[0].religion : null;

  const nearby = (
    <>
      <CountriesPair id="cmp-paises" title={t.comparePageCountriesTitle} people={nearbyPeople} />
      <PersonalitiesPair id="cmp-personalidades" title={t.peoplePersonalitiesTitle} people={nearbyPeople} />
      {showParties && <PartiesPair id="cmp-partidos" title={t.comparePagePartiesTitle} people={nearbyPeople} />}
      <ComparePeopleValues
        id="cmp-valores"
        title={t.peopleValuesTitle}
        people={[
          { name: names[0], result: results[0], religion: people[0].religion },
          { name: names[1], result: results[1], religion: people[1].religion }
        ]}
      />
      <CompareSharedValues id="cmp-valores-comuns" title={t.peopleSharedValuesTitle} values={shared} category={common.category} religion={sharedReligion} />
    </>
  );

  const nav: NavSection[] = [
    { id: 'cmp-paises', label: () => t.comparePageNavCountries },
    { id: 'cmp-personalidades', label: () => t.peopleNavPersonalities },
    ...(showParties ? [{ id: 'cmp-partidos', label: () => t.comparePageNavParties }] : []),
    ...(hasValues ? [{ id: 'cmp-valores', label: () => t.peopleNavValues }] : []),
    ...(shared.length > 0 ? [{ id: 'cmp-valores-comuns', label: () => t.peopleNavSharedValues }] : [])
  ];
  return { nearby, nav };
}
