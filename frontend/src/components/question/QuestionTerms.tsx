import { useLayoutEffect, useState, type CSSProperties, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import type { QuestionTerm } from '../../types/quiz';
import { splitByTerms } from '../../utils/questionTerms';
import { placeTooltip, type Placement } from '../../utils/tooltipPlacement';
import { useTermTooltip } from './useTermTooltip';

interface HighlightedQuestionTextProps {
  questionId: string;
  text: string;
  terms: readonly QuestionTerm[];
}

/**
 * Texto da pergunta com os termos do glossário sublinhados. Cada termo é um botão
 * que mostra a definição num tooltip (ver useTermTooltip para o comportamento).
 */
export function HighlightedQuestionText({ questionId, text, terms }: HighlightedQuestionTextProps) {
  const tip = useTermTooltip();
  const tooltipId = `term-tip-${questionId}`;
  const anchor = tip.openIndex === null ? undefined : tip.anchorOf(tip.openIndex);

  return (
    <>
      {splitByTerms(text, terms).map((segment, i) => {
        if (segment.termIndex === undefined) {
          return <span key={i}>{segment.text}</span>;
        }
        const index = segment.termIndex;
        const isOpen = tip.openIndex === index;
        return (
          <button
            key={i}
            ref={(el) => tip.setAnchor(index, el)}
            type="button"
            className={isOpen ? 'question-term open' : 'question-term'}
            aria-describedby={isOpen ? tooltipId : undefined}
            onMouseEnter={() => tip.show(index)}
            onMouseLeave={tip.scheduleHide}
            onFocus={() => tip.show(index)}
            onBlur={tip.scheduleHide}
            onClick={() => tip.toggle(index)}
          >
            {segment.text}
          </button>
        );
      })}
      {tip.openIndex !== null && anchor && (
        <TermTooltip
          id={tooltipId}
          term={terms[tip.openIndex]}
          anchor={anchor}
          tooltipRef={tip.tooltipRef}
          onMouseEnter={tip.cancelHide}
          onMouseLeave={tip.scheduleHide}
        />
      )}
    </>
  );
}

interface TermTooltipProps {
  id: string;
  term: QuestionTerm;
  anchor: HTMLElement;
  tooltipRef: RefObject<HTMLDivElement>;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

// Renderiza no <body>: o card da pergunta tem overflow: hidden e cortaria o balão.
function TermTooltip({ id, term, anchor, tooltipRef, onMouseEnter, onMouseLeave }: TermTooltipProps) {
  const [placement, setPlacement] = useState<Placement | null>(null);

  useLayoutEffect(() => {
    const place = () => {
      const tip = tooltipRef.current;
      if (!tip) return;
      // Vertical: abaixo (ou acima) da pergunta inteira, para não cobrir as outras
      // linhas do enunciado. Horizontal: alinhado ao termo.
      const term = anchor.getBoundingClientRect();
      const block = (anchor.closest('h2') ?? anchor).getBoundingClientRect();
      const rect = { top: block.top, bottom: block.bottom, left: term.left, width: term.width };
      setPlacement(
        placeTooltip(rect, tip.getBoundingClientRect(), { width: window.innerWidth, height: window.innerHeight })
      );
    };
    place();
    window.addEventListener('scroll', place, true);
    window.addEventListener('resize', place);
    return () => {
      window.removeEventListener('scroll', place, true);
      window.removeEventListener('resize', place);
    };
  }, [anchor, term, tooltipRef]);

  const style = {
    top: placement?.top ?? 0,
    left: placement?.left ?? 0,
    visibility: placement ? 'visible' : 'hidden',
    '--arrow-left': `${placement?.arrowLeft ?? 0}px`
  } as CSSProperties;

  return createPortal(
    <div
      ref={tooltipRef}
      id={id}
      role="tooltip"
      className="question-term-tip"
      data-placement={placement?.above ? 'above' : 'below'}
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <strong>{term.term}</strong>
      <span>{term.definition}</span>
    </div>,
    document.body
  );
}
