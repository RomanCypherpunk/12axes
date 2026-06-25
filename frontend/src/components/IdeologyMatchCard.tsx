import type { IdeologyMatch } from '../types/quiz';

interface IdeologyMatchCardProps {
  match: IdeologyMatch;
  featured?: boolean;
}

export function IdeologyMatchCard({ match, featured = false }: IdeologyMatchCardProps) {
  const pct = Math.max(0, Math.min(100, match.compatibility));
  const description = featured ? match.longDescription : match.description;

  return (
    <article className={featured ? 'match-card featured' : 'match-card'}>
      <div className="match-card-header">
        <div className="match-card-text">
          <span>{match.category}</span>
          <h3>{match.name}</h3>
        </div>
        <div
          className="compatibility-ring"
          style={{ ['--pct' as string]: pct }}
          aria-label={`Compatibilidade: ${pct.toFixed(1)} por cento`}
        >
          <span>
            {pct.toFixed(0)}%
            <small>match</small>
          </span>
        </div>
      </div>
      <p>{description}</p>
    </article>
  );
}
