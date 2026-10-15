import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { HOME_AXES } from '../../data/homeAxes';
import { LANG, setLang, t } from '../../i18n';
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
import { ArrowIcon, SiteFooter } from '../editorial/primitives';
import { ProfileFace, searchItems } from '../results/CompareSection';
import { COMPASS_GRID_CELLS, Marker, socialStripCells } from '../results/PoliticalCompassSection';

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
    window.history.replaceState(null, '', compareUrl(refs, religion));
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
          <a className="e-logo" href={home} aria-label={t.backToStartAria}>
            <b>12</b>
            <span>axes</span>
          </a>
          <div className="e-nav-actions">
            <button className="e-lang" type="button" onClick={() => setLang(LANG === 'pt' ? 'en' : 'pt')} aria-label={t.langToggleAria}>
              {t.langToggleLabel}
            </button>
            <a className="e-btn e-btn-primary e-btn-sm" href={home}>
              {t.navStart} <ArrowIcon />
            </a>
          </div>
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
                      <li className="e-dim-row" key={refKey(ref)}>
                        <span className="e-cmpp-ring" style={{ '--pc': PROFILE_COLORS[index] } as CSSProperties}>
                          {item ? <ProfileFace item={item} className="e-avatar" /> : <span className="e-avatar e-cmp-dot" aria-hidden="true" />}
                        </span>
                        <div>
                          <span className="e-dim">{t.compareTypeLabels[ref.type]}</span>
                          <strong>{item?.name ?? ref.id}</strong>
                          {!item && status === 'notFound' && catalog && <small>{t.comparePageUnknown}</small>}
                        </div>
                        <span className="e-pctc">
                          <button
                            className="e-btn e-btn-ghost e-btn-sm"
                            type="button"
                            aria-label={t.comparePageRemoveAria(item?.name ?? ref.id)}
                            onClick={() => remove(ref)}
                          >
                            {t.comparePageRemove}
                          </button>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}

              {refs.length < MAX_COMPARE && (
                <div className="e-cmp-bar">
                  <div className="e-cmp-field">
                    <input
                      ref={inputRef}
                      className="e-cmp-input"
                      type="search"
                      role="combobox"
                      aria-label={t.compareSearchLabel}
                      aria-expanded={options.length > 0}
                      aria-controls="e-cmpp-options"
                      placeholder={t.compareSearchPlaceholder}
                      value={query}
                      autoComplete="off"
                      onFocus={loadCatalog}
                      onChange={(event) => {
                        loadCatalog();
                        setQuery(event.target.value);
                      }}
                    />
                    {options.length > 0 && (
                      <ul className="e-cmp-options" id="e-cmpp-options" role="listbox">
                        {options.map((item) => (
                          <li key={refKey(item)} role="option" aria-selected={false}>
                            <button type="button" aria-label={t.compareOptionAria(item.name, t.compareTypeLabels[item.type])} onClick={() => add(item)}>
                              <ProfileFace item={item} className="e-cmp-face" />
                              <span className="e-cmp-opt-text">
                                <b>{item.name}</b>
                                <em>{item.caption}</em>
                              </span>
                              <span className="e-tag e-tag-neutral">{t.compareTypeLabels[item.type]}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                    {catalog && query.trim().length > 0 && options.length === 0 && <p className="e-cmp-empty">{t.compareNoResults}</p>}
                  </div>
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
              <li key={axis.id}>
                <div className="e-close-head">
                  <b>{axis.label}</b>
                </div>
                <div
                  className="e-close-track"
                  role="img"
                  aria-label={t.comparePageAxisAria(
                    axis.label,
                    profiles.map((profile) => `${profile.item.name} ${Math.round(profile.vector[axis.id] ?? 50)}% ${axis.leftPole}`).join(', ')
                  )}
                >
                  <span className="e-close-mid" />
                  {profiles.map((profile, index) => {
                    const value = profile.vector[axis.id] ?? 50;
                    return (
                      <span
                        key={refKey(profile.item)}
                        className="e-close-pin e-close-them e-cmpp-ring"
                        style={{ left: `${100 - value}%`, '--pc': PROFILE_COLORS[index] } as CSSProperties}
                        title={`${profile.item.name}: ${Math.round(value)}% ${axis.leftPole}`}
                      >
                        <ProfileFace item={profile.item} className="e-close-face" />
                      </span>
                    );
                  })}
                </div>
                <div className="e-close-poles">
                  <span>{axis.leftPole}</span>
                  <span>{axis.rightPole}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {points.length > 0 && (
        <section className="e-panel e-compass">
          <h2>{t.compassTitle}</h2>
          <div className="e-compass-body">
            <div className="e-compass-chart" role="img" aria-label={compassLabel}>
              <span className="e-compass-lbl is-top">{t.compassAuthoritarian}</span>
              <span className="e-compass-lbl is-left">{t.compassLeft}</span>
              <div className="e-compass-grid">
                {COMPASS_GRID_CELLS.map((color, index) => (
                  <span key={index} style={{ background: color }} />
                ))}
                <i className="e-compass-axis is-x" aria-hidden="true" />
                <i className="e-compass-axis is-y" aria-hidden="true" />
                {points.map((point) => (
                  <Marker key={point.key} left={point.position.right} top={100 - point.position.authoritarian} color={point.color} />
                ))}
              </div>
              <span className="e-compass-lbl is-right">{t.compassRight}</span>
              <span className="e-compass-lbl is-bottom">{t.compassLibertarian}</span>
            </div>

            <div className="e-compass-read">
              <ul className="e-cmpp-legend" aria-label={t.comparePageLegendAria}>
                {points.map((point) => (
                  <li key={point.key}>
                    <Marker left={0} color={point.color} />
                    {point.label}
                  </li>
                ))}
              </ul>
              <div className="e-compass-bar" aria-hidden="true">
                <div className="e-compass-bar-lbls">
                  <span>{t.compassProgressive}</span>
                  <span>{t.compassTraditionalist}</span>
                </div>
                <div className="e-compass-strip">
                  {socialStripCells(moralAxis).map((color, index) => (
                    <span key={index} style={{ background: color }} />
                  ))}
                  {points.map((point) => (
                    <Marker key={point.key} left={point.position.traditional} color={point.color} />
                  ))}
                </div>
              </div>
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
              <li className="e-dim-row" key={`${pair.first}-${pair.second}`}>
                <span className="e-cmpp-faces">
                  <span className="e-cmpp-ring" style={{ '--pc': PROFILE_COLORS[pair.first] } as CSSProperties}>
                    <ProfileFace item={first} className="e-avatar" />
                  </span>
                  <span className="e-cmpp-ring" style={{ '--pc': PROFILE_COLORS[pair.second] } as CSSProperties}>
                    <ProfileFace item={second} className="e-avatar" />
                  </span>
                </span>
                <div>
                  <span className="e-dim">{t.comparePagePairLabel}</span>
                  <strong>
                    {first.name} × {second.name}
                  </strong>
                </div>
                <span className="e-pctc">{Math.round(pair.compatibility)}%</span>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
