import { useEffect } from 'react';

// Revela elementos marcados com [data-reveal] quando entram na viewport.
// Usa uma unica IntersectionObserver para a arvore inteira e para de observar
// cada elemento depois do primeiro reveal — a animacao nao se repete ao rolar
// de volta. Elementos ja visiveis no primeiro paint sao revelados de imediato.
export function useScrollReveal(enabled: boolean = true, deps: unknown[] = []) {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') {
      return;
    }

    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]:not([data-revealed])'));

    if (targets.length === 0) {
      return;
    }

    // Sem IntersectionObserver (ou com movimento reduzido) tudo aparece direto:
    // o conteudo nunca pode ficar invisivel por causa da animacao.
    if (prefersReduced || typeof IntersectionObserver === 'undefined') {
      targets.forEach((target) => target.setAttribute('data-revealed', ''));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.setAttribute('data-revealed', '');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.08 }
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ...deps]);
}
