import { useState } from 'react';
import { CategoryPersonalityCard } from './CategoryPersonalityCard';
import { t } from '../../i18n';
import type { PersonalityMatch } from '../../types/quiz';

interface AreasSectionProps {
  generalMatches: PersonalityMatch[];
  areaMatches: PersonalityMatch[];
}

export function AreasSection({ generalMatches, areaMatches }: AreasSectionProps) {
  const [tab, setTab] = useState<'general' | 'area'>('general');
  const matches = tab === 'general' ? generalMatches : areaMatches;

  if (generalMatches.length === 0 && areaMatches.length === 0) {
    return null;
  }

  return (
    <section className="results-section" id="areas">
      <div className="section-heading">
        <h2>{tab === 'general' ? t.areasGeneralTitle : t.areasSectionTitle}</h2>
      </div>

      <div className="results-tabs" role="tablist" aria-label={t.areasTabsAria}>
        <button type="button" role="tab" aria-selected={tab === 'general'} onClick={() => setTab('general')}>
          {t.areasGeneralTab}
        </button>
        <button type="button" role="tab" aria-selected={tab === 'area'} onClick={() => setTab('area')}>
          {t.areasByAreaTab}
        </button>
      </div>

      <div className="category-grid">
        {matches.map((match) => (
          <CategoryPersonalityCard key={match.personalityId} match={match} />
        ))}
      </div>
    </section>
  );
}
