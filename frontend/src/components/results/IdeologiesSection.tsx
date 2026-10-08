import { useState, type CSSProperties } from 'react';
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
  const [openId, setOpenId] = useState<string | null>(null);
  const columns = others.map((match) => (!openId || match.ideologyId === openId ? '1fr' : '0fr')).join(' ');

  return (
    <section className="e-panel" id="ideologias" data-reveal>
      <h2>{t.otherMatches}</h2>
      <ul className={openId ? 'e-others is-open' : 'e-others'} style={{ gridTemplateColumns: columns }}>
        {others.map((match) => {
          const open = openId === match.ideologyId;
          const hidden = Boolean(openId) && !open;
          const text = match.longDescription || match.description;
          return (
            <li
              className={open ? 'e-ocard is-open' : hidden ? 'e-ocard is-hidden' : 'e-ocard'}
              key={match.ideologyId}
              style={localCatStyle(match.category) as CSSProperties}
              aria-hidden={hidden}
            >
              <span className="e-tag e-osolid">{match.category}</span>
              <h3 className={match.name.length >= 18 ? 'e-long-name' : undefined}>{match.name}</h3>
              <div className="e-ocard-more">
                <p className="e-ocard-text">{text}</p>
              </div>
              <button
                type="button"
                className="e-morebtn"
                aria-expanded={open}
                tabIndex={hidden ? -1 : undefined}
                onClick={() => setOpenId(open ? null : match.ideologyId)}
              >
                {open ? t.showLess : t.knowMoreAbout(match.name)}
              </button>
            </li>
          );
        })}
      </ul>

      <div className="e-distant" style={localCatStyle(distant.category) as CSSProperties}>
        <p className="e-sub">{t.ideologyDistantTitle}</p>
        <strong>{distant.name}</strong>
        <span className="e-tag" style={{ background: distantColor.bg, color: distantColor.base }}>
          {distant.category}
        </span>
        <More name={distant.name} text={distant.longDescription || distant.description} />
      </div>
    </section>
  );
}

function More({ name, text }: { name: string; text: string }) {
  if (!text) {
    return null;
  }
  return (
    <details className="e-more">
      <summary>{t.knowMoreAbout(name)}</summary>
      <p>{text}</p>
    </details>
  );
}
