import type { IdeologyMatch } from '../types/quiz';

interface IdeologyMatchCardProps {
  match: IdeologyMatch;
  featured?: boolean;
}

export function IdeologyMatchCard({ match, featured = false }: IdeologyMatchCardProps) {
  return (
    <article className={featured ? 'match-card featured' : 'match-card'}>
      <div>
        <span className="eyebrow">{match.category}</span>
        <h3>{match.name}</h3>
      </div>
      <strong className="compatibility">{match.compatibility.toFixed(1)}%</strong>
      <p>{match.description}</p>
    </article>
  );
}
