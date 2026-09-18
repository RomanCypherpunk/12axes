import { useState } from 'react';
import { t } from '../../i18n';
import type { PersonalityMatch } from '../../types/quiz';
import { personalityInitials, resolvePersonalityImageSrc } from '../../utils/personalityImage';
import { CountUpValue } from './CountUpValue';

interface SummaryPersonalityCardProps {
  match: PersonalityMatch;
}

// Versao compacta de CategoryPersonalityCard para o resumo: sem categoria nem
// cargo, so retrato, nome e percentual.
export function SummaryPersonalityCard({ match }: SummaryPersonalityCardProps) {
  const pct = Math.max(0, Math.min(100, match.compatibility));
  const imageSrc = resolvePersonalityImageSrc(match.imagePath);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showImage = Boolean(imageSrc) && failedSrc !== imageSrc;

  return (
    <article className="category-card category-card-compact">
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
      <span className="category-score"><CountUpValue value={pct} decimals={0} /></span>
    </article>
  );
}
