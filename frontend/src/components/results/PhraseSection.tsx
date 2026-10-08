import { t } from '../../i18n';
import type { IdeologyMatch } from '../../types/quiz';

// Dentro do cartao da ideologia do topo: a frase curada (uma por ideologia) e,
// recolhida, a descricao longa.
export function PhraseSection({ match }: { match: IdeologyMatch }) {
  const about = match.longDescription || match.description;

  if (!match.phrase && !about) {
    return null;
  }

  return (
    <div className="e-top-body">
      {match.phrase && (
        <figure className="e-phrase">
          <span className="e-q" aria-hidden="true">“</span>
          <div>
            <p className="e-eyebrow">{t.phraseTitle}</p>
            <blockquote>{match.phrase}</blockquote>
          </div>
        </figure>
      )}
      {about && (
        <details className="e-about">
          <summary>{t.aboutIdeology(match.name)}</summary>
          <p>{about}</p>
        </details>
      )}
    </div>
  );
}
