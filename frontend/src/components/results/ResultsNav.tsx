import { useEffect, useState } from 'react';
import { t } from '../../i18n';
import { LockIcon } from './LockIcon';

const SECTIONS = [
  { id: 'eixos-resultado', label: () => t.resultsNavAxes },
  { id: 'assinatura', label: () => t.resultsNavSignature },
  { id: 'paises', label: () => t.resultsNavCountries },
  { id: 'personalidades', label: () => t.resultsNavPersonalities },
  { id: 'areas', label: () => t.resultsNavAreas },
  { id: 'livros', label: () => t.resultsNavBooks },
  { id: 'partidos', label: () => t.resultsNavParties },
  { id: 'valores', label: () => t.resultsNavValues },
  { id: 'ideologias', label: () => t.resultsNavIdeologies },
  { id: 'bussola', label: () => t.resultsNavCompass },
  // A análise completa (seções pagas, ou o convite): o id muda conforme haja acesso (premiumTarget).
  { id: 'analise-completa', label: () => t.resultsNavReport }
];

// Sem livros recomendados, sem partidos ou sem os eixos da bússola, a seção não é renderizada: o item some e a numeração se ajusta.
interface ResultsNavProps {
  hasBooks?: boolean;
  hasCompass?: boolean;
  hasParties?: boolean;
  hasValues?: boolean;
  /** Id da seção que abre a análise completa (a primeira seção paga, ou o convite); null quando não há compra nem acesso. */
  premiumTarget?: string | null;
  /** Sem acesso: o item "Análise completa" aparece apagado (com um cadeado) e leva ao convite. */
  premiumLocked?: boolean;
}

export function ResultsNav({ hasBooks = true, hasCompass = true, hasParties = true, hasValues = true, premiumTarget = null, premiumLocked = false }: ResultsNavProps) {
  const sections = SECTIONS.filter(
    ({ id }) =>
      (id !== 'livros' || hasBooks) &&
      (id !== 'bussola' || hasCompass) &&
      (id !== 'partidos' || hasParties) &&
      (id !== 'valores' || hasValues) &&
      (id !== 'analise-completa' || premiumTarget !== null)
  ).map((section) => (section.id === 'analise-completa' ? { ...section, id: premiumTarget as string } : section));
  const [active, setActive] = useState(SECTIONS[0].id);
  const observedIds = sections.map(({ id }) => id).join(',');

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

    observedIds.split(',').forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [observedIds]);

  return (
    <nav className="e-panel e-toc" aria-label={t.navOnThisPage}>
      <p>{t.navOnThisPage}</p>
      {sections.map(({ id, label }, index) => (
        <a
          key={id}
          href={`#${id}`}
          className={[active === id ? 'e-on' : '', premiumLocked && id === premiumTarget ? 'e-toc-locked' : ''].filter(Boolean).join(' ') || undefined}
        >
          <span>{String(index + 1).padStart(2, '0')}</span>
          {label()}
          {premiumLocked && id === premiumTarget && (
            <LockIcon className="e-toc-lock" />
          )}
        </a>
      ))}
    </nav>
  );
}
