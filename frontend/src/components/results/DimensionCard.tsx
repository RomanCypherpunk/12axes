import { useState } from 'react';
import { t } from '../../i18n';
import type { DimensionMatch } from '../../types/quiz';
import { personalityInitials, resolvePersonalityImageSrc } from '../../utils/personalityImage';
import { CountUpValue } from './CountUpValue';

interface DimensionCardProps {
  entry: DimensionMatch;
}

export function DimensionCard({ entry }: DimensionCardProps) {
  const { dimension, match } = entry;
  const pct = Math.max(0, Math.min(100, match.compatibility));
  const imageSrc = resolvePersonalityImageSrc(match.imagePath);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showImage = Boolean(imageSrc) && failedSrc !== imageSrc;

  return (
    <article className="dimension-card">
      <span className="dimension-label">{t.dimensionLabels[dimension]}</span>

      <div className="dimension-card-visual">
        {showImage ? (
          <img
            src={imageSrc}
            alt={t.portraitAlt(match.name)}
            loading="lazy"
            onError={() => setFailedSrc(imageSrc)}
          />
        ) : (
          <div className="dimension-card-initials" role="img" aria-label={t.portraitUnavailableAria(match.name)}>
            <span>{personalityInitials(match.name)}</span>
          </div>
        )}
      </div>

      <h4>{match.name}</h4>
      <p className="dimension-role">{match.role}</p>
      <span className="dimension-score"><CountUpValue value={pct} decimals={0} /></span>
    </article>
  );
}
