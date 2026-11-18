import { Fragment, useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import type { QuestionTerm } from '../types/quiz';

interface GlossaryTextProps {
  text: string;
  terms?: QuestionTerm[];
}

type Mode = 'hover' | 'focus' | 'click';

interface Active {
  index: number;
  mode: Mode;
}

const CLOSE_DELAY_MS = 120;

/** Descarta trechos fora do texto ou sobrepostos, para o render nunca quebrar com dado ruim. */
export function validTerms(text: string, terms: QuestionTerm[] = []): QuestionTerm[] {
  const sorted = [...terms].sort((a, b) => a.start - b.start);
  const result: QuestionTerm[] = [];
  let cursor = 0;
  for (const term of sorted) {
    if (term.start < cursor || term.end <= term.start || term.end > text.length) continue;
    result.push(term);
    cursor = term.end;
  }
  return result;
}

/**
 * Texto da pergunta com os termos difíceis sublinhados. Passar o mouse, focar com o teclado
 * ou tocar abre uma definição curta; Esc, toque fora ou sair do termo fecham.
 * O tooltip é posicionado em relação ao elemento pai (que precisa ser `position: relative`).
 */
export function GlossaryText({ text, terms }: GlossaryTextProps) {
  const items = validTerms(text, terms);
  const tooltipId = useId();
  const [active, setActive] = useState<Active | null>(null);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const termRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const closeTimer = useRef<number | undefined>(undefined);

  const cancelClose = useCallback(() => window.clearTimeout(closeTimer.current), []);
  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setActive((current) => (current?.mode === 'hover' ? null : current)), CLOSE_DELAY_MS);
  }, [cancelClose]);

  // A pergunta seguinte reaproveita o componente: o tooltip anterior não pode sobreviver.
  useEffect(() => {
    setActive(null);
  }, [text]);

  useEffect(() => cancelClose, [cancelClose]);

  useEffect(() => {
    if (!active) return undefined;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActive(null);
    };
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Element | null;
      if (!target?.closest('.glossary-term, .glossary-tooltip')) setActive(null);
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [active]);

  // O efeito depende do índice (um número), não do objeto `active`: o objeto muda de identidade a cada atualização de
  // modo (foco, hover, clique) e fazia o efeito rodar de novo e de novo ("Maximum update depth exceeded", issue #439).
  const activeIndex = active ? active.index : -1;
  useLayoutEffect(() => {
    const term = activeIndex >= 0 ? termRefs.current[activeIndex] : null;
    const container = term?.offsetParent as HTMLElement | null;
    if (!term || !container) {
      setPosition(null);
      return;
    }
    // O termo é inline e pode quebrar em várias linhas: o balão ancora na esquerda da primeira
    // linha e abre abaixo da última.
    const rects = term.getClientRects();
    const first = rects[0];
    const last = rects[rects.length - 1];
    if (!first || !last) {
      setPosition(null);
      return;
    }
    const box = container.getBoundingClientRect();
    const tooltipWidth = Math.min(300, container.clientWidth);
    const left = Math.max(0, Math.min(first.left - box.left, container.clientWidth - tooltipWidth));
    const top = last.bottom - box.top + 10;
    // Só troca o estado quando a posição mudou: um objeto novo a cada passada refaria o render e este efeito sem parar.
    setPosition((current) => (current && current.top === top && current.left === left ? current : { top, left }));
  }, [activeIndex, text]);

  if (items.length === 0) return <>{text}</>;

  const activeTerm = active ? items[active.index] : undefined;
  const nodes: Array<string | JSX.Element> = [];
  let cursor = 0;
  items.forEach((term, index) => {
    if (term.start > cursor) nodes.push(text.slice(cursor, term.start));
    const isActive = active?.index === index;
    const toggle = () => setActive((current) => (current?.index === index && current.mode === 'click' ? null : { index, mode: 'click' }));
    // <span role="button"> e não <button>: o botão é uma caixa inline-block, que admite quebra de
    // linha logo depois dele e deixava o "." final sozinho na linha. O span quebra como texto.
    nodes.push(
      <span
        key={`${term.start}-${term.end}`}
        ref={(element) => {
          termRefs.current[index] = element;
        }}
        role="button"
        tabIndex={0}
        className={isActive ? 'glossary-term is-active' : 'glossary-term'}
        aria-describedby={isActive ? tooltipId : undefined}
        aria-expanded={isActive}
        onPointerEnter={(event) => {
          if (event.pointerType !== 'mouse') return;
          cancelClose();
          setActive((current) => (current?.mode === 'click' ? current : { index, mode: 'hover' }));
        }}
        onPointerLeave={(event) => {
          if (event.pointerType === 'mouse') scheduleClose();
        }}
        onFocus={() => setActive((current) => current ?? { index, mode: 'focus' })}
        onBlur={() => setActive(null)}
        onClick={toggle}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            toggle();
          }
        }}
      >
        {text.slice(term.start, term.end)}
      </span>
    );
    cursor = term.end;
  });
  if (cursor < text.length) nodes.push(text.slice(cursor));

  return (
    <>
      {nodes.map((node, index) => (typeof node === 'string' ? <Fragment key={`t${index}`}>{node}</Fragment> : node))}
      {activeTerm && position && (
        <span
          id={tooltipId}
          role="tooltip"
          className="glossary-tooltip"
          style={{ top: position.top, left: position.left } as CSSProperties}
          onPointerEnter={cancelClose}
          onPointerLeave={(event) => {
            if (event.pointerType === 'mouse') scheduleClose();
          }}
        >
          <strong>{activeTerm.term}</strong>
          <span>{activeTerm.definition}</span>
        </span>
      )}
    </>
  );
}
