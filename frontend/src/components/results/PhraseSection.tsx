import { t } from '../../i18n';
import type { IdeologyMatch } from '../../types/quiz';

interface PhraseSectionProps {
  match: IdeologyMatch;
}

// A frase que a ideologia do topo diria sobre a sociedade que quer. Vem curada
// no catalogo, uma por ideologia, na estrutura cultura / politica / economia.
export function PhraseSection({ match }: PhraseSectionProps) {
  if (!match.phrase) {
    return null;
  }

  return (
    <section className="results-section" id="frase">
      <div className="section-heading">
        <h2>{t.phraseTitle}</h2>
      </div>

      <blockquote className="phrase-card">
        <p>{match.phrase}</p>
        <footer>{t.phraseNote(match.name)}</footer>
      </blockquote>
    </section>
  );
}
