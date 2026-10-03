import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { t } from '../../i18n';
import { fetchCompare, fetchCompareCatalog } from '../../services/quizApi';
import type { Axis, AxisResult, CompareDetail, CompareItem } from '../../types/quiz';
import { compareAxes, summaryKinds, type CompareAxisRow } from '../../utils/compareAxes';
import { resolveCountryFlagSrc } from '../../utils/countryFlags';
import { resolveIdeologyColor } from '../../utils/ideologyColors';
import { personalityInitials, resolvePersonalityImageSrc } from '../../utils/personalityImage';
import type { Religion } from '../../utils/religion';
import { SafeImg } from '../editorial/primitives';
import { InfoSheet } from './InfoSheet';

const MAX_OPTIONS = 8;

interface CompareSectionProps {
  axes: Axis[];
  results: Map<string, AxisResult>;
  religion?: Religion | null;
  /** Categoria da ideologia principal do usuário; define a cor do marcador "você". */
  userCategory: string;
}

// Sem acento e minúsculo, para a busca achar "Sao Paulo" digitando "são paulo".
function fold(text: string): string {
  return text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
}

function searchItems(items: CompareItem[], query: string): CompareItem[] {
  const needle = fold(query.trim());
  if (!needle) return [];
  const starts: CompareItem[] = [];
  const contains: CompareItem[] = [];
  for (const item of items) {
    const name = fold(item.name);
    if (name.startsWith(needle)) starts.push(item);
    else if (name.includes(needle)) contains.push(item);
  }
  return [...starts, ...contains].slice(0, MAX_OPTIONS);
}

// Personalidade = retrato; país = bandeira; ideologia = bolinha na cor do espectro.
function ProfileFace({ item, className }: { item: CompareItem; className: string }) {
  if (item.type === 'personality') {
    return (
      <SafeImg
        className={className}
        src={resolvePersonalityImageSrc(item.imagePath ?? undefined)}
        alt={t.portraitAlt(item.name)}
        fallback={personalityInitials(item.name)}
      />
    );
  }
  if (item.type === 'country') {
    return (
      <SafeImg
        className={className}
        src={resolveCountryFlagSrc(item.imagePath ?? '')}
        alt={t.flagAlt(item.historical ? t.flagHistoricLabel : t.flagLabel, item.name)}
        fallback={t.flagUnavailable}
      />
    );
  }
  return <span className={`${className} e-cmp-dot`} style={{ background: resolveIdeologyColor(item.category).base }} aria-hidden="true" />;
}

export function CompareSection({ axes, results, religion, userCategory }: CompareSectionProps) {
  const [catalog, setCatalog] = useState<CompareItem[] | null>(null);
  const [catalogReligion, setCatalogReligion] = useState<Religion | null | undefined>(undefined);
  const [catalogError, setCatalogError] = useState(false);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<CompareItem | null>(null);
  const [detail, setDetail] = useState<CompareDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const requestRef = useRef(0);
  const detailCache = useRef(new Map<string, Promise<CompareDetail>>());

  // O catálogo muda com a religião (perfis "only"), então recarrega se ela mudar.
  useEffect(() => {
    if (catalogReligion !== undefined && catalogReligion !== (religion ?? null)) {
      setCatalog(null);
      setCatalogReligion(undefined);
      setSelected(null);
    }
  }, [religion, catalogReligion]);

  const loadCatalog = () => {
    if (catalog || catalogReligion !== undefined) return;
    setCatalogReligion(religion ?? null);
    setCatalogError(false);
    fetchCompareCatalog(religion ?? null)
      .then(setCatalog)
      .catch(() => {
        setCatalogError(true);
        setCatalogReligion(undefined);
      });
  };

  const options = useMemo(() => (catalog && !selected ? searchItems(catalog, query) : []), [catalog, query, selected]);
  const userPercents = useMemo(() => axes.map((axis) => results.get(axis.id)?.leftPercent ?? 50), [axes, results]);

  // A comparação começa a carregar assim que o perfil é escolhido, enquanto o usuário
  // ainda vai até o botão; "Visualizar" só espera o que faltar (quase sempre nada).
  const detailFor = (item: CompareItem): Promise<CompareDetail> => {
    const key = `${item.type}:${item.id}:${userPercents.join(',')}`;
    let pending = detailCache.current.get(key);
    if (!pending) {
      pending = fetchCompare(item.type, item.id, userPercents);
      pending.catch(() => detailCache.current.delete(key));
      detailCache.current.set(key, pending);
    }
    return pending;
  };

  const view = async () => {
    if (!selected) return;
    const request = ++requestRef.current;
    setLoading(true);
    setError(false);
    try {
      const next = await detailFor(selected);
      if (request === requestRef.current) setDetail(next);
    } catch {
      if (request === requestRef.current) setError(true);
    } finally {
      if (request === requestRef.current) setLoading(false);
    }
  };

  const choose = (item: CompareItem) => {
    setSelected(item);
    setQuery(item.name);
    setError(false);
    void detailFor(item).catch(() => undefined);
  };

  const showEmpty = Boolean(catalog) && !selected && query.trim().length > 0 && options.length === 0;

  return (
    <section className="e-panel" id="comparar" data-reveal>
      <p className="e-eyebrow">{t.compareEyebrow}</p>
      <h2>{t.compareTitle}</h2>
      <p className="e-lead e-cmp-lead">{t.compareLead}</p>

      <div className="e-cmp-bar">
        <div className="e-cmp-field">
          <input
            className="e-cmp-input"
            type="search"
            role="combobox"
            aria-label={t.compareSearchLabel}
            aria-expanded={options.length > 0}
            aria-controls="e-cmp-options"
            placeholder={t.compareSearchPlaceholder}
            value={query}
            autoComplete="off"
            onFocus={loadCatalog}
            onChange={(event) => {
              loadCatalog();
              setQuery(event.target.value);
              setSelected(null);
            }}
          />
          {options.length > 0 && (
            <ul className="e-cmp-options" id="e-cmp-options" role="listbox">
              {options.map((item) => (
                <li key={`${item.type}-${item.id}`} role="option" aria-selected={false}>
                  <button type="button" aria-label={t.compareOptionAria(item.name, t.compareTypeLabels[item.type])} onClick={() => choose(item)}>
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
          {showEmpty && <p className="e-cmp-empty">{t.compareNoResults}</p>}
        </div>
        <button className="e-btn e-btn-primary" type="button" disabled={!selected || loading} onClick={view}>
          {loading ? t.compareLoading : t.compareView}
        </button>
      </div>
      {(error || catalogError) && <p className="inline-error" role="alert">{t.compareLoadError}</p>}

      {detail && (
        <ComparisonSheet detail={detail} axes={axes} results={results} userCategory={userCategory} onClose={() => setDetail(null)} />
      )}
    </section>
  );
}

// "Você é moralmente compatível com X": eixo com advérbio vira frase direta; os demais usam "Em {eixo}, ...".
// As frases só afirmam proximidade/distância quando os números sustentam (ver summaryKinds).
function AxisSummary({ kind, row, name }: { kind: 'closest' | 'farthest'; row: CompareAxisRow | null; name: string }): ReactNode {
  if (!row) return null;
  return (
    <div className="e-cmp-sum-item">
      <h3>{sentenceFor(kind, row, name)}</h3>
      <p className="e-axis-sheet-text">{t.compareValues(row.result.leftPole, Math.round(row.user), Math.round(row.target), name)}</p>
    </div>
  );
}

function sentenceFor(kind: 'closest' | 'farthest', row: CompareAxisRow, name: string): string {
  const adverb = t.compareAxisAdverbs[row.axis.id];
  const axisName = row.result.label.toLowerCase();
  if (kind === 'closest') {
    return adverb ? t.compareClosestLine(adverb, name) : t.compareClosestFallback(axisName, name);
  }
  return adverb ? t.compareFarthestLine(adverb, name) : t.compareFarthestFallback(axisName, name);
}

function ComparisonSheet({ detail, axes, results, userCategory, onClose }: {
  detail: CompareDetail;
  axes: Axis[];
  results: Map<string, AxisResult>;
  userCategory: string;
  onClose: () => void;
}) {
  const { item } = detail;
  const summary = compareAxes(axes, results, detail.vector);
  const kinds = summaryKinds(summary);
  const userColor = resolveIdeologyColor(userCategory).base;

  return (
    <InfoSheet titleId="e-cmp-sheet-title" className="e-cmp-sheet" onClose={onClose}>
      <div className="e-person-sheet-head">
        <ProfileFace item={item} className="e-avatar" />
        <div>
          <span className="e-tag e-tag-neutral">{t.compareTypeLabels[item.type]}</span>
          <h3 id="e-cmp-sheet-title">{item.name}</h3>
          <p className="e-axis-sheet-label">{item.caption}</p>
        </div>
      </div>
      <p className="e-person-sheet-pct">
        <strong>{Math.round(detail.compatibility)}%</strong> {t.matchWord}
      </p>
      <p className="e-axis-sheet-text">{detail.description}</p>

      <div className="e-close e-cmp-close" style={{ '--you': userColor } as CSSProperties}>
        <p className="e-close-title">{t.compareAxesTitle}</p>
        <ul>
          {summary.rows.map(({ axis, result, user, target }) => {
            const color = user >= 50 ? axis.leftColor : axis.rightColor;
            return (
              <li key={axis.id} style={{ '--ac': color } as CSSProperties}>
                <div className="e-close-head">
                  <b>{result.label}</b>
                </div>
                <div
                  className="e-close-track"
                  role="img"
                  aria-label={`${result.label}: ${t.closenessYou} ${Math.round(user)}% ${result.leftPole}, ${item.name} ${Math.round(target)}% ${result.leftPole}`}
                >
                  <span className="e-close-mid" />
                  <span className="e-close-pin e-close-them" style={{ left: `${100 - target}%` }} title={item.name}>
                    <ProfileFace item={item} className="e-close-face" />
                  </span>
                  <span className="e-close-pin e-close-you" style={{ left: `${100 - user}%` }} title={t.closenessYou}>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5Z" />
                    </svg>
                  </span>
                </div>
                <div className="e-close-poles">
                  <span>{result.leftPole}</span>
                  <span>{result.rightPole}</span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="e-cmp-summary">
        {kinds.identical ? (
          <div className="e-cmp-sum-item">
            <h3>{t.compareIdentical(item.name)}</h3>
          </div>
        ) : (
          <>
            {kinds.closest === 'close' ? (
              <AxisSummary kind="closest" row={summary.closest} name={item.name} />
            ) : (
              summary.closest && (
                <div className="e-cmp-sum-item">
                  <h3>{t.compareNearestLine(summary.closest.result.label.toLowerCase(), item.name)}</h3>
                </div>
              )
            )}
            {kinds.farthest === 'far' ? (
              <AxisSummary kind="farthest" row={summary.farthest} name={item.name} />
            ) : (
              <div className="e-cmp-sum-item">
                <h3>{t.compareNoFarLine(item.name)}</h3>
              </div>
            )}
          </>
        )}
      </div>
    </InfoSheet>
  );
}
