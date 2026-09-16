import { useEffect, useRef, useState } from 'react';

// Conta de 0 ate o valor final quando o elemento entra em cena.
//
// O projeto trata movimento como instrumento de medicao: o numero sobe junto
// com a barra que o representa, na mesma curva de agulha (--ease-settle) e na
// mesma duracao (--dur-measure). Com movimento reduzido o valor final aparece
// direto, sem contagem.
export function useCountUp(
  target: number,
  options: { durationMs?: number; decimals?: number; delayMs?: number } = {}
) {
  const { durationMs = 900, decimals = 1, delayMs = 0 } = options;
  const ref = useRef<HTMLElement | null>(null);
  const [value, setValue] = useState(() => (prefersReducedMotion() ? target : 0));

  useEffect(() => {
    const element = ref.current;

    if (prefersReducedMotion() || typeof IntersectionObserver === 'undefined' || !element) {
      setValue(target);
      return;
    }

    let frame = 0;
    let timeout = 0;
    let startedAt = 0;

    const step = (now: number) => {
      if (startedAt === 0) {
        startedAt = now;
      }
      const progress = Math.min(1, (now - startedAt) / durationMs);
      setValue(target * easeSettle(progress));
      if (progress < 1) {
        frame = requestAnimationFrame(step);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            observer.unobserve(entry.target);
            timeout = window.setTimeout(() => {
              frame = requestAnimationFrame(step);
            }, delayMs);
          }
        });
      },
      { threshold: 0.4 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      window.clearTimeout(timeout);
      cancelAnimationFrame(frame);
    };
  }, [target, durationMs, delayMs]);

  return { ref, text: value.toFixed(decimals) };
}

// Aproximacao da curva --ease-settle: sai rapido, chega devagar e assenta sem
// oscilar, como a agulha de um instrumento.
function easeSettle(progress: number): number {
  return 1 - Math.pow(1 - progress, 3);
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') {
    return true;
  }
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}
