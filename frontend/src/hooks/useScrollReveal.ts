import { useEffect } from 'react';

// Revela elementos marcados com [data-reveal] quando entram na viewport.
// Usa uma unica IntersectionObserver para a arvore inteira e para de observar
// cada elemento depois do primeiro reveal — a animacao nao se repete ao rolar
// de volta. Elementos ja visiveis no primeiro paint sao revelados de imediato.
//
// O conteudo pode chegar depois do efeito rodar: a tela de resultados monta
// seus cards via lazy/Suspense, entao no primeiro passe nao existe nenhum
// [data-reveal] no DOM. Por isso o hook tambem observa mutacoes da arvore e
// passa a observar o que aparecer mais tarde — sem isso o conteudo tardio
// ficaria preso em opacity: 0.
export function useScrollReveal(enabled: boolean = true, deps: unknown[] = []) {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') {
      return;
    }

    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

    const revealNow = (target: HTMLElement) => target.setAttribute('data-revealed', '');
    const pending = () =>
      Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]:not([data-revealed])'));

    // Sem IntersectionObserver (ou com movimento reduzido) tudo aparece direto:
    // o conteudo nunca pode ficar invisivel por causa da animacao.
    if (prefersReduced || typeof IntersectionObserver === 'undefined') {
      pending().forEach(revealNow);
      const fallbackMutations = new MutationObserver(() => pending().forEach(revealNow));
      fallbackMutations.observe(document.body, { childList: true, subtree: true });
      return () => fallbackMutations.disconnect();
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

    const observePending = () => pending().forEach((target) => observer.observe(target));
    observePending();

    // Conteudo que monta depois (lazy, Suspense, troca de tela) entra na
    // observacao assim que aparece.
    const mutations = new MutationObserver(observePending);
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      mutations.disconnect();
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ...deps]);
}
