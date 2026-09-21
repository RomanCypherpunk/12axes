import { useState } from 'react';
import { t } from '../../i18n';
import type { CountryDimensionMatch } from '../../types/quiz';
import { resolveCountryFlagSrc } from '../../utils/countryFlags';
import { CountUpValue } from './CountUpValue';

interface CountryDimensionCardProps {
  entry: CountryDimensionMatch;
}

// Equivalente ao card de dimensão das personalidades, mas sem separar
// visualmente países atuais de experiências históricas: ambos participam da
// comparação por dimensão.
export function CountryDimensionCard({ entry }: CountryDimensionCardProps) {
  const { dimension, match } = entry;
  const pct = Math.max(0, Math.min(100, match.compatibility));
  const flagSrc = resolveCountryFlagSrc(match.flagPath);
  const [failedFlagSrc, setFailedFlagSrc] = useState<string | null>(null);
  const showFlag = Boolean(flagSrc) && failedFlagSrc !== flagSrc;

  return (
    <article className="dimension-card country-dimension-card">
      <span className="dimension-label">{t.dimensionLabels[dimension]}</span>

      <div className="dimension-card-visual country-dimension-flag">
        {showFlag ? (
          <img
            src={flagSrc}
            alt={t.flagAlt(match.historical ? t.flagHistoricLabel : t.flagLabel, match.name)}
            loading="lazy"
            onError={() => setFailedFlagSrc(flagSrc)}
          />
        ) : (
          <div className="dimension-card-initials" role="img" aria-label={t.flagUnavailableAria(match.name)}>
            <span>{t.flagUnavailable}</span>
          </div>
        )}
      </div>

      <h4>{match.name}</h4>
      <p className="dimension-role">{match.historical && match.period ? match.period : match.category}</p>
      <span className="dimension-score"><CountUpValue value={pct} decimals={0} /></span>
    </article>
  );
}
