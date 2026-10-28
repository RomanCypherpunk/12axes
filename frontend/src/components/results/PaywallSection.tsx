import { t } from '../../i18n';
import { LockIcon } from './LockIcon';
import type { PremiumAccess } from './usePremiumAccess';

// O fundo é só enfeite: o título de cada seção do relatório aparece nítido e, embaixo, formas genéricas desfocadas (sem
// nenhum dado do usuário).
const DECOY_AXES = [0, 1, 2];
const DECOY_ROWS = [0, 1, 2];
const DECOY_LIST = [0, 1, 2, 3, 4, 5];
const SEATS = Array.from({ length: 9 }, (_, i) => {
  const angle = ((-90 + i * 40) * Math.PI) / 180;
  return { left: `${50 + 40 * Math.cos(angle)}%`, top: `${50 + 40 * Math.sin(angle)}%` };
});

function Decoy() {
  const [axes, disagree, government, timeline, countries] = t.paywallPreviewTitles;
  return (
    <div className="e-paywall-bg" aria-hidden="true">
      <div className="e-pw-block">
        <h3 className="e-pw-head">{axes}</h3>
        <div className="e-pw-body">
          {DECOY_AXES.map((i) => (
            <div key={i} className="e-pw-axis">
              <span className="e-pw-bar e-pw-line" />
              <span className="e-pw-track" />
              <span className="e-pw-bar e-pw-line e-pw-short" />
              <span className="e-pw-bar e-pw-line" />
            </div>
          ))}
        </div>
      </div>
      <div className="e-pw-block">
        <h3 className="e-pw-head">{disagree}</h3>
        <div className="e-pw-body e-pw-split">
          <span className="e-pw-photo" />
          <span className="e-pw-card">
            <span className="e-pw-bar e-pw-line e-pw-short" />
            <span className="e-pw-bar e-pw-big" />
            <span className="e-pw-bar e-pw-line" />
            <span className="e-pw-track" />
          </span>
        </div>
      </div>
      <div className="e-pw-block">
        <h3 className="e-pw-head">{government}</h3>
        <div className="e-pw-body e-pw-round">
          <span className="e-pw-table" />
          {SEATS.map((seat, i) => (
            <span key={i} className="e-pw-seat" style={seat} />
          ))}
        </div>
      </div>
      <div className="e-pw-block">
        <h3 className="e-pw-head">{timeline}</h3>
        <div className="e-pw-body">
          {DECOY_ROWS.map((i) => (
            <div key={i} className="e-pw-row">
              <span className="e-pw-dot e-pw-small" />
              <span className="e-pw-bar e-pw-line" />
              <span className="e-pw-bar e-pw-line e-pw-short" />
            </div>
          ))}
        </div>
      </div>
      <div className="e-pw-block">
        <h3 className="e-pw-head">{countries}</h3>
        <div className="e-pw-body e-pw-list">
          {DECOY_LIST.map((i) => (
            <div key={i} className="e-pw-row">
              <span className="e-pw-dot e-pw-small" />
              <span className="e-pw-bar e-pw-line" />
              <span className="e-pw-bar e-pw-line e-pw-short" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Convite ao Relatório completo: o relatório "ao fundo", desfocado, e o cartão da compra no centro (preço, botão e o
 * reembolso). Só aparece sem acesso.
 */
export function PaywallSection({ access, onOpen }: { access: PremiumAccess; onOpen: () => void }) {
  const { state, retry } = access;
  if (state.status === 'off' || state.status === 'unlocked') return null;

  if (state.status === 'checking') {
    return (
      <section className="e-panel e-paywall-checking" id="relatorio-completo" aria-busy="true">
        <h2>{t.paywallTitle}</h2>
        <p className="e-paywall-note" role="status">{t.paywallChecking}</p>
      </section>
    );
  }

  const problem = state.problem;
  return (
    <section className="e-paywall" id="relatorio-completo" data-reveal>
      <Decoy />
      <div className="e-paywall-card">
        <span className="e-paywall-lock" aria-hidden="true">
          <LockIcon />
        </span>
        <h2>{t.paywallUnlockTitle}</h2>
        <p className="e-paywall-lead">{t.paywallLead}</p>
        <button className="e-btn e-btn-primary" type="button" onClick={onOpen}>
          {t.paywallCta}
        </button>
        {problem && (
          <p className="inline-error" role="alert">
            {t.paywallProblems[problem]}{' '}
            {problem !== 'denied' && (
              <button className="e-btn e-btn-ghost e-btn-sm" type="button" onClick={retry}>
                {t.paywallRetry}
              </button>
            )}
          </p>
        )}
      </div>
    </section>
  );
}
