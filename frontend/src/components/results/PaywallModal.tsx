import type { CSSProperties } from 'react';
import { t } from '../../i18n';
import { catStyle } from '../../utils/ideologyColors';
import { InfoSheet } from './InfoSheet';
import { PaymentIcons } from './PaymentIcons';
import type { PremiumAccess } from './usePremiumAccess';

/**
 * Última parada antes do pagamento: tudo o que o Relatório completo traz, o preço e o botão que leva ao checkout da
 * Stripe. Abre ao clicar em qualquer convite ("Desbloquear o relatório completo"). Usa a cor da categoria do resultado
 * (o modal vive fora da página, por isso recebe a cor por aqui).
 */
export function PaywallModal({ access, category, onClose }: { access: PremiumAccess; category: string; onClose: () => void }) {
  const { state, purchase } = access;
  const busy = state.status === 'locked' && state.busy;
  const problem = state.status === 'locked' ? state.problem : null;

  return (
    <InfoSheet titleId="paywall-modal-title" className="e-paywall-modal" style={catStyle(category) as CSSProperties} onClose={onClose}>
      <div className="e-pm-main">
        <span className="e-tag e-tag-cat">{t.paywallModalTag}</span>
        <h2 id="paywall-modal-title">{t.paywallModalTitle}</h2>
        <p className="e-pm-lead">{t.paywallModalLead}</p>
        <p className="e-paywall-price">
          <strong>{t.paywallPrice}</strong>
        </p>
        <button className="e-btn e-btn-primary" type="button" onClick={purchase} disabled={busy}>
          {t.paywallCta}
          <svg className="e-arr" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12h14" />
            <path d="m13 6 6 6-6 6" />
          </svg>
        </button>
        <p className="e-pm-guarantee">{t.paywallGuarantee}</p>
        <PaymentIcons label={t.paywallPayWith} />
        {problem && (
          <p className="inline-error" role="alert">
            {t.paywallProblems[problem]}
          </p>
        )}
      </div>
      <div className="e-pm-list">
        <p className="e-pm-list-title">{t.paywallIncludesTitle}</p>
        <ul>
          {t.paywallIncludes.map((item) => (
            <li key={item.lead}>
              <strong>{item.lead}</strong> {item.text}
            </li>
          ))}
        </ul>
      </div>
    </InfoSheet>
  );
}
