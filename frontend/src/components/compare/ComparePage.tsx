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
import { CompareSearchField, ProfileFace, searchItems } from '../results/CompareSection';
import { CompassChart, SocialStrip, compassOutlines, socialStripCells } from '../results/PoliticalCompassSection';
import { PARTIES_ENABLED } from '../../utils/partyLogos';
import { CompareAxes, profileColor } from './CompareAxes';
import { CompareCountries, CompareIdeologies, CompareParties } from './CompareNearby';
import { CompareSignature } from './CompareSignature';
import { colorOf, PROFILE_COLORS, spectrumColor } from './profileColors';

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
    if (refs.length === 0) {
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

  // Cor do espectro de cada perfil escolhido (o vetor vem da API; até lá vale a cor da posição).
  const refColor = (ref: CompareRef, index: number): string =>
    spectrumColor(data?.profiles.profiles.find((profile) => refKey(profile.item) === refKey(ref))?.vector, PROFILE_COLORS[index]);

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
        <div className="e-wrap e-res-grid">
          <div className="e-res-main">
            <header className="e-res-head">
              <p className="e-eyebrow">{t.comparePageEyebrow}</p>
              <h1>{t.comparePageTitle}</h1>
            </header>

            <section className="e-panel" id="cmp-perfis">
              <h2 ref={headingRef} tabIndex={-1}>
                {t.comparePageProfilesTitle}
              </h2>
              {refs.length > 0 && (
                <ul className="e-cp-cards">
                  {refs.map((ref, index) => {
                    const item = itemFor(ref);
                    const name = item?.name ?? ref.id;
                    return (
                      <li className="e-cp-card" key={refKey(ref)} style={profileColor(refColor(ref, index))}>
                        <button
                          className="e-cp-remove"
                          type="button"
                          aria-label={t.comparePageRemoveAria(name)}
                          title={t.comparePageRemove}
                          onClick={() => remove(ref)}
                        >
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M6 6l12 12M18 6 6 18" />
                          </svg>
                        </button>
                        <span className="e-cmpp-ring e-cp-face">
                          {item ? <ProfileFace item={item} className="e-avatar" /> : <span className="e-avatar e-cmp-dot" aria-hidden="true" />}
                        </span>
                        <div className="e-cp-text">
                          <span className="e-cp-type">{t.compareTypeLabels[ref.type]}</span>
                          <strong>{name}</strong>
                          {!item && status === 'notFound' && catalog && <small>{t.comparePageUnknown}</small>}
                        </div>
                      </li>
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

          <aside className="e-side" aria-label={t.navOnThisPage}>
            <CompareNav data={shown} />
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

type NavSection = { id: string; label: () => string };

/** Índice lateral da página, no mesmo molde do índice dos resultados (com a seção em foco destacada). */
function CompareNav({ data }: { data: CompareProfiles | null }) {
  const sections: NavSection[] = [];
  if (data) {
    sections.push(
      { id: 'cmp-ideologia', label: () => t.comparePageNavIdeologies },
      { id: 'cmp-eixos', label: () => t.comparePageNavAxes },
      { id: 'cmp-assinatura', label: () => t.comparePageNavSignature }
    );
    if (data.profiles.some((profile) => profile.nearest?.country)) {
      sections.push({ id: 'cmp-paises', label: () => t.comparePageNavCountries });
    }
    if (PARTIES_ENABLED && data.profiles.some((profile) => profile.nearest?.party)) {
      sections.push({ id: 'cmp-partidos', label: () => t.comparePageNavParties });
    }
    sections.push({ id: 'cmp-bussola', label: () => t.comparePageNavCompass }, { id: 'cmp-pares', label: () => t.comparePageNavCompatibility });
  }
  const ids = sections.map((section) => section.id).join(',');
  const [active, setActive] = useState<string | undefined>(sections[0]?.id);

  useEffect(() => {
    if (!ids) return;
    setActive((current) => (current && ids.split(',').includes(current) ? current : ids.split(',')[0]));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length > 0) setActive(visible[0].target.id);
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    ids.split(',').forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, [ids]);

  if (sections.length === 0) return null;
  return (
    <nav className="e-panel e-toc" aria-label={t.navOnThisPage}>
      <p>{t.navOnThisPage}</p>
      {sections.map(({ id, label }, index) => (
        <a key={id} href={`#${id}`} className={active === id ? 'e-on' : undefined}>
          <span>{String(index + 1).padStart(2, '0')}</span>
          {label()}
        </a>
      ))}
    </nav>
  );
}

function CompareResults({ profiles: { profiles, pairs, commonIdeology = null }, axes }: { profiles: CompareProfiles; axes: typeof HOME_AXES }) {
  const moralAxis = axes.find((axis) => axis.id === 'moral');
  const itemByKey = new Map(profiles.map((profile) => [refKey(profile.item), profile.item]));
  const points = compassPoints(
    profiles.map((profile, index) => ({
      key: refKey(profile.item),
      label: profile.item.name,
      color: colorOf(profile, index),
      vector: profile.vector
    }))
  ).map((point) => ({ ...point, item: itemByKey.get(point.key)!, outlines: compassOutlines(point.position, moralAxis) }));
  const compassLabel = t.comparePageCompassAria(
    points
      .map(({ label, position }) =>
        t.comparePagePointAria(label, Math.round(position.right), Math.round(position.authoritarian), Math.round(position.traditional))
      )
      .join('; ')
  );
  const face = (item: CompareItem) => <ProfileFace item={item} className="e-compass-img" />;

  return (
    <>
      <CompareIdeologies profiles={profiles} common={commonIdeology} />
      <CompareAxes axes={axes} profiles={profiles} />
      <CompareSignature axes={axes} profiles={profiles} />
      <CompareCountries profiles={profiles} />
      {PARTIES_ENABLED && <CompareParties profiles={profiles} />}

      {points.length > 0 && (
        <section className="e-panel e-compass" id="cmp-bussola">
          <h2>{t.compassTitle}</h2>
          <div className="e-compass-body">
            <CompassChart
              ariaLabel={compassLabel}
              markers={points.map((point) => ({
                key: point.key,
                left: point.position.right,
                top: 100 - point.position.authoritarian,
                face: face(point.item),
                outline: point.outlines.region,
                title: point.label
              }))}
            />

            <div className="e-compass-read">
              <ul className="e-cmpp-legend" aria-label={t.comparePageLegendAria}>
                {points.map((point) => (
                  <li key={point.key}>
                    <span className="e-compass-x e-compass-face is-static" style={{ '--oc': point.outlines.region } as CSSProperties}>
                      {face(point.item)}
                    </span>
                    {point.label}
                  </li>
                ))}
              </ul>
              <SocialStrip
                cells={socialStripCells(moralAxis)}
                markers={points.map((point) => ({
                  key: point.key,
                  left: point.position.traditional,
                  face: face(point.item),
                  outline: point.outlines.social,
                  title: point.label
                }))}
              />
            </div>
          </div>
        </section>
      )}

      <section className="e-panel" id="cmp-pares">
        <h2>{t.comparePagePairsTitle}</h2>
        <ul className="e-cp-pairs">
          {pairs.map((pair) => {
            const first = profiles[pair.first].item;
            const second = profiles[pair.second].item;
            const value = Math.round(pair.compatibility);
            const colors = `${colorOf(profiles[pair.first], pair.first)}, ${colorOf(profiles[pair.second], pair.second)}`;
            return (
              <li className="e-cp-pair" key={`${pair.first}-${pair.second}`}>
                <span className="e-cp-duo">
                  <span className="e-cmpp-ring" style={profileColor(colorOf(profiles[pair.first], pair.first))}>
                    <ProfileFace item={first} className="e-avatar" />
                  </span>
                  <span className="e-cmpp-ring" style={profileColor(colorOf(profiles[pair.second], pair.second))}>
                    <ProfileFace item={second} className="e-avatar" />
                  </span>
                </span>
                <div className="e-cp-pair-main">
                  <strong>
                    {first.name} <span aria-hidden="true">×</span> {second.name}
                  </strong>
                  <span className="e-cp-meter" role="img" aria-label={t.compatibilityAria(String(value))}>
                    <i style={{ width: `${value}%`, background: `linear-gradient(90deg, ${colors})` }} />
                  </span>
                </div>
                <p className="e-cp-pair-pct">
                  {value}
                  <small>%</small>
                </p>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
