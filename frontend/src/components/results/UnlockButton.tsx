import { t } from '../../i18n';
import { UnlockIcon } from './LockIcon';

/** O botão que fica por cima de uma parte desfocada do relatório e abre a compra. */
export function UnlockButton({ onClick, label = t.paywallCta, className = '' }: { onClick: () => void; label?: string; className?: string }) {
  return (
    <button className={`e-pw-unlock ${className}`.trim()} type="button" onClick={onClick}>
      <UnlockIcon />
      {label}
    </button>
  );
}
