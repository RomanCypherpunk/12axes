import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { HOME_AXES } from '../../data/homeAxes';
import { LANG, t } from '../../i18n';
import { fetchSharedResult } from '../../services/quizApi';
import type { CompareProfile, CompareProfiles, IdeologyMatch, QuizResult } from '../../types/quiz';
import {
  cleanName,
  MAX_NAME_LENGTH,
  midpoint,
  pairCompatibility,
  parsePeopleCompareUrl,
  peopleCompareUrl,
  personInitials,
  type PersonResult,
  religionPreference
} from '../../utils/peopleCompare';
import { PARTIES_ENABLED } from '../../utils/partyLogos';
import { ArrowIcon, Logo, ShareImageIcon, SiteFooter } from '../editorial/primitives';
import { ProfileFace } from '../results/CompareSection';
import { SharePhoneStage, stageColors, useSharePreview } from '../results/SharePhoneStage';
import { resolveIdeologyColor } from '../../utils/ideologyColors';
import type { CompareShareData } from '../../utils/compareShareCard';
import { profileColor } from './CompareAxes';
import { CompareNav, CompareResults, type NavSection } from './ComparePage';
import { CountriesPair, PartiesPair, PersonalitiesPair, type NearbyPeople } from './ComparePeopleNearby';
import { CompareSharedValues, ComparePeopleValues } from './ComparePeopleValues';
import { colorOf, PROFILE_COLORS } from './profileColors';

const FALLBACK_NAMES: [string, string] = [t.peopleYou, t.peopleOther];
const LINK = typeof window === 'undefined' ? null : parsePeopleCompareUrl(window.location.search, FALLBACK_NAMES);

type Status = 'loading' | 'ready' | 'error';
type Names = [string, string];

interface Loaded {
  results: [QuizResult, QuizResult];
  common: IdeologyMatch;
}

// Cada pessoa vira um "perfil" da comparação: o vetor é o dela e o rosto são as iniciais do nome, na cor da sua
// ideologia mais próxima. Ideologia, país e partido mais próximos vêm do mesmo endpoint dos resultados.
function toProfile(id: string, name: string, person: PersonResult, result: QuizResult): CompareProfile {
  return {
    item: {
      type: 'ideology',
      id,
      name,
      caption: result.topMatch.name,
      category: result.topMatch.category,
      historical: false,
      initials: personInitials(name)
    },
    vector: Object.fromEntries(HOME_AXES.map((axis, index) => [axis.id, person.values[index]])),
    nearest: {
      ideology: result.topMatch,
      country: result.topCountryMatch ?? null,
      party: result.topPartyMatch ?? null
    }
  };
}

function PencilIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m5 16l-1 4l4-1L19.586 7.414a2 2 0 0 0 0-2.828l-.172-.172a2 2 0 0 0-2.828 0zM15 6l3 3m-5 11h8"
      />
    </svg>
  );
}

/**
 * /compare/people: duas pessoas, cada uma pelo link do seu resultado, lado a lado nos 12 eixos.
 * Os vetores vão na própria URL; os vizinhos de cada um vêm de /api/results/by-axes, o mesmo dos resultados.
 */
export function ComparePeoplePage() {
  const axes = useMemo(() => HOME_AXES.map((axis) => ({ ...axis, ...(t.homeAxes[axis.id] ?? {}) })), []);
  const [status, setStatus] = useState<Status>(LINK ? 'loading' : 'error');
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [names, setNames] = useState<Names>(LINK?.names ?? FALLBACK_NAMES);
  const [editing, setEditing] = useState<0 | 1 | null>(null);
  const [draft, setDraft] = useState('');
  const nameInput = useRef<HTMLInputElement>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);
  useScrollReveal(true, [loaded]);

  useEffect(() => {
    document.documentElement.lang = t.htmlLang;
    document.title = t.peoplePageDocTitle;
  }, []);

  useEffect(() => {
    if (!LINK) return;
    const [first, second] = LINK.people;
    let cancelled = false;
    Promise.all([
      fetchSharedResult(first.values, religionPreference(first)),
      fetchSharedResult(second.values, religionPreference(second)),
      fetchSharedResult(midpoint(first.values, second.values), null)
    ])
      .then(([firstResult, secondResult, commonResult]) => {
        if (cancelled) return;
        setLoaded({ results: [firstResult, secondResult], common: commonResult.topMatch });
        setStatus('ready');
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (editing !== null) nameInput.current?.select();
  }, [editing]);

  // O nome é só rótulo: trocar não busca nada de novo, os perfis são remontados com o nome novo.
  const profiles = useMemo<CompareProfiles | null>(() => {
    if (!LINK || !loaded) return null;
    const [first, second] = LINK.people;
    return {
      profiles: [toProfile('a', names[0], first, loaded.results[0]), toProfile('b', names[1], second, loaded.results[1])],
      pairs: [{ first: 0, second: 1, compatibility: pairCompatibility(first.values, second.values) }],
      commonIdeology: loaded.common
    };
  }, [loaded, names]);

  // Dados do cartão de compartilhamento (o mesmo para a prévia e para o botão).
  const shareData = useMemo<CompareShareData | null>(() => {
    if (!LINK || !loaded || !profiles) return null;
    return {
      names,
      results: loaded.results,
      values: [LINK.people[0].values, LINK.people[1].values],
      axes,
      religions: [LINK.people[0].religion, LINK.people[1].religion],
      compatibility: profiles.pairs[0].compatibility
    };
  }, [loaded, profiles, names]);

  const sharePreview = useSharePreview(async () => {
    if (!shareData) throw new Error('sem dados');
    const { createCompareSharePng } = await import('../../utils/compareShareCard');
    return createCompareSharePng(shareData);
  }, [shareData]);

  const startEdit = (index: 0 | 1) => {
    setDraft(names[index]);
    setEditing(index);
  };
  // Nome vazio volta ao padrão ("Você" / "Outra pessoa"). O link da barra de endereço acompanha o nome.
  const commitEdit = (event?: FormEvent) => {
    event?.preventDefault();
    if (editing === null || !LINK) return;
    const next: Names = [...names];
    next[editing] = cleanName(draft, FALLBACK_NAMES[editing]);
    setNames(next);
    setEditing(null);
    window.history.replaceState(null, '', peopleCompareUrl({ names: next, people: LINK.people }));
  };

  // Imagem 1080x1920 da comparação (o módulo do cartão e o html-to-image só carregam neste clique).
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

  // O mesmo botão no topo e no fim da página; o erro, se houver, aparece junto de cada um.
  const shareActions = (className: string) => (
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

  const home = LANG === 'en' ? '/en' : '/';
  const detail = loaded && profiles && LINK ? buildDetail(loaded, profiles, names, LINK.people, axes) : null;

  return (
    <div className="app-shell" data-screen="compare">
      <a className="skip-link" href="#conteudo-principal">
        {t.skipToContent}
      </a>
      <header className="ed e-nav e-cmpp-nav">
        <div className="e-wrap">
          <Logo href={home} />
          <a className="e-btn e-btn-primary e-btn-sm" href={home}>
            {t.navTakeTest} <ArrowIcon />
          </a>
        </div>
      </header>

      <main className="ed e-res e-cmpp" id="conteudo-principal" tabIndex={-1}>
        <div className="e-wrap e-res-grid">
          <div className="e-res-main">
            <header className="e-res-head">
              <h1>{t.peoplePageTitle}</h1>
              {profiles && shareActions('e-actions e-ppl-share')}
            </header>

            {!LINK && (
              <p className="inline-error" role="alert">
                {t.peoplePageBadLink}
              </p>
            )}
            {LINK && status === 'error' && (
              <p className="inline-error" role="alert">
                {t.peoplePageLoadError}
              </p>
            )}

            {LINK && (
              <section className="e-panel" id="cmp-perfis">
                <h2>{t.peoplePagePeopleTitle}</h2>
                <ul className="e-cp-cards">
                  {names.map((name, index) => {
                    const profile = profiles?.profiles[index];
                    const slot = index as 0 | 1;
                    return (
                      <li className="e-cp-card" key={index} style={profileColor(profile ? colorOf(profile, index) : PROFILE_COLORS[index])}>
                        <span className="e-cmpp-ring e-cp-face">
                          {profile ? <ProfileFace item={profile.item} className="e-avatar" /> : <span className="e-avatar e-cmp-dot" aria-hidden="true" />}
                        </span>
                        <div className="e-cp-text">
                          {editing === slot ? (
                            <form className="e-ppl-rename" onSubmit={commitEdit}>
                              <input
                                ref={nameInput}
                                className="e-ppl-rename-input"
                                aria-label={t.peopleNameInputLabel}
                                value={draft}
                                maxLength={MAX_NAME_LENGTH}
                                autoComplete="off"
                                autoFocus
                                onChange={(event) => setDraft(event.target.value)}
                                onBlur={() => commitEdit()}
                                onKeyDown={(event) => {
                                  if (event.key === 'Escape') setEditing(null);
                                }}
                              />
                            </form>
                          ) : (
                            <span className="e-ppl-nameline">
                              <strong>{name}</strong>
                              <button className="e-ppl-edit" type="button" aria-label={t.peopleRename(name)} title={t.peopleRename(name)} onClick={() => startEdit(slot)}>
                                <PencilIcon />
                              </button>
                            </span>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
                {status === 'loading' && (
                  <p className="e-cmp-empty" role="status">
                    {t.peoplePageLoading}
                  </p>
                )}
              </section>
            )}

            {profiles && (
              <div className="e-cmpp-results">
                <CompareResults profiles={profiles} axes={axes} nearby={detail?.nearby} pairsTitle={t.peoplePairsTitle} people />
              </div>
            )}

            {profiles && shareData && sharePreview.status !== 'error' && (
              <SharePhoneStage
                id="cmp-cartao"
                title={t.sharePreviewCompareTitle}
                colors={stageColors(resolveIdeologyColor(loaded!.results[0].topMatch.category), resolveIdeologyColor(loaded!.results[1].topMatch.category))}
                src={sharePreview.src}
                isSharing={isSharing}
                onShare={share}
                sectionRef={sharePreview.ref}
              />
            )}

            {profiles && shareActions('e-actions')}
          </div>

          <aside className="e-side" aria-label={t.navOnThisPage}>
            <CompareNav data={profiles} middle={detail?.nav} />
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

// Países, personalidades e partidos lado a lado (as duas pessoas ao mesmo tempo), depois os valores:
// os de cada pessoa, categoria por categoria, e (só se houver) os que as duas têm em comum.
function buildDetail(
  { results, common }: Loaded,
  { profiles }: CompareProfiles,
  names: Names,
  people: [PersonResult, PersonResult],
  axes: typeof HOME_AXES
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
      <CompareSharedValues
        id="cmp-valores-comuns"
        title={t.peopleSharedValuesTitle}
        values={shared}
        category={common.category}
        religion={sharedReligion}
      />
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
