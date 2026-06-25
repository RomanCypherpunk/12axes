import type { CountryMatch } from '../types/quiz';

interface CountryMatchCardProps {
  match: CountryMatch;
}

export function CountryMatchCard({ match }: CountryMatchCardProps) {
  const pct = Math.max(0, Math.min(100, match.compatibility));
  const isStrictFlag = !match.flagKind || match.flagKind === 'official-flag' || match.flagKind === 'historical-flag';
  const visualLabel = isStrictFlag ? 'Bandeira' : 'Bandeira / símbolo histórico';

  return (
    <article className="country-match-card">
      <div className="country-match-visual">
        <img src={match.flagPath} alt={`${visualLabel} de ${match.name}`} loading="lazy" />
      </div>
      <div className="country-match-content">
        <div className="country-match-heading">
          <div>
            <span className="country-match-kicker">País mais compatível</span>
            <h2>{match.name}</h2>
          </div>
          <span className="country-match-score">{pct.toFixed(0)}% match</span>
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
