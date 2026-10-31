import { useEffect, useRef, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { t } from '../../i18n';
import { catStyle, SPECTRUM_ORDER } from '../../utils/ideologyColors';
import { useCopyAccessLink } from './premium/SaveAccessLink';

// Todo mundo vê os mesmos balões, nas cores de todos os espectros: as 8 categorias, cada uma em tom forte e em tom pastel (16 cores).
const BALLOON_COLORS = SPECTRUM_ORDER.flatMap((color) => [color.base, color.bg]);

// Posição, tamanho, atraso e duração fixos (sem sorteio), para a cena ser a mesma a cada abertura. 32 balões: cada cor aparece duas vezes.
const BALLOONS = Array.from({ length: BALLOON_COLORS.length * 2 }, (_, index) => ({
  left: (index * 37 + 8) % 96,
  size: 46 + ((index * 17) % 36),
  delay: ((index * 0.23) % 1.9).toFixed(2),
  duration: (4.2 + ((index * 0.41) % 2.4)).toFixed(2),
  sway: index % 2 === 0 ? 1 : -1,
  color: BALLOON_COLORS[index % BALLOON_COLORS.length]
}));

/**
 * Aviso de que o pagamento foi confirmado e o Relatório completo abriu: balões subindo pela tela e um cartão com a cor
 * do espectro do resultado (a mesma identidade da página). Aparece uma vez, na volta do pagamento; fecha no botão, no Esc
 * ou ao clicar fora. Para quem pediu menos animação, os balões somem e o cartão fica.
 */
export function UnlockCelebration({ name, category, token, onClose }: { name: string; category: string; token: string | null; onClose: () => void }) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    buttonRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return createPortal(
    <div className="e-unlock" style={catStyle(category) as CSSProperties} onClick={onClose}>
      <div className="e-unlock-balloons" aria-hidden="true">
        {BALLOONS.map((balloon, index) => (
          <span
            key={index}
            className="e-balloon"
            style={
              {
                left: `${balloon.left}%`,
                '--balloon': balloon.color,
                '--size': `${balloon.size}px`,
                '--delay': `${balloon.delay}s`,
                '--dur': `${balloon.duration}s`,
                '--sway': balloon.sway
              } as CSSProperties
            }
          />
        ))}
      </div>
      <div className="e-unlock-card" role="dialog" aria-modal="true" aria-labelledby="unlock-title" onClick={(event) => event.stopPropagation()}>
        <span className="e-tag e-tag-solid">{t.unlockedTag}</span>
        <svg className="e-unlock-check" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <path d="m7.5 12.5 3 3 6-7" />
        </svg>
        <h2 id="unlock-title">{t.unlockedTitle}</h2>
        <p className="e-unlock-name">
          {category} · <strong>{name}</strong>
        </p>
        <p className="e-unlock-lead">{t.unlockedLead}</p>
        <button ref={buttonRef} className="e-btn e-btn-primary" type="button" onClick={onClose}>
          {t.unlockedCta}
        </button>
        {token && <CopyAccessButton token={token} />}
      </div>
    </div>,
    document.body
  );
}

/** Do tamanho do botão "Ver relatório": um toque copia o link de acesso (o que reabre o relatório em outro aparelho) para a área de transferência. */
function CopyAccessButton({ token }: { token: string }) {
  const { copied, copy } = useCopyAccessLink(token);
  return (
    <button className="e-btn e-btn-copy" type="button" onClick={copy} aria-live="polite">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        {copied ? (
          <path d="m5 12.5 4.5 4.5L19 7.5" />
        ) : (
          <>
            <rect x="9" y="9" width="11" height="11" rx="2" />
            <path d="M5 15V6a2 2 0 0 1 2-2h9" />
          </>
        )}
      </svg>
      {copied ? t.unlockedCopied : t.unlockedCopy}
    </button>
  );
}
