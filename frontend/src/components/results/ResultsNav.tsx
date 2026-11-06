import { useEffect, useRef, useState } from 'react';
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
  { id: 'bussola', label: () => t.resultsNavCompass }
];

// Com acesso ao relatório pago, o item único "Análise completa" dá lugar às cinco seções dele, na ordem da página.
const PREMIUM_SECTIONS = [
  { id: 'premium-eixos', label: () => t.resultsNavAxisByAxis },
  { id: 'premium-discorda', label: () => t.resultsNavDisagree },
  { id: 'premium-governo', label: () => t.resultsNavGovernment },
  { id: 'premium-linha-do-tempo', label: () => t.resultsNavTimeline },
  { id: 'premium-paises', label: () => t.resultsNavLiving }
];

// Sem livros recomendados, sem partidos ou sem os eixos da bússola, a seção não é renderizada: o item some e a numeração se ajusta.
interface ResultsNavProps {
  hasBooks?: boolean;
  hasCompass?: boolean;
  hasParties?: boolean;
  hasValues?: boolean;
  /** Com acesso ao relatório pago: lista as cinco seções dele (11 a 15) no lugar do item único. */
  premium?: boolean;
  /** Sem acesso: id do convite à compra. O item "Análise completa" aparece apagado (com um cadeado) e leva até ele; null o esconde. */
  premiumTarget?: string | null;
}

type NavItem = { id: string; label: () => string };

export function ResultsNav({ hasBooks = true, hasCompass = true, hasParties = true, hasValues = true, premium = false, premiumTarget = null }: ResultsNavProps) {
  const base: NavItem[] = SECTIONS.filter(
    ({ id }) => (id !== 'livros' || hasBooks) && (id !== 'bussola' || hasCompass) && (id !== 'partidos' || hasParties) && (id !== 'valores' || hasValues)
  );
  const locked: NavItem[] = !premium && premiumTarget !== null ? [{ id: premiumTarget, label: () => t.resultsNavReport }] : [];
  const sections: NavItem[] = [...base, ...(premium ? PREMIUM_SECTIONS : locked)];
  const firstPremium = premium ? base.length : -1;

  const [active, setActive] = useState(SECTIONS[0].id);
  const navRef = useRef<HTMLElement>(null);
  const ids = sections.map(({ id }) => id);
  const idsKey = ids.join(',');

  // A seção ativa é a última cujo topo já passou de 40% da altura da janela. Lê o DOM a cada rolagem (e não observa elementos
  // fixos) porque as seções do relatório pago só aparecem depois que ele carrega, e porque seções muito altas não "entram" de novo.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.4;
      const list = idsKey.split(',');
      let current = list[0];
      let lastPresent = list[0];
      for (const id of list) {
        const element = document.getElementById(id);
        if (!element) continue;
        lastPresent = id;
        if (element.getBoundingClientRect().top <= line) current = id;
      }
      // No fim da página a última seção pode nunca chegar à linha: vale a última que existe.
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4) current = lastPresent;
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    // O relatório pago monta suas seções depois do carregamento, sem rolagem: reavalia uma vez quando elas chegam.
    const late = window.setTimeout(update, 1500);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.clearTimeout(late);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [idsKey]);

  // Lista mais alta que a janela: mantém o item ativo à vista dentro do próprio menu (sem rolar a página).
  useEffect(() => {
    const nav = navRef.current;
    const link = nav?.querySelector<HTMLElement>('a.e-on');
    if (!nav || !link) return;
    const top = link.offsetTop - nav.offsetTop;
    if (top < nav.scrollTop + 40) nav.scrollTop = Math.max(0, top - 40);
    else if (top + link.offsetHeight > nav.scrollTop + nav.clientHeight - 16) nav.scrollTop = top + link.offsetHeight - nav.clientHeight + 16;
  }, [active]);

  return (
    <nav ref={navRef} className={premium ? 'e-panel e-toc e-toc-premium' : 'e-panel e-toc'} aria-label={t.navOnThisPage}>
      <p className="e-toc-title">{t.navOnThisPage}</p>
      {sections.map(({ id, label }, index) => {
        const isLocked = !premium && id === premiumTarget;
        return (
          <div key={id} className="e-toc-row">
            {index === firstPremium && <p className="e-toc-group">{t.resultsNavPremiumGroup}</p>}
            <a href={`#${id}`} className={[active === id ? 'e-on' : '', isLocked ? 'e-toc-locked' : ''].filter(Boolean).join(' ') || undefined} aria-current={active === id ? 'location' : undefined}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              {label()}
              {isLocked && <LockIcon className="e-toc-lock" />}
            </a>
          </div>
        );
      })}
    </nav>
  );
}
