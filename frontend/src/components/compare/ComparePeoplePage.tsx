import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { HOME_AXES } from '../../data/homeAxes';
import { LANG, t } from '../../i18n';
import type { CompareProfile, CompareProfiles, QuizResult } from '../../types/quiz';
import {
  cleanName,
  MAX_NAME_LENGTH,
  parsePeopleCompareUrl,
  peopleCompareUrl,
  personInitials,
  type PersonResult
} from '../../utils/peopleCompare';
import { ArrowIcon, Logo, SiteFooter } from '../editorial/primitives';
import { ProfileFace } from '../results/CompareSection';
import { SharePhoneStage } from '../results/SharePhoneStage';
import { profileColor } from './CompareAxes';
import { CompareNav, CompareResults } from './ComparePage';
import { buildDetail, pairProfiles, usePairResults, usePairShare, type Names } from './PairDetail';
import { colorOf, PROFILE_COLORS } from './profileColors';

const FALLBACK_NAMES: [string, string] = [t.peopleYou, t.peopleOther];
const LINK = typeof window === 'undefined' ? null : parsePeopleCompareUrl(window.location.search, FALLBACK_NAMES);

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
  const [names, setNames] = useState<Names>(LINK?.names ?? FALLBACK_NAMES);
  const [editing, setEditing] = useState<0 | 1 | null>(null);
  const [draft, setDraft] = useState('');
  const nameInput = useRef<HTMLInputElement>(null);
  const { loaded, failed } = usePairResults(LINK?.people ?? null);
  const status = loaded ? 'ready' : failed || !LINK ? 'error' : 'loading';
  useScrollReveal(true, [loaded]);

  useEffect(() => {
    document.documentElement.lang = t.htmlLang;
    document.title = t.peoplePageDocTitle;
  }, []);

  useEffect(() => {
    if (editing !== null) nameInput.current?.select();
  }, [editing]);

  // O nome é só rótulo: trocar não busca nada de novo, os perfis são remontados com o nome novo.
  const profiles = useMemo<CompareProfiles | null>(() => {
    if (!LINK || !loaded) return null;
    const [first, second] = LINK.people;
    return pairProfiles(
      [toProfile('a', names[0], first, loaded.results[0]), toProfile('b', names[1], second, loaded.results[1])],
      LINK.people,
      loaded.common
    );
  }, [loaded, names]);

  const { actions: shareActions, stage } = usePairShare(loaded, profiles, names, LINK?.people ?? null, axes);

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

  const home = LANG === 'en' ? '/en' : '/';
  const detail = loaded && profiles && LINK ? buildDetail(loaded, profiles, names, LINK.people) : null;

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

            {profiles && stage && <SharePhoneStage id="cmp-cartao" title={t.sharePreviewCompareTitle} {...stage} />}

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
