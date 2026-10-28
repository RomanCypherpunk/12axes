import { useEffect, useRef, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { t } from '../../i18n';

interface InfoSheetProps {
  /** id do título dentro de `children`, para o aria-labelledby do diálogo. */
  titleId: string;
  style?: CSSProperties;
  /** Classe extra na aba, para variações de largura e espaçamento de uma seção específica. */
  className?: string;
  onClose: () => void;
  children: ReactNode;
}

// Aba de detalhes: sobe de baixo no mobile e vira janela central no desktop.
// Renderiza no <body> para escapar de transforms das seções com data-reveal.
export function InfoSheet({ titleId, style, className, onClose, children }: InfoSheetProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      previous?.focus();
    };
  }, [onClose]);

  return createPortal(
    <div className="e-axis-sheet-backdrop" onClick={onClose}>
      <div
        className={className ? `e-axis-sheet ${className}` : 'e-axis-sheet'}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        style={style}
        onClick={(event) => event.stopPropagation()}
      >
        <span className="e-axis-sheet-handle" aria-hidden="true" />
        <button ref={closeRef} className="e-axis-sheet-close" type="button" onClick={onClose} aria-label={t.closeLabel}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
}

/**
 * Torna um cartão inteiro clicável para abrir a aba de detalhes, sem botão "?": papel de botão, foco por teclado
 * (Enter e Espaço) e a classe e-clickable (cursor e anel de foco).
 */
export function clickableProps(label: string, onOpen: () => void) {
  return {
    className: 'e-clickable',
    role: 'button' as const,
    tabIndex: 0,
    'aria-haspopup': 'dialog' as const,
    'aria-label': label,
    onClick: onOpen,
    onKeyDown: (event: ReactKeyboardEvent<HTMLElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onOpen();
      }
    }
  };
}
