import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { t } from '../../i18n';

interface InfoSheetProps {
  /** id do título dentro de `children`, para o aria-labelledby do diálogo. */
  titleId: string;
  style?: CSSProperties;
  onClose: () => void;
  children: ReactNode;
}

// Aba de detalhes: sobe de baixo no mobile e vira janela central no desktop.
// Renderiza no <body> para escapar de transforms das seções com data-reveal.
export function InfoSheet({ titleId, style, onClose, children }: InfoSheetProps) {
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
        className="e-axis-sheet"
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

interface InfoButtonProps {
  label: string;
  onClick: () => void;
  className?: string;
}

export function InfoButton({ label, onClick, className = 'e-axis-info' }: InfoButtonProps) {
  return (
    <button className={className} type="button" onClick={onClick} aria-label={label}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          fillRule="evenodd"
          d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10m0-2a8 8 0 1 0 0-16a8 8 0 0 0 0 16m-1-4h2v2h-2zm0-1.992s2-.008 2 0C13 13.006 16 12 16 10c0-2.21-1.773-4-3.991-4A4 4 0 0 0 8 10h2c0-1.1.9-2 2-2s2 .9 2 2c0 .9-3 2.367-3 4.008"
        />
      </svg>
    </button>
  );
}
