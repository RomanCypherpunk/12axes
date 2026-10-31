import { useState, type CSSProperties, type FormEvent } from 'react';
import { LANG, t } from '../../i18n';
import { isValidEmail, loadBuyerEmail, saveBuyerEmail } from '../../utils/buyerEmail';
import { catStyle } from '../../utils/ideologyColors';
import { InfoSheet } from './InfoSheet';
import { PaymentIcons } from './PaymentIcons';
import type { PremiumAccess } from './usePremiumAccess';

/**
 * Última parada antes do pagamento: tudo o que o Relatório completo traz, o preço e o botão que leva ao checkout do
 * Mercado Pago. Abre ao clicar em qualquer convite ("Desbloquear o relatório completo"). Usa a cor da categoria do resultado
 * (o modal vive fora da página, por isso recebe a cor por aqui).
 */
export function PaywallModal({ access, category, onClose }: { access: PremiumAccess; category: string; onClose: () => void }) {
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
        <h2 id="paywall-modal-title">{t.paywallModalTitle}</h2>
        <p className="e-pm-lead">{t.paywallModalLead}</p>
        <p className="e-paywall-price">
          <strong>{t.paywallPrice}</strong>
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
          <button className="e-btn e-btn-primary" type="submit" disabled={busy}>
            {busy ? t.paywallOpening : t.paywallCta}
            <svg className="e-arr" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12h14" />
              <path d="m13 6 6 6-6 6" />
            </svg>
          </button>
        </form>
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
