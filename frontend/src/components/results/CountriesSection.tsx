import { useState } from 'react';
import { t } from '../../i18n';
import type { CountryDimensionMatch, CountryMatch } from '../../types/quiz';
import { resolveCountryFlagSrc } from '../../utils/countryFlags';
import { SafeImg } from '../editorial/primitives';
import { InfoSheet } from './InfoSheet';
import { DimList, FarList, MatchHero, Tabs } from './parts';

interface CountriesSectionProps {
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

export function CountriesSection({ current, historical, dimensions, distant }: CountriesSectionProps) {
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
        kicker={t.countryKicker}
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
          caption: caption(match),
          compatibility: match.compatibility
        }))}
      />
      {info && <CountryInfoSheet match={info} onClose={() => setInfo(null)} />}
    </section>
  );
}

function CountryInfoSheet({ match, onClose }: { match: CountryMatch; onClose: () => void }) {
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
      <p className="e-person-sheet-pct">
        <strong>{Math.round(match.compatibility)}%</strong> {t.matchWord}
      </p>
      <p className="e-axis-sheet-text">{match.description}</p>
    </InfoSheet>
  );
}
