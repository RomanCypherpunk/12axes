import { useState, type KeyboardEvent } from 'react';
import { t } from '../../i18n';
import type { Axis, AxisResult, CountryDimensionMatch, CountryMatch } from '../../types/quiz';
import { resolveCountryFlagSrc } from '../../utils/countryFlags';
import { SafeImg } from '../editorial/primitives';
import { Closeness } from './Closeness';
import { InfoSheet } from './InfoSheet';
import { topAgreements } from '../../utils/agreement';
import { FarList, SimilarityNote } from './parts';
import { SheetMatch } from './SheetMatch';

interface CountriesSectionProps {
  axes: Axis[];
  results: Map<string, AxisResult>;
  current: CountryMatch;
  historical: CountryMatch;
  dimensions: CountryDimensionMatch[];
  distant: CountryMatch[];
}

function caption(match: CountryMatch): string {
  return match.historical && match.period ? match.period : match.category;
}

function flagAlt(match: CountryMatch): string {
  return t.flagAlt(match.historical ? t.flagHistoricLabel : t.flagLabel, match.name);
}

interface Pick {
  key: string;
  label: string;
  match: CountryMatch;
}

type Direction = 'prev' | 'next';

const STAT_BARS = 4;

export function CountriesSection({ current, historical, dimensions, distant, axes, results }: CountriesSectionProps) {
  const picks: Pick[] = [
    { key: 'current', label: t.countryCurrentTab, match: current },
    { key: 'historical', label: t.countryHistoricalTab, match: historical },
    ...dimensions.map(({ dimension, match }) => ({ key: dimension, label: t.dimensionLabels[dimension], match }))
  ];
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState<Direction>('next');
  const [info, setInfo] = useState<CountryMatch | null>(null);
  const shown = picks[index];
  const select = (next: number, direction: Direction) => {
    setDir(direction);
    setIndex((next + picks.length) % picks.length);
  };
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowLeft') select(index - 1, 'prev');
    else if (event.key === 'ArrowRight') select(index + 1, 'next');
    else return;
    event.preventDefault();
  };

  return (
    <section className="e-panel" id="paises" data-reveal>
      <h2>{t.countriesSectionTitle}</h2>
      <SimilarityNote />

      <div
        className="pes"
        role="group"
        tabIndex={0}
        aria-label={t.countriesSectionTitle}
        aria-keyshortcuts="ArrowLeft ArrowRight"
        onKeyDown={onKeyDown}
      >
        <div className="pes-head">
          <button type="button" className="pes-arrow" onClick={() => select(index - 1, 'prev')} aria-label={t.pesPrev}>
            ◀
          </button>
          <span className="pes-mode">
            {shown.label}
            <small>{t.pesKeysHint}</small>
          </span>
          <button type="button" className="pes-arrow" onClick={() => select(index + 1, 'next')} aria-label={t.pesNext}>
            ▶
          </button>
        </div>

        <PesStage key={shown.key} dir={dir} match={shown.match} axes={axes} results={results} onInfo={() => setInfo(shown.match)} />

        <ul className="pes-strip">
          {picks.map((pick, i) => (
            <li key={pick.key}>
              <button
                type="button"
                className="pes-pick"
                aria-pressed={i === index}
                aria-label={t.pesPickAria(pick.label, pick.match.name)}
                onClick={() => select(i, i < index ? 'prev' : 'next')}
              >
                <SafeImg className="pes-pick-flag" src={resolveCountryFlagSrc(pick.match.flagPath)} alt="" fallback="" />
                <span>{pick.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <FarList
        title={t.countriesDistantTitle}
        items={distant.map((match) => ({
          key: match.countryId,
          name: match.name,
          caption: caption(match)
        }))}
      />
      {info && <CountryInfoSheet match={info} axes={axes} results={results} onClose={() => setInfo(null)} />}
    </section>
  );
}

function PesStage({ dir, match, axes, results, onInfo }: {
  dir: Direction;
  match: CountryMatch;
  axes: Axis[];
  results: Map<string, AxisResult>;
  onInfo: () => void;
}) {
  const rating = Math.round(match.compatibility);
  const stars = Math.round(rating / 10) / 2;

  return (
    <div className="pes-stage" data-dir={dir}>
      <div className="pes-flag">
        <SafeImg className="pes-flag-img" src={resolveCountryFlagSrc(match.flagPath)} alt={flagAlt(match)} fallback={t.flagUnavailable} />
      </div>
      <div className="pes-info">
        <p className="pes-name" title={match.name}>
          {match.name}
        </p>
        <p className="pes-cap" title={caption(match)}>
          {caption(match)}
        </p>
        <div className="pes-rating">
          <strong>
            {rating}
            <small>%</small>
          </strong>
          <span className="pes-match">{t.matchShort}</span>
          <span className="pes-stars" role="img" aria-label={t.pesStarsAria(stars)}>
            <span style={{ width: `${stars * 20}%` }} />
          </span>
        </div>
        <p className="pes-bars-title">{t.agreeTitle}</p>
        <ul className="pes-bars">
          {topAgreements(match.vector, axes, results, STAT_BARS).map((stat) => (
            <li key={stat.axisId}>
              <span>{stat.label}</span>
              <i>
                <b style={{ width: `${stat.value}%` }} />
              </i>
              <em>{stat.value}</em>
            </li>
          ))}
        </ul>
        <button type="button" className="pes-more" onClick={onInfo}>
          {t.knowMoreAbout(match.name)}
        </button>
      </div>
    </div>
  );
}

function CountryInfoSheet({ match, axes, results, onClose }: {
  match: CountryMatch;
  axes: Axis[];
  results: Map<string, AxisResult>;
  onClose: () => void;
}) {
  return (
    <InfoSheet titleId="e-country-sheet-title" onClose={onClose}>
      <div className="e-person-sheet-head">
        <SafeImg
          className="e-flagimg"
          src={resolveCountryFlagSrc(match.flagPath)}
          alt={flagAlt(match)}
          fallback={t.flagUnavailable}
        />
        <div>
          <span className="e-tag e-tag-neutral">{match.category}</span>
          <h3 id="e-country-sheet-title">{match.name}</h3>
          {match.historical && match.period && <p className="e-axis-sheet-label">{match.period}</p>}
        </div>
      </div>
      <SheetMatch compatibility={match.compatibility} />
      <p className="e-axis-sheet-text">{match.description}</p>
      <Closeness
        vector={match.vector}
        name={match.name}
        face={<SafeImg className="e-close-face" src={resolveCountryFlagSrc(match.flagPath)} alt={flagAlt(match)} fallback="" />}
        axes={axes}
        results={results}
      />
    </InfoSheet>
  );
}
