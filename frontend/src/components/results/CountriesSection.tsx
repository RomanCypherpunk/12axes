import { useState } from 'react';
import { CountryMatchCard } from '../CountryMatchCard';
import { DistantCard } from './DistantCard';
import { t } from '../../i18n';
import type { CountryMatch } from '../../types/quiz';

interface CountriesSectionProps {
  current: CountryMatch;
  historical: CountryMatch;
  distant: CountryMatch[];
}

export function CountriesSection({ current, historical, distant }: CountriesSectionProps) {
  const [tab, setTab] = useState<'current' | 'historical'>('current');
  const shown = tab === 'current' ? current : historical;

  return (
    <section className="results-section" id="paises">
      <div className="section-heading">
        <h2>{t.countriesSectionTitle}</h2>
      </div>

      <div className="results-tabs" role="tablist" aria-label={t.countriesSectionTitle}>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'current'}
          onClick={() => setTab('current')}
        >
          {t.countryCurrentTab}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'historical'}
          onClick={() => setTab('historical')}
        >
          {t.countryHistoricalTab}
        </button>
      </div>

      <CountryMatchCard key={shown.countryId} match={shown} />

      <div className="distant-block">
        <h3>{t.countriesDistantTitle}</h3>
        <div className="distant-grid">
          {distant.map((match) => (
            <DistantCard
              key={match.countryId}
              name={match.name}
              caption={match.historical && match.period ? match.period : match.category}
              compatibility={match.compatibility}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
