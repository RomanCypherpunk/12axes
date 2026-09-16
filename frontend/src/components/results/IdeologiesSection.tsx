import { IdeologyMatchCard } from '../IdeologyMatchCard';
import { DistantCard } from './DistantCard';
import { t } from '../../i18n';
import type { IdeologyMatch } from '../../types/quiz';

interface IdeologiesSectionProps {
  others: IdeologyMatch[];
  distant: IdeologyMatch;
}

export function IdeologiesSection({ others, distant }: IdeologiesSectionProps) {
  return (
    <section className="results-section" id="ideologias">
      <div className="section-heading">
        <span className="eyebrow">{t.proximityEyebrow}</span>
        <h2>{t.otherMatches}</h2>
      </div>

      <div className="match-grid">
        {others.map((match) => (
          <IdeologyMatchCard key={match.ideologyId} match={match} />
        ))}
      </div>

      <div className="distant-block">
        <h3>{t.ideologyDistantTitle}</h3>
        <div className="distant-grid distant-grid-single">
          <DistantCard
            name={distant.name}
            caption={distant.category}
            compatibility={distant.compatibility}
          />
        </div>
      </div>
    </section>
  );
}
