import { useEffect, useRef, useState } from 'react';

/** Tempo para o mouse sair do termo e chegar ao balão sem fechá-lo (WCAG 1.4.13). */
const CLOSE_DELAY_MS = 120;

interface OpenTerm {
  index: number;
  /** Aberto por toque/clique: só fecha com outro toque, Esc ou toque fora. */
  pinned: boolean;
}

interface TermTooltipControls {
  /** Índice do termo com o balão aberto, ou null. */
  openIndex: number | null;
  /** Registra o botão de cada termo (âncora do balão e alvo do "toque fora"). */
  setAnchor: (index: number, el: HTMLButtonElement | null) => void;
  anchorOf: (index: number) => HTMLButtonElement | undefined;
  /** Ref do balão: tocar nele não conta como "toque fora". */
  tooltipRef: React.RefObject<HTMLDivElement>;
  /** Hover e foco no termo. */
  show: (index: number) => void;
  /** Saída do hover/foco: fecha após um atraso curto, salvo se fixado. */
  scheduleHide: () => void;
  /** Mouse entrou no balão: mantém aberto. */
  cancelHide: () => void;
  /** Toque ou clique: fixa ou desafixa o balão do termo. */
  toggle: (index: number) => void;
}

// Estado do tooltip dos termos do glossário. Hover/foco abrem; toque fixa (celular
// não tem hover); Esc, toque fora ou novo toque fecham.
export function useTermTooltip(): TermTooltipControls {
  const [open, setOpen] = useState<OpenTerm | null>(null);
  const anchors = useRef(new Map<number, HTMLButtonElement>());
  const tooltipRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);

  const cancelHide = () => window.clearTimeout(closeTimer.current);

  useDismiss(
    open !== null,
    (target) => Boolean(open && anchors.current.get(open.index)?.contains(target)) || Boolean(tooltipRef.current?.contains(target)),
    () => setOpen(null)
  );
  useEffect(() => cancelHide, []);

  return {
    openIndex: open?.index ?? null,
    setAnchor: (index, el) => {
      if (el) anchors.current.set(index, el);
      else anchors.current.delete(index);
    },
    anchorOf: (index) => anchors.current.get(index),
    tooltipRef,
    show: (index) => {
      cancelHide();
      setOpen((current) => (current?.pinned ? current : { index, pinned: false }));
    },
    scheduleHide: () => {
      cancelHide();
      closeTimer.current = window.setTimeout(
        () => setOpen((current) => (current?.pinned ? current : null)),
        CLOSE_DELAY_MS
      );
    },
    cancelHide,
    toggle: (index) => {
      cancelHide();
      setOpen((current) => (current?.index === index && current.pinned ? null : { index, pinned: true }));
    }
  };
}

// Fecha com Esc ou com toque/clique fora. Os callbacks ficam em refs e são lidos na
// hora do evento: o balão só existe depois do render que abriu o tooltip.
function useDismiss(active: boolean, isInside: (target: Node) => boolean, close: () => void) {
  const callbacks = useRef({ isInside, close });
  callbacks.current = { isInside, close };

  useEffect(() => {
    if (!active) return undefined;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') callbacks.current.close();
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!callbacks.current.isInside(event.target as Node)) callbacks.current.close();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [active]);
}
