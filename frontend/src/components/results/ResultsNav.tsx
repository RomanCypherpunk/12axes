import { useEffect, useState } from 'react';
import { t } from '../../i18n';

const SECTIONS = [
  { id: 'eixos-resultado', label: () => t.resultsNavAxes },
  { id: 'assinatura', label: () => t.resultsNavSignature },
  { id: 'paises', label: () => t.resultsNavCountries },
  { id: 'personalidades', label: () => t.resultsNavPersonalities },
  { id: 'ideologias', label: () => t.resultsNavIdeologies },
];

// Indice da pagina: a leitura e longa e ordenada, entao os numeros marcam
// percurso, nao decoracao.
export function ResultsNav() {
  const [active, setActive] = useState(SECTIONS[0].id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length > 0) {
          setActive(visible[0].target.id);
        }
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );

    SECTIONS.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  return (
    <nav className="results-nav" aria-label={t.navOnThisPage}>
      <p className="results-nav-title">{t.navOnThisPage}</p>
      <ol>
        {SECTIONS.map(({ id, label }, index) => (
          <li key={id}>
            <a href={`#${id}`} data-active={active === id ? 'true' : undefined}>
              <span className="results-nav-index" aria-hidden="true">{index + 1}</span>
              {label()}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
