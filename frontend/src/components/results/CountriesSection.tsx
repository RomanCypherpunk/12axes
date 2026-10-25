import { useState, type ReactNode } from 'react';
import { t } from '../../i18n';
import type { Axis, AxisResult, CountryDimensionMatch, CountryMatch, ProfileDimension } from '../../types/quiz';
import { resolveCountryFlagSrc } from '../../utils/countryFlags';
import { SafeImg } from '../editorial/primitives';
import { Closeness } from './Closeness';
import { InfoSheet } from './InfoSheet';
import { DimList, FarList, MatchHero, Tabs, type DimItem, type FarItem } from './parts';
import { SheetMatch } from './SheetMatch';

interface CountriesSectionProps {
  axes: Axis[];
  results: Map<string, AxisResult>;
  current: CountryMatch;
  historical: CountryMatch;
  dimensions: CountryDimensionMatch[];
  distant: CountryMatch[];
  /** Para reusar a seção fora dos resultados (página de comparação entre pessoas). */
  title?: string;
  id?: string;
  header?: ReactNode;
}

function caption(match: CountryMatch): string {
  return match.historical && match.period ? match.period : match.category;
}

export function flagAlt(match: CountryMatch): string {
  return t.flagAlt(match.historical ? t.flagHistoricLabel : t.flagLabel, match.name);
}

/** Card do país mais compatível (aba atual ou histórica). */
export function CountryHero({ match }: { match: CountryMatch }) {
  return (
    <MatchHero
      visual={<SafeImg className="e-flagbig" src={resolveCountryFlagSrc(match.flagPath)} alt={flagAlt(match)} fallback={t.flagUnavailable} />}
      compatibility={match.compatibility}
      name={match.name}
      tags={[match.category, match.historical ? match.period : ''].filter(Boolean)}
      description={match.description}
    />
  );
}

export function countryDimItems(dimensions: CountryDimensionMatch[], onInfo?: (match: CountryMatch, dimension: ProfileDimension) => void): DimItem[] {
  return dimensions.map(({ dimension, match }) => ({
    key: dimension,
    visual: <SafeImg className="e-flagimg" src={resolveCountryFlagSrc(match.flagPath)} alt={flagAlt(match)} fallback={t.flagUnavailable} />,
    label: t.dimensionLabels[dimension],
    name: match.name,
    caption: caption(match),
    compatibility: match.compatibility,
    infoLabel: t.personalityInfoAria(match.name),
    onInfo: onInfo && (() => onInfo(match, dimension))
  }));
}

export function countryFarItems(distant: CountryMatch[]): FarItem[] {
  return distant.map((match) => ({ key: match.countryId, name: match.name, caption: caption(match) }));
}

export function CountriesSection({ current, historical, dimensions, distant, axes, results, title, id, header }: CountriesSectionProps) {
  const [tab, setTab] = useState<'current' | 'historical'>('current');
  const shown = tab === 'current' ? current : historical;
  const [info, setInfo] = useState<CountryMatch | null>(null);

  return (
    <section className="e-panel" id={id ?? 'paises'} data-reveal>
      <h2>{title ?? t.countriesSectionTitle}</h2>
      {header}
      <Tabs
        label={title ?? t.countriesSectionTitle}
        value={tab}
        onChange={setTab}
        options={[
          { value: 'current', label: t.countryCurrentTab },
          { value: 'historical', label: t.countryHistoricalTab }
        ]}
      />

      <CountryHero key={shown.countryId} match={shown} />

      <DimList items={countryDimItems(dimensions, setInfo)} />

      <FarList title={t.countriesDistantTitle} items={countryFarItems(distant)} />
      {info && <CountryInfoSheet match={info} axes={axes} results={results} onClose={() => setInfo(null)} />}
    </section>
  );
}

export function CountryInfoSheet({ match, axes, results, onClose }: {
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
