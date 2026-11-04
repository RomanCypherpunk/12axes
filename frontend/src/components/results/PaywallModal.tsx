import { useState, type CSSProperties, type FormEvent } from 'react';
import { LANG, t } from '../../i18n';
import { isValidEmail, loadBuyerEmail, saveBuyerEmail } from '../../utils/buyerEmail';
import { catStyle } from '../../utils/ideologyColors';
import { InfoSheet } from './InfoSheet';
import { UnlockIcon } from './LockIcon';
import { PaymentIcons } from './PaymentIcons';
import type { PremiumAccess } from './usePremiumAccess';

/**
 * Última parada antes do pagamento: tudo o que o Relatório completo traz, o preço e o botão que leva ao checkout do
 * Mercado Pago. Abre ao clicar em qualquer convite ("Desbloquear o relatório completo"). Usa a cor da categoria do resultado
 * (o modal vive fora da página, por isso recebe a cor por aqui).
 */
export type PaywallBlock = 'axes' | 'disagree' | 'government' | 'timeline' | 'countries' | 'final';
export type PaywallSource = 'areas' | 'pdf' | `section_${PaywallBlock}`;

interface PaywallModalProps {
  access: PremiumAccess;
  category: string;
  /** O convite que abriu o modal: quem vem do botão de PDF lê um título sobre o PDF. */
  source: PaywallSource;
  onClose: () => void;
}

export function PaywallModal({ access, category, source, onClose }: PaywallModalProps) {
  const { state, purchase } = access;
  const busy = state.status === 'locked' && state.busy;
  const problem = state.status === 'locked' ? state.problem : null;
  // Em reais o pagamento é da AbacatePay, que só recebe o e-mail do comprador (pedido aqui); em dólar a Paddle pede o dela.
  const needsEmail = LANG === 'pt';
  const [email, setEmail] = useState(loadBuyerEmail);
  const [emailInvalid, setEmailInvalid] = useState(false);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!needsEmail) return purchase();
    if (!isValidEmail(email)) return setEmailInvalid(true);
    saveBuyerEmail(email);
    purchase(email.trim());
  };

  return (
    <InfoSheet titleId="paywall-modal-title" className="e-paywall-modal" style={catStyle(category) as CSSProperties} onClose={onClose}>
      <div className="e-pm-main">
        <span className="e-tag e-tag-cat">{t.paywallModalTag}</span>
        <h2 id="paywall-modal-title">{source === 'pdf' ? t.paywallPdfTitle : t.paywallModalTitle}</h2>
        <p className="e-pm-lead">{source === 'pdf' ? t.paywallPdfLead : t.paywallModalLead}</p>
        <p className="e-paywall-price">
          <strong>{t.paywallPrice}</strong>
          <small>{t.paywallOnce}</small>
        </p>
        <form className="e-pm-form" onSubmit={submit} noValidate>
          {needsEmail && (
            <label className="e-pm-email">
              <span>{t.paywallEmailLabel}</span>
              <input
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder={t.paywallEmailPlaceholder}
                value={email}
                aria-invalid={emailInvalid}
                aria-describedby={emailInvalid ? 'paywall-email-note' : undefined}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setEmailInvalid(false);
                }}
              />
              {emailInvalid && (
                <small id="paywall-email-note" className="e-pm-email-error" role="alert">
                  {t.paywallEmailInvalid}
                </small>
              )}
            </label>
          )}
          <button className="e-btn e-btn-primary e-btn-wrap" type="submit" disabled={busy}>
            {busy ? (
              t.paywallOpening
            ) : (
              <>
                <UnlockIcon />
                {t.paywallCta}
              </>
            )}
          </button>
        </form>
        <p className="e-pm-guarantee">{t.paywallGuarantee}</p>
        <p className="e-pm-instant">{t.paywallInstant}</p>
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
