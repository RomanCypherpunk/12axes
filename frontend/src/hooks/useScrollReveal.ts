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
/** Fração do elemento que precisa estar à vista para ele aparecer. */
const REVEAL_RATIO = 0.08;

/**
 * Quando um elemento que cruzou a área de observação deve aparecer. Um bloco tão alto que 8% dele nunca cabe na tela
 * (a análise eixo a eixo do relatório pago no celular passa de 8.000 px) jamais atingiria a fração mínima e ficaria
 * invisível: ele aparece assim que a ponta dele entra, e sem animação, porque subir e esmaecer um bloco desse tamanho
 * é pesado para o celular. Os demais seguem a regra de sempre.
 */
export function revealMode(intersectionRatio: number, targetHeight: number, rootHeight: number): 'animate' | 'instant' | null {
  if (targetHeight * REVEAL_RATIO > rootHeight) return 'instant';
  return intersectionRatio >= REVEAL_RATIO ? 'animate' : null;
}

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
          if (!entry.isIntersecting) return;
          const mode = revealMode(entry.intersectionRatio, entry.boundingClientRect.height, entry.rootBounds?.height ?? window.innerHeight);
          if (!mode) return;
          // Sem animação para os blocos muito altos: a página só mostra o conteúdo.
          if (mode === 'instant') entry.target.setAttribute('data-reveal-instant', '');
          entry.target.setAttribute('data-revealed', '');
          observer.unobserve(entry.target);
        });
      },
      // O 0 garante uma chamada quando a ponta do bloco entra, que é a única que um bloco muito alto recebe.
      { rootMargin: '0px 0px -10% 0px', threshold: [0, REVEAL_RATIO] }
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
