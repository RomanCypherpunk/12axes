import { useState } from 'react';
import { t } from '../../i18n';
import type { Axis, AxisResult, CountryDimensionMatch, CountryMatch } from '../../types/quiz';
import { resolveCountryFlagSrc } from '../../utils/countryFlags';
import { SafeImg } from '../editorial/primitives';
import { Closeness } from './Closeness';
import { InfoSheet } from './InfoSheet';
import { DimList, FarList, MatchHero, Tabs } from './parts';
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

export function CountriesSection({ current, historical, dimensions, distant, axes, results }: CountriesSectionProps) {
  const [tab, setTab] = useState<'current' | 'historical'>('current');
  const shown = tab === 'current' ? current : historical;
  const [info, setInfo] = useState<CountryMatch | null>(null);

  return (
    <section className="e-panel" id="paises" data-reveal>
      <h2>{t.countriesSectionTitle}</h2>
      <Tabs
        label={t.countriesSectionTitle}
        value={tab}
        onChange={setTab}
        options={[
          { value: 'current', label: t.countryCurrentTab },
          { value: 'historical', label: t.countryHistoricalTab }
        ]}
      />

      <MatchHero
        key={shown.countryId}
        visual={
          <SafeImg
            className="e-flagbig"
            src={resolveCountryFlagSrc(shown.flagPath)}
            alt={flagAlt(shown)}
            fallback={t.flagUnavailable}
          />
        }
        compatibility={shown.compatibility}
        name={shown.name}
        tags={[shown.category, shown.historical ? shown.period : ''].filter(Boolean)}
        description={shown.description}
      />

      <DimList
        items={dimensions.map(({ dimension, match }) => ({
          key: dimension,
          visual: (
            <SafeImg
              className="e-flagimg"
              src={resolveCountryFlagSrc(match.flagPath)}
              alt={flagAlt(match)}
              fallback={t.flagUnavailable}
            />
          ),
          label: t.dimensionLabels[dimension],
          name: match.name,
          caption: caption(match),
          compatibility: match.compatibility,
          infoLabel: t.personalityInfoAria(match.name),
          onInfo: () => setInfo(match)
        }))}
      />

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
