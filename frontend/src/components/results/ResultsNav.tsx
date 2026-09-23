import { useEffect, useState } from 'react';
import { t } from '../../i18n';

const SECTIONS = [
  { id: 'eixos-resultado', label: () => t.resultsNavAxes },
  { id: 'assinatura', label: () => t.resultsNavSignature },
  { id: 'paises', label: () => t.resultsNavCountries },
  { id: 'personalidades', label: () => t.resultsNavPersonalities },
  { id: 'areas', label: () => t.resultsNavAreas },
  { id: 'ideologias', label: () => t.resultsNavIdeologies },
];

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
      { rootMargin: '-40% 0px -55% 0px' }
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
    <nav className="e-panel e-toc" aria-label={t.navOnThisPage}>
      <p>{t.navOnThisPage}</p>
      {SECTIONS.map(({ id, label }, index) => (
        <a key={id} href={`#${id}`} className={active === id ? 'e-on' : undefined}>
          <span>{String(index + 1).padStart(2, '0')}</span>
          {label()}
        </a>
      ))}
    </nav>
  );
}
