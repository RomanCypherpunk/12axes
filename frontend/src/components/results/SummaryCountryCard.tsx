import { useState } from 'react';
import { t } from '../../i18n';
import type { CountryMatch } from '../../types/quiz';
import { resolveCountryFlagSrc } from '../../utils/countryFlags';
import { CountUpValue } from './CountUpValue';

interface SummaryCountryCardProps {
  match: CountryMatch;
}

// Versao compacta para o resumo: bandeira, nome e percentual, sem categoria.
export function SummaryCountryCard({ match }: SummaryCountryCardProps) {
  const pct = Math.max(0, Math.min(100, match.compatibility));
  const flagSrc = resolveCountryFlagSrc(match.flagPath);
  const [failedFlagSrc, setFailedFlagSrc] = useState<string | null>(null);
  const showFlag = Boolean(flagSrc) && failedFlagSrc !== flagSrc;

  return (
    <article className="category-card category-card-compact">
      <div className="category-card-flag">
        {showFlag ? (
          <img
            src={flagSrc}
            alt={t.flagAlt(t.flagLabel, match.name)}
            loading="lazy"
            onError={() => setFailedFlagSrc(flagSrc)}
          />
        ) : (
          <div className="category-card-initials" role="img" aria-label={t.flagUnavailableAria(match.name)}>
            <span>{t.flagUnavailable}</span>
          </div>
        )}
      </div>
      <h4>{match.name}</h4>
      <span className="category-score"><CountUpValue value={pct} decimals={0} /></span>
    </article>
  );
}
