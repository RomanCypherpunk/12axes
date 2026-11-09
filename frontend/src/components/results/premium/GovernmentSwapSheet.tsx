import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { t } from '../../../i18n';
import { fetchCompare, fetchCompareCatalog } from '../../../services/quizApi';
import type { CompareItem, GovernmentSeat, PersonalityMatch } from '../../../types/quiz';
import { searchItems } from '../../../utils/compareSearch';
import { catStyle } from '../../../utils/ideologyColors';
import { personalityInitials, resolvePersonalityImageSrc } from '../../../utils/personalityImage';
import { SafeImg } from '../../editorial/primitives';
import { InfoSheet } from '../InfoSheet';
import { Portrait } from '../PersonalitiesSection';
import { P } from './premiumText';

interface Props {
  seat: GovernmentSeat;
  /** As opções já filtradas (sem a atual e sem quem ocupa outra cadeira). */
  options: PersonalityMatch[];
  /** O cargo está ocupado por uma escolha do usuário, não pela sugestão. */
  swapped: boolean;
  category: string;
  /** Quem já ocupa alguma cadeira (a busca não oferece essas pessoas de novo). */
  takenIds: string[];
  /** Posição do usuário em cada eixo, na ordem dos eixos, para pedir a compatibilidade de quem ele buscar; sem ela não há busca. */
  userPercents: number[] | null;
  /** `found` só vem quando a pessoa foi achada na busca (as sugestões já têm todos os dados no relatório). */
  onPick: (personalityId: string, found?: PersonalityMatch) => void;
  onClose: () => void;
}

const pct = (match: PersonalityMatch) => Math.round(match.compatibility);

/** Escolher outra figura da mesma categoria para um cargo do governo ideal. */
export function GovernmentSwapSheet({ seat, options, swapped, category, takenIds, userPercents, onPick, onClose }: Props) {
  const seatName = P.seats[seat.seatKey];
  const categoryName = t.personalityCategories[seat.category as keyof typeof t.personalityCategories] ?? seat.category;
  const [query, setQuery] = useState('');
  const [catalog, setCatalog] = useState<CompareItem[] | 'error' | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);
  // O catálogo é o mesmo da comparação (cacheado): todas as personalidades, de qualquer categoria, e a busca roda no navegador.
  const canSearch = userPercents !== null;
  useEffect(() => {
    if (!canSearch) return;
    let cancelled = false;
    fetchCompareCatalog()
      .then((items) => {
        if (!cancelled) setCatalog(items.filter((item) => item.type === 'personality'));
      })
      .catch(() => {
        if (!cancelled) setCatalog('error');
      });
    return () => {
      cancelled = true;
    };
  }, [canSearch]);
  const found = useMemo(() => {
    if (!Array.isArray(catalog) || !query.trim()) return [];
    const taken = new Set(takenIds);
    return searchItems(
      catalog.filter((item) => !taken.has(item.id)),
      query,
      6
    );
  }, [catalog, query, takenIds]);

  const pickFound = (item: CompareItem) => {
    if (!userPercents || busyId) return;
    setBusyId(item.id);
    setFailed(false);
    fetchCompare('personality', item.id, userPercents)
      .then((detail) => {
        if (!alive.current) return;
        onPick(item.id, {
          personalityId: item.id,
          name: item.name,
          role: item.caption,
          category: item.category as PersonalityMatch['category'],
          lifespan: '',
          description: detail.description,
          imagePath: item.imagePath ?? '',
          compatibility: detail.compatibility,
          vector: detail.vector,
          spectrum: detail.spectrum ?? null
        });
      })
      .catch(() => {
        if (!alive.current) return;
        setBusyId(null);
        setFailed(true);
      });
  };
  return (
    <InfoSheet titleId="government-swap-title" className="e-gov-swap-sheet" style={catStyle(category) as CSSProperties} onClose={onClose}>
      <div className="e-gov-swap-body">
        <h3 id="government-swap-title">{P.governmentSwap.title(seatName)}</h3>
        <p className="e-gov-swap-lead">{P.governmentSwap.lead(categoryName)}</p>

        <div className="e-gov-swap-current">
          <Portrait match={seat.holder} className="e-gov-swap-face" />
          <span>
            <small>{swapped ? P.governmentSwap.swapped : P.governmentSwap.current}</small>
            <b>{seat.holder.name}</b>
            <em>
              {pct(seat.holder)}% {t.matchWord}
            </em>
          </span>
        </div>

        {options.length === 0 ? (
          <p className="e-gov-swap-none">{P.governmentSwap.none}</p>
        ) : (
          <ul className="e-gov-swap-list">
            {options.map((option) => (
              <li key={option.personalityId}>
                <button type="button" onClick={() => onPick(option.personalityId)}>
                  <Portrait match={option} className="e-gov-swap-face" />
                  <span>
                    <b>{option.name}</b>
                    <small>{[option.role, option.lifespan].filter(Boolean).join(' · ')}</small>
                  </span>
                  <em>
                    {pct(option)}% {t.matchWord}
                  </em>
                </button>
              </li>
            ))}
          </ul>
        )}

        {canSearch && (
          <div className="e-gov-swap-search">
            <label htmlFor="government-swap-search">{P.governmentSwap.searchLabel}</label>
            <input
              id="government-swap-search"
              type="search"
              value={query}
              placeholder={P.governmentSwap.searchPlaceholder}
              autoComplete="off"
              maxLength={60}
              disabled={catalog === 'error'}
              onChange={(event) => {
                setQuery(event.target.value);
                setFailed(false);
              }}
            />
            {(catalog === 'error' || failed) && <p className="e-gov-swap-none">{P.governmentSwap.searchError}</p>}
            {query.trim() && Array.isArray(catalog) && found.length === 0 && <p className="e-gov-swap-none">{P.governmentSwap.searchNone}</p>}
            {found.length > 0 && (
              <ul className="e-gov-swap-list">
                {found.map((item) => (
                  <li key={item.id}>
                    <button type="button" disabled={busyId !== null} onClick={() => pickFound(item)}>
                      <SafeImg
                        className="e-gov-swap-face"
                        src={resolvePersonalityImageSrc(item.imagePath ?? '')}
                        alt={t.portraitAlt(item.name)}
                        fallback={personalityInitials(item.name)}
                      />
                      <span>
                        <b>{item.name}</b>
                        <small>{item.caption}</small>
                      </span>
                      {busyId === item.id && <em>{P.governmentSwap.searching}</em>}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </InfoSheet>
  );
}
