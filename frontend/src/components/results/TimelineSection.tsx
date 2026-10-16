import { useState } from 'react';
import { t } from '../../i18n';
import type { Axis, AxisResult, CountryMatch, PartyMatch, PersonalityMatch, TimelineEntry, TimelineEra } from '../../types/quiz';
import { resolveCountryFlagSrc } from '../../utils/countryFlags';
import { resolvePartyLogoSrc } from '../../utils/partyLogos';
import { personalityInitials, resolvePersonalityImageSrc } from '../../utils/personalityImage';
import { Ring, SafeImg } from '../editorial/primitives';
import { CountryInfoSheet, flagAlt } from './CountriesSection';
import { PartyInfoSheet } from './PartiesSection';
import { PersonalityInfoSheet } from './PersonalitiesSection';

interface TimelineSectionProps {
  timeline: TimelineEra[];
  axes: Axis[];
  results: Map<string, AxisResult>;
}

type Selected =
  | { type: 'personality'; match: PersonalityMatch }
  | { type: 'country'; match: CountryMatch }
  | { type: 'party'; match: PartyMatch };

interface EntryView {
  key: string;
  name: string;
  /** Data: vida da personalidade ou período do país (países atuais, "Atual"). */
  date: string;
  photo: JSX.Element;
  selected: Selected;
}

/** Dados de exibição de um perfil da linha do tempo (compartilhados com o relatório em PDF). */
export interface TimelineEntryInfo {
  key: string;
  name: string;
  /** Vida da personalidade, período do país histórico ou "Atual". */
  date: string;
  /** Retrato, bandeira ou logo já resolvido, para <img>. */
  imageSrc: string;
  /** Logos de partido são quadrados 1:1 sobre fundo claro; retratos e bandeiras preenchem o círculo. */
  isLogo: boolean;
}

export function timelineEntryInfo(entry: TimelineEntry): TimelineEntryInfo | null {
  if (entry.type === 'personality' && entry.personality) {
    const match = entry.personality;
    return {
      key: `p-${match.personalityId}`,
      name: match.name,
      date: match.lifespan,
      imageSrc: resolvePersonalityImageSrc(match.imagePath),
      isLogo: false
    };
  }
  if (entry.type === 'country' && entry.country) {
    const match = entry.country;
    return {
      key: `c-${match.countryId}`,
      name: match.name,
      date: match.historical && match.period ? match.period : t.timelineCurrent,
      imageSrc: resolveCountryFlagSrc(match.flagPath),
      isLogo: false
    };
  }
  if (entry.type === 'party' && entry.party) {
    const match = entry.party;
    return {
      key: `o-${match.partyId}`,
      name: match.name,
      date: match.historical && match.period ? match.period : t.timelineCurrent,
      imageSrc: resolvePartyLogoSrc(match.logoPath),
      isLogo: true
    };
  }
  return null;
}

function viewOf(entry: TimelineEntry): EntryView | null {
  const info = timelineEntryInfo(entry);
  if (!info) return null;
  if (entry.type === 'personality' && entry.personality) {
    const match = entry.personality;
    return {
      key: info.key,
      name: info.name,
      date: info.date,
      photo: (
        <SafeImg
          className="e-tl-photo"
          src={resolvePersonalityImageSrc(match.imagePath)}
          alt={t.portraitAlt(match.name)}
          fallback={personalityInitials(match.name)}
        />
      ),
      selected: { type: 'personality', match }
    };
  }
  if (entry.type === 'country' && entry.country) {
    const match = entry.country;
    return {
      key: info.key,
      name: info.name,
      date: info.date,
      photo: <SafeImg className="e-tl-photo e-tl-flag" src={resolveCountryFlagSrc(match.flagPath)} alt={flagAlt(match)} fallback="" />,
      selected: { type: 'country', match }
    };
  }
  if (entry.type === 'party' && entry.party) {
    const match = entry.party;
    return {
      key: info.key,
      name: info.name,
      date: info.date,
      photo: <SafeImg className="e-tl-photo e-tl-logo" src={info.imageSrc} alt={t.partyLogoAlt(match.name)} fallback="" />,
      selected: { type: 'party', match }
    };
  }
  return null;
}

function entryCompatibility(entry: TimelineEntry): number {
  return (entry.personality ?? entry.country ?? entry.party)?.compatibility ?? 0;
}

/**
 * Compatibilidade da era (média dos 10 perfis mais compatíveis, calculada no backend). Se a API
 * ainda não trouxer o campo, cai na média dos perfis exibidos para nunca mostrar NaN.
 */
export function eraCompatibility(era: TimelineEra): number {
  if (Number.isFinite(era.compatibility)) return era.compatibility;
  if (era.entries.length === 0) return 0;
  return era.entries.reduce((sum, entry) => sum + entryCompatibility(entry), 0) / era.entries.length;
}

/** Era com a maior compatibilidade; empate: a mais antiga. */
export function bestTimelineEra(timeline: TimelineEra[]): TimelineEra | null {
  let best: TimelineEra | null = null;
  for (const era of timeline) {
    if (era.entries.length > 0 && (best === null || eraCompatibility(era) > eraCompatibility(best))) {
      best = era;
    }
  }
  return best;
}

// Linha do tempo das ideias: em cada era, os 4 perfis (personalidades e países juntos) mais
// compatíveis (2 por era, até 2 personalidades, 1 país e 1 partido), só com foto, nome e data. No desktop as eras formam um quadro completo, sem
// paginação; no mobile viram uma linha vertical contínua.
/** Perfis exibidos na lista da era: os 2 destaques (se a API ainda não os trouxer, os 2 primeiros). */
export function eraHighlights(era: TimelineEra): TimelineEntry[] {
  return era.highlights ?? era.entries.slice(0, 2);
}

export function TimelineSection({ timeline, axes, results }: TimelineSectionProps) {
  const [info, setInfo] = useState<Selected | null>(null);
  const best = bestTimelineEra(timeline);
  const bestCompatibility = best ? eraCompatibility(best) : 0;

  return (
    <section className="e-panel e-tl" id="linha-do-tempo" data-reveal>
      <h2>{t.timelineSectionTitle}</h2>

      <ol className="e-tl-eras">
        {timeline.map((era) => (
          <li key={era.key} className="e-tl-era">
            <div className="e-tl-head">
              <h3>{t.timelineEraNames[era.key]}</h3>
              <p>{t.timelineRange(era.fromYear, era.toYear)}</p>
            </div>
            <ul className="e-tl-list">
              {eraHighlights(era).map((entry) => {
                const view = viewOf(entry);
                if (!view) return null;
                return (
                  <li key={view.key}>
                    <button
                      type="button"
                      className="e-tl-item"
                      aria-label={t.personalityInfoAria(view.name)}
                      onClick={() => setInfo(view.selected)}
                    >
                      {view.photo}
                      <span className="e-tl-text">
                        <strong>{view.name}</strong>
                        <small>{view.date}</small>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ol>

      {best && (
        <article className="e-match e-tl-best">
          <div className="e-match-top">
            <div className="e-tl-mosaic" aria-hidden="true">
              {best.entries.map((entry) => {
                const info = timelineEntryInfo(entry);
                return info ? (
                  <SafeImg
                    key={info.key}
                    className={info.isLogo ? 'e-tl-tile e-tl-tile-logo' : 'e-tl-tile'}
                    src={info.imageSrc}
                    alt=""
                    fallback=""
                  />
                ) : null;
              })}
            </div>
            <div className="e-match-info">
              <div className="e-match-tags">
                <span className="e-tag e-tag-cat e-match-pill">
                  {Math.round(bestCompatibility)}% {t.matchWord}
                </span>
              </div>
              <span className="e-dim">{t.timelineBestEra}</span>
              <h3>{t.timelineEraNames[best.key]}</h3>
              <p>{t.timelineRange(best.fromYear, best.toYear)}</p>
            </div>
            <Ring pct={bestCompatibility} size={104} stroke={6} />
          </div>
        </article>
      )}

      {info?.type === 'personality' && (
        <PersonalityInfoSheet match={info.match} axes={axes} results={results} onClose={() => setInfo(null)} />
      )}
      {info?.type === 'country' && (
        <CountryInfoSheet match={info.match} axes={axes} results={results} onClose={() => setInfo(null)} />
      )}
      {info?.type === 'party' && (
        <PartyInfoSheet match={info.match} axes={axes} results={results} onClose={() => setInfo(null)} />
      )}
    </section>
  );
}
