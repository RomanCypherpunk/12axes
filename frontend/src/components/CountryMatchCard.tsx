import { useState } from 'react';
import { t } from '../i18n';
import type { CountryMatch } from '../types/quiz';
import { flagFileName, resolveCountryFlagSrc } from '../utils/countryFlags';

interface CountryMatchCardProps {
  match: CountryMatch;
}

export function CountryMatchCard({ match }: CountryMatchCardProps) {
  const pct = Math.max(0, Math.min(100, match.compatibility));
  const percentile = Math.max(0, Math.min(100, match.compatibilityPercentile ?? 0));
  const isStrictFlag = !match.flagKind || match.flagKind === 'official-flag' || match.flagKind === 'historical-flag';
  const visualLabel = isStrictFlag ? t.flagLabel : t.flagHistoricLabel;
  const flagSrc = resolveCountryFlagSrc(match.flagPath);
  const [failedFlagSrc, setFailedFlagSrc] = useState<string | null>(null);
  const shouldShowFlag = Boolean(flagSrc) && failedFlagSrc !== flagSrc;

  return (
    <article className="country-match-card">
      <div className={`country-match-visual${shouldShowFlag ? '' : ' is-missing'}`}>
        {shouldShowFlag ? (
          <img
            src={flagSrc}
            alt={t.flagAlt(visualLabel, match.name)}
            loading="lazy"
            onError={() => setFailedFlagSrc(flagSrc)}
          />
        ) : (
          <div className="country-match-flag-fallback" role="img" aria-label={t.flagUnavailableAria(match.name)}>
            <span>{t.flagUnavailable}</span>
            {match.flagPath && <small>{flagFileName(match.flagPath)}</small>}
          </div>
        )}
      </div>
      <div className="country-match-content">
        <div className="country-match-heading">
          <div>
            <span className="country-match-kicker">{t.countryKicker}</span>
            <h2>{match.name}</h2>
          </div>
          <span className="country-match-score">
            {pct.toFixed(0)}% {t.matchWord}
            <small>{t.percentileLabel(percentile.toFixed(0))}</small>
          </span>
        </div>
        <div className="country-match-meta">
          <span>{match.category}</span>
          {match.historical && match.period && <span>{match.period}</span>}
        </div>
        <p>{match.description}</p>
        {match.flagNote && <p className="country-match-note">{match.flagNote}</p>}
      </div>
    </article>
  );
}
