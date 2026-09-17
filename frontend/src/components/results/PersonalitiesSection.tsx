import { PersonalityMatchCard } from '../PersonalityMatchCard';
import { DimensionCard } from './DimensionCard';
import { DistantCard } from './DistantCard';
import { t } from '../../i18n';
import type { DimensionMatch, PersonalityMatch } from '../../types/quiz';

interface PersonalitiesSectionProps {
  top: PersonalityMatch;
  dimensions: DimensionMatch[];
  distant: PersonalityMatch[];
}

export function PersonalitiesSection({ top, dimensions, distant }: PersonalitiesSectionProps) {
  return (
    <section className="results-section" id="personalidades">
      <div className="section-heading">
        <h2>{t.personalitiesSectionTitle}</h2>
      </div>

      <PersonalityMatchCard match={top} />

      {dimensions.length > 0 && (
        <div className="category-block">
          <h3>{t.dimensionsTitle}</h3>
          <div className="dimension-grid">
            {dimensions.map((entry) => (
              <DimensionCard key={entry.dimension} entry={entry} />
            ))}
          </div>
        </div>
      )}

      <div className="distant-block">
        <h3>{t.personalitiesDistantTitle}</h3>
        <div className="distant-grid">
          {distant.map((match) => (
            <DistantCard
              key={match.personalityId}
              name={match.name}
              caption={match.role}
              compatibility={match.compatibility}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
