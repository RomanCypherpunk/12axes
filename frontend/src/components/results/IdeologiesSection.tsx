import type { CSSProperties } from 'react';
import { t } from '../../i18n';
import type { IdeologyMatch } from '../../types/quiz';
import { localCatStyle, resolveIdeologyColor } from '../../utils/ideologyColors';

interface IdeologiesSectionProps {
  others: IdeologyMatch[];
  distant: IdeologyMatch;
}

// Cada card veste a cor da própria categoria, não a do top match.
export function IdeologiesSection({ others, distant }: IdeologiesSectionProps) {
  const distantColor = resolveIdeologyColor(distant.category);

  return (
    <section className="e-panel" id="ideologias" data-reveal>
      <p className="e-eyebrow">{t.proximityEyebrow}</p>
      <h2>{t.otherMatches}</h2>
      <ul className="e-others">
        {others.map((match) => (
          <li className="e-ocard" key={match.ideologyId} style={localCatStyle(match.category) as CSSProperties}>
            <div className="e-ocard-head">
              <div className="e-ocard-top">
                <span className="e-tag e-osolid">{match.category}</span>
              </div>
              <h3 className={match.name.length >= 18 ? 'e-long-name' : undefined}>{match.name}</h3>
            </div>
            <p>{match.description}</p>
          </li>
        ))}
      </ul>

      <p className="e-sub">{t.ideologyDistantTitle}</p>
      <div className="e-distant">
        <strong>{distant.name}</strong>
        <span className="e-tag" style={{ background: distantColor.bg, color: distantColor.base }}>
          {distant.category}
        </span>
        <span>{Math.round(distant.compatibility)}%</span>
      </div>
    </section>
  );
}
