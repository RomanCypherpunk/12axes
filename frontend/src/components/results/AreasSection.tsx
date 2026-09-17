import { CategoryPersonalityCard } from './CategoryPersonalityCard';
import { t } from '../../i18n';
import type { PersonalityMatch } from '../../types/quiz';

interface AreasSectionProps {
  matches: PersonalityMatch[];
}

// A personalidade mais compativel de CADA area de atuacao, da area que mais
// combina com o usuario para a que menos combina. Nenhuma fica de fora.
export function AreasSection({ matches }: AreasSectionProps) {
  if (matches.length === 0) {
    return null;
  }

  return (
    <section className="results-section" id="areas">
      <div className="section-heading">
        <h2>{t.areasSectionTitle}</h2>
      </div>
      <p className="block-note">{t.areasSectionNote}</p>

      <div className="category-grid">
        {matches.map((match) => (
          <CategoryPersonalityCard key={match.personalityId} match={match} />
        ))}
      </div>
    </section>
  );
}
