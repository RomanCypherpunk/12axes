import { t } from '../../i18n';
import type { IdeologyMatch } from '../../types/quiz';

// A frase que a ideologia do topo diria sobre a sociedade que quer. Vem curada
// no catalogo, uma por ideologia, na estrutura cultura / politica / economia.
export function PhraseSection({ match }: { match: IdeologyMatch }) {
  if (!match.phrase) {
    return null;
  }

  const [before, after] = t.phraseNote(match.name).split(match.name);

  return (
    <figure className="e-panel e-phrase" data-reveal>
      <span className="e-q" aria-hidden="true">“</span>
      <div>
        <p className="e-eyebrow">{t.phraseTitle}</p>
        <blockquote>{match.phrase}</blockquote>
        <figcaption>
          {before}
          <b>{match.name}</b>
          {after}
        </figcaption>
      </div>
    </figure>
  );
}
