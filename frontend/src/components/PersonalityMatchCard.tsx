import { useState } from 'react';
import { t } from '../i18n';
import type { PersonalityMatch } from '../types/quiz';
import { personalityInitials, resolvePersonalityImageSrc } from '../utils/personalityImage';

interface PersonalityMatchCardProps {
  match: PersonalityMatch;
}

export function PersonalityMatchCard({ match }: PersonalityMatchCardProps) {
  const pct = Math.max(0, Math.min(100, match.compatibility));
  const imageSrc = resolvePersonalityImageSrc(match.imagePath);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showImage = Boolean(imageSrc) && failedSrc !== imageSrc;

  return (
    <article className="personality-match-card">
      <div className={`personality-match-visual${showImage ? '' : ' is-missing'}`}>
        {showImage ? (
          <img
            src={imageSrc}
            alt={t.portraitAlt(match.name)}
            loading="lazy"
            onError={() => setFailedSrc(imageSrc)}
          />
        ) : (
          <div className="personality-match-initials" role="img" aria-label={t.portraitUnavailableAria(match.name)}>
            <span>{personalityInitials(match.name)}</span>
          </div>
        )}
      </div>
      <div className="personality-match-content">
        <div className="personality-match-heading">
          <div>
            <span className="personality-match-kicker">{t.personalityKicker}</span>
            <h2>{match.name}</h2>
          </div>
          <span className="personality-match-score">{pct.toFixed(0)}% {t.matchWord}</span>
        </div>
        <div className="personality-match-meta">
          <span>{match.role}</span>
          {match.lifespan && <span>{match.lifespan}</span>}
        </div>
        <p>{match.description}</p>
      </div>
    </article>
  );
}
