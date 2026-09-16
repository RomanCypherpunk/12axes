import { useState } from 'react';
import { t } from '../../i18n';
import type { PersonalityMatch } from '../../types/quiz';
import { personalityInitials, resolvePersonalityImageSrc } from '../../utils/personalityImage';

interface CategoryPersonalityCardProps {
  match: PersonalityMatch;
}

// Card de grade: borda fina e sem sombra, um peso visual abaixo do destaque.
export function CategoryPersonalityCard({ match }: CategoryPersonalityCardProps) {
  const pct = Math.max(0, Math.min(100, match.compatibility));
  const imageSrc = resolvePersonalityImageSrc(match.imagePath);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showImage = Boolean(imageSrc) && failedSrc !== imageSrc;

  return (
    <article className="category-card">
      <span className="category-badge">{t.personalityCategories[match.category]}</span>
      <div className="category-card-visual">
        {showImage ? (
          <img
            src={imageSrc}
            alt={t.portraitAlt(match.name)}
            loading="lazy"
            onError={() => setFailedSrc(imageSrc)}
          />
        ) : (
          <div className="category-card-initials" role="img" aria-label={t.portraitUnavailableAria(match.name)}>
            <span>{personalityInitials(match.name)}</span>
          </div>
        )}
      </div>
      <h4>{match.name}</h4>
      <p>{match.role}</p>
      <span className="category-score">{pct.toFixed(0)}%</span>
    </article>
  );
}
