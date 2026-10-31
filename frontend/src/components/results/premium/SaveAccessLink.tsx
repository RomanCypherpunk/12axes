import { useEffect, useRef, useState } from 'react';
import { LANG } from '../../../i18n';
import { accessLink, canonicalResultLink } from '../../../utils/entitlement';
import { copyToClipboard } from '../../../utils/clipboard';
import { resultUrlWithoutPaymentParams } from '../usePremiumAccess';
import { P } from './premiumText';

/**
 * Última seção do Relatório completo na página (fora do PDF): o link que reabre o relatório em outro aparelho. O recibo
 * do pagamento não leva esse link, então a pessoa o guarda aqui.
 */
export function SaveAccessLink({ token }: { token: string }) {
  return (
    <section className="e-panel e-prem e-prem-save" id="salvar-acesso">
      <h2>{P.saveTitle}</h2>
      <p className="e-prem-intro">{P.saveIntro}</p>
      <AccessLinkField token={token} />
    </section>
  );
}

/** O link que reabre o relatório (o endereço do resultado com o acesso no fragmento) e a ação de copiá-lo; `copied` fica ligado por um instante. */
export function useCopyAccessLink(token: string): { link: string; copied: boolean; copy: () => Promise<void> } {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | null>(null);
  const link = accessLink(canonicalResultLink(resultUrlWithoutPaymentParams(), LANG), token);

  useEffect(() => () => {
    if (timer.current !== null) window.clearTimeout(timer.current);
  }, []);

  const copy = async () => {
    if (!(await copyToClipboard(link))) return;
    setCopied(true);
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2400);
  };

  return { link, copied, copy };
}

/** O link de acesso num campo com o botão de copiar. */
export function AccessLinkField({ token }: { token: string }) {
  const { link, copied, copy } = useCopyAccessLink(token);

  return (
    <div className="e-prem-save-row">
      <input className="e-prem-save-field" type="text" readOnly value={link} aria-label={P.saveField} onFocus={(event) => event.currentTarget.select()} />
      <button className="e-btn e-btn-primary" type="button" onClick={copy} aria-live="polite">
        {copied ? P.saveCopied : P.saveCopy}
      </button>
    </div>
  );
}
