import { PersonalityMatchCard } from '../PersonalityMatchCard';
import { CategoryPersonalityCard } from './CategoryPersonalityCard';
import { DistantCard } from './DistantCard';
import { t } from '../../i18n';
import type { PersonalityMatch } from '../../types/quiz';

interface PersonalitiesSectionProps {
  top: PersonalityMatch;
  byCategory: PersonalityMatch[];
  distant: PersonalityMatch[];
}

export function PersonalitiesSection({ top, byCategory, distant }: PersonalitiesSectionProps) {
  return (
    <section className="results-section" id="personalidades">
      <div className="section-heading">
        <h2>{t.personalitiesSectionTitle}</h2>
      </div>

      <PersonalityMatchCard match={top} />

      <div className="category-block">
        <h3>{t.personalitiesByAreaTitle}</h3>
        <div className="category-grid">
          {byCategory.map((match) => (
            <CategoryPersonalityCard key={match.personalityId} match={match} />
          ))}
        </div>
      </div>

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
