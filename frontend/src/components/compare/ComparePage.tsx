import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { HOME_AXES } from '../../data/homeAxes';
import { LANG, t } from '../../i18n';
import { ApiError, fetchCompareCatalog, fetchCompareProfiles } from '../../services/quizApi';
import type { CompareItem, CompareProfiles } from '../../types/quiz';
import {
  compareUrl,
  MAX_COMPARE,
  MIN_COMPARE,
  parseCompareUrl,
  refKey,
  serializeCompareItems,
  type CompareRef
} from '../../utils/compareUrl';
import { compassPoints } from '../../utils/politicalCompass';
import { ArrowIcon, Logo, SiteFooter } from '../editorial/primitives';
import { CatalogLinks, LangToggle, MenuButton, NavLinks } from '../editorial/SiteNav';
import { AxisTrackRow, TrackPin } from '../results/AxisTrack';
import { CompareSearchField, ProfileFace, searchItems } from '../results/CompareSection';
import { CountUpValue } from '../results/CountUpValue';
import { DimRow } from '../results/parts';
import { CompassChart, Marker, SocialStrip, socialStripCells } from '../results/PoliticalCompassSection';

// Uma cor por posição na comparação (marcador nas barras, "X" na bússola e legenda):
// Floresta e Carmim da identidade e o azul do eixo Estrutura, que não somem sobre os pastéis da grade.
const PROFILE_COLORS = ['#102E24', '#880912', '#2F6DC0'];

const INITIAL = typeof window === 'undefined' ? { refs: [], religion: null } : parseCompareUrl(window.location.search);

type Status = 'idle' | 'loading' | 'ready' | 'notFound' | 'error';

/**
 * /compare: de 2 a 3 perfis do catálogo lado a lado (12 eixos, bússola e compatibilidade entre pares).
 * Fica numa rota própria para o catálogo só carregar aqui, e não na página de resultados.
 */
export function ComparePage() {
  const axes = useMemo(() => HOME_AXES.map((axis) => ({ ...axis, ...(t.homeAxes[axis.id] ?? {}) })), []);
  const religion = INITIAL.religion;
  const [refs, setRefs] = useState<CompareRef[]>(INITIAL.refs);
  const [catalog, setCatalog] = useState<CompareItem[] | null>(null);
  const [catalogError, setCatalogError] = useState(false);
  const catalogRequested = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  // Depois de escolher ou remover um perfil o elemento em foco some; o foco volta para a busca
  // (ou para o título, quando a busca some por já haver 3 perfis).
  const restoreFocus = useRef(false);
  const [query, setQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [data, setData] = useState<{ key: string; profiles: CompareProfiles } | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const requestRef = useRef(0);
  const key = serializeCompareItems(refs);

  useEffect(() => {
    document.documentElement.lang = t.htmlLang;
    document.title = t.comparePageDocTitle;
  }, []);

  // O catálogo (mais de mil perfis) só é baixado quando faz falta: ao usar a busca, para dar nome
  // a um perfil sozinho (antes de haver comparação) ou para apontar qual id do link não existe.
  const loadCatalog = () => {
    if (catalogRequested.current) return;
    catalogRequested.current = true;
    setCatalogError(false);
    fetchCompareCatalog(religion)
      .then(setCatalog)
      .catch(() => {
        catalogRequested.current = false;
        setCatalogError(true);
      });
  };

  // Depois de uma falha só a busca tenta de novo (ao focar ou digitar), para não repetir sem parar.
  useEffect(() => {
    if (!catalogError && (refs.length < MIN_COMPARE || status === 'notFound')) loadCatalog();
  });

  useEffect(() => {
    if (!restoreFocus.current) return;
    restoreFocus.current = false;
    (inputRef.current ?? headingRef.current)?.focus();
  }, [refs]);

  // O link sempre reflete a comparação na tela, para recarregar ou compartilhar.
  useEffect(() => {
    window.history.replaceState(null, '', compareUrl(refs, religion, LANG));
  }, [refs, religion]);

  useEffect(() => {
    if (refs.length < MIN_COMPARE) {
      // Invalida uma busca ainda em andamento, que não vale mais para o conjunto atual.
      requestRef.current += 1;
      setStatus('idle');
      return;
    }
    if (data?.key === key) {
      setStatus('ready');
      return;
    }
    const request = ++requestRef.current;
    setStatus('loading');
    fetchCompareProfiles(refs)
      .then((profiles) => {
        if (request !== requestRef.current) return;
        setData({ key, profiles });
        setStatus('ready');
      })
      .catch((err: unknown) => {
        if (request !== requestRef.current) return;
        setStatus(err instanceof ApiError && err.status === 404 ? 'notFound' : 'error');
      });
    // `data` fica de fora de propósito: só uma troca no conjunto escolhido dispara uma nova busca.
  }, [key]);

  // Nome, retrato e legenda de cada perfil: da resposta da comparação ou, antes dela, do catálogo.
  const itemFor = (ref: CompareRef): CompareItem | null =>
    data?.profiles.profiles.find((profile) => refKey(profile.item) === refKey(ref))?.item ??
    catalog?.find((item) => refKey(item) === refKey(ref)) ??
    null;

  const chosen = new Set(refs.map(refKey));
  const options = catalog ? searchItems(catalog.filter((item) => !chosen.has(refKey(item))), query) : [];
  // Enquanto a nova comparação carrega, a anterior continua na tela (esmaecida) em vez de sumir.
  const shown = refs.length >= MIN_COMPARE && data && (status === 'ready' || status === 'loading') ? data.profiles : null;

  const add = (item: CompareItem) => {
    restoreFocus.current = true;
    setRefs((current) => (current.length >= MAX_COMPARE ? current : [...current, { type: item.type, id: item.id }]));
    setQuery('');
  };
  const remove = (ref: CompareRef) => {
    restoreFocus.current = true;
    setRefs((current) => current.filter((other) => refKey(other) !== refKey(ref)));
  };

  const home = LANG === 'en' ? '/en' : '/';

  return (
    <div className="app-shell" data-screen="compare">
      <a className="skip-link" href="#conteudo-principal">
        {t.skipToContent}
      </a>
      <header className="ed e-nav e-cmpp-nav">
        <div className="e-wrap">
          <Logo href={home} />
          <NavLinks open={isMenuOpen} onClose={() => setIsMenuOpen(false)}>
            <CatalogLinks current="compare" />
            <LangToggle />
          </NavLinks>
          <a className="e-btn e-btn-primary e-btn-sm" href={home}>
            {t.navTakeTest} <ArrowIcon />
          </a>
          <MenuButton open={isMenuOpen} onToggle={() => setIsMenuOpen((open) => !open)} />
        </div>
      </header>

      <main className="ed e-res e-cmpp" id="conteudo-principal" tabIndex={-1}>
        <div className="e-wrap">
          <div className="e-res-main">
            <header className="e-res-head">
              <p className="e-eyebrow">{t.comparePageEyebrow}</p>
              <h1>{t.comparePageTitle}</h1>
              <p className="e-lead">{t.comparePageLead}</p>
            </header>

            <section className="e-panel">
              <h2 ref={headingRef} tabIndex={-1}>
                {t.comparePageProfilesTitle}
              </h2>
              {refs.length > 0 && (
                <ul className="e-dims e-cmpp-picked">
                  {refs.map((ref, index) => {
                    const item = itemFor(ref);
                    return (
                      <DimRow
                        key={refKey(ref)}
                        visual={
                          <span className="e-cmpp-ring" style={{ '--pc': PROFILE_COLORS[index] } as CSSProperties}>
                            {item ? <ProfileFace item={item} className="e-avatar" /> : <span className="e-avatar e-cmp-dot" aria-hidden="true" />}
                          </span>
                        }
                        label={t.compareTypeLabels[ref.type]}
                        name={item?.name ?? ref.id}
                        note={!item && status === 'notFound' && catalog && <small>{t.comparePageUnknown}</small>}
                      >
                        <button
                          className="e-btn e-btn-ghost e-btn-sm"
                          type="button"
                          aria-label={t.comparePageRemoveAria(item?.name ?? ref.id)}
                          onClick={() => remove(ref)}
                        >
                          {t.comparePageRemove}
                        </button>
                      </DimRow>
                    );
                  })}
                </ul>
              )}

              {refs.length < MAX_COMPARE && (
                <div className="e-cmp-bar">
                  <CompareSearchField
                    listId="e-cmpp-options"
                    query={query}
                    options={options}
                    showEmpty={Boolean(catalog) && query.trim().length > 0 && options.length === 0}
                    inputRef={inputRef}
                    onFocus={loadCatalog}
                    onQueryChange={(value) => {
                      loadCatalog();
                      setQuery(value);
                    }}
                    onChoose={add}
                  />
                </div>
              )}
              {refs.length < MIN_COMPARE && <p className="e-cmp-empty">{t.comparePageNeedMore}</p>}
              {refs.length >= MAX_COMPARE && <p className="e-cmp-empty">{t.comparePageFull}</p>}
              {status === 'loading' && <p className="e-cmp-empty" role="status">{t.compareLoading}</p>}
              {status === 'notFound' && <p className="inline-error" role="alert">{t.comparePageNotFound}</p>}
              {(status === 'error' || catalogError) && <p className="inline-error" role="alert">{t.compareLoadError}</p>}
            </section>

            {shown && (
              <div className="e-cmpp-results" aria-busy={status === 'loading'}>
                <CompareResults profiles={shown} axes={axes} />
              </div>
            )}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function CompareResults({ profiles: { profiles, pairs }, axes }: { profiles: CompareProfiles; axes: typeof HOME_AXES }) {
  const moralAxis = axes.find((axis) => axis.id === 'moral');
  const points = compassPoints(
    profiles.map((profile, index) => ({
      key: refKey(profile.item),
      label: profile.item.name,
      color: PROFILE_COLORS[index],
      vector: profile.vector
    }))
  );
  const compassLabel = t.comparePageCompassAria(
    points
      .map(({ label, position }) =>
        t.comparePagePointAria(label, Math.round(position.right), Math.round(position.authoritarian), Math.round(position.traditional))
      )
      .join('; ')
  );

  return (
    <>
      <section className="e-panel">
        <h2>{t.comparePageAxesTitle}</h2>
        <div className="e-close">
          <ul>
            {axes.map((axis) => (
              <AxisTrackRow
                key={axis.id}
                label={axis.label}
                leftPole={axis.leftPole}
                rightPole={axis.rightPole}
                ariaLabel={t.comparePageAxisAria(
                  axis.label,
                  profiles.map((profile) => `${profile.item.name} ${Math.round(profile.vector[axis.id] ?? 50)}% ${axis.leftPole}`).join(', ')
                )}
              >
                {profiles.map((profile, index) => {
                  const value = profile.vector[axis.id] ?? 50;
                  return (
                    <TrackPin
                      key={refKey(profile.item)}
                      leftPercent={value}
                      title={`${profile.item.name}: ${Math.round(value)}% ${axis.leftPole}`}
                      className="e-cmpp-ring"
                      style={{ '--pc': PROFILE_COLORS[index] } as CSSProperties}
                    >
                      <ProfileFace item={profile.item} className="e-close-face" />
                    </TrackPin>
                  );
                })}
              </AxisTrackRow>
            ))}
          </ul>
        </div>
      </section>

      {points.length > 0 && (
        <section className="e-panel e-compass">
          <h2>{t.compassTitle}</h2>
          <div className="e-compass-body">
            <CompassChart
              ariaLabel={compassLabel}
              markers={points.map((point) => ({
                key: point.key,
                left: point.position.right,
                top: 100 - point.position.authoritarian,
                color: point.color
              }))}
            />

            <div className="e-compass-read">
              <ul className="e-cmpp-legend" aria-label={t.comparePageLegendAria}>
                {points.map((point) => (
                  <li key={point.key}>
                    <Marker left={0} color={point.color} />
                    {point.label}
                  </li>
                ))}
              </ul>
              <SocialStrip
                cells={socialStripCells(moralAxis)}
                markers={points.map((point) => ({ key: point.key, left: point.position.traditional, color: point.color }))}
              />
            </div>
          </div>
        </section>
      )}

      <section className="e-panel">
        <h2>{t.comparePagePairsTitle}</h2>
        <ul className="e-dims e-cmpp-pairs">
          {pairs.map((pair) => {
            const first = profiles[pair.first].item;
            const second = profiles[pair.second].item;
            return (
              <DimRow
                key={`${pair.first}-${pair.second}`}
                visual={
                  <span className="e-cmpp-faces">
                    <span className="e-cmpp-ring" style={{ '--pc': PROFILE_COLORS[pair.first] } as CSSProperties}>
                      <ProfileFace item={first} className="e-avatar" />
                    </span>
                    <span className="e-cmpp-ring" style={{ '--pc': PROFILE_COLORS[pair.second] } as CSSProperties}>
                      <ProfileFace item={second} className="e-avatar" />
                    </span>
                  </span>
                }
                label={t.comparePagePairLabel}
                name={`${first.name} × ${second.name}`}
              >
                <CountUpValue value={pair.compatibility} decimals={0} />
              </DimRow>
            );
          })}
        </ul>
      </section>
    </>
  );
}
