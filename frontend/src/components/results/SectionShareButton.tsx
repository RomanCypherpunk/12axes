import type { KeyboardEvent, MouseEvent } from 'react';
import { t } from '../../i18n';
import { PoleIcon } from '../AxisIcon';

/** Os cartões de compartilhamento que uma seção da página pode gerar. */
export type ShareKind = 'countries' | 'personalities' | 'parties' | 'compass' | 'government' | 'timeline' | 'living';

const LABELS: Record<ShareKind, () => string> = {
  countries: () => t.shareCountriesCta,
  personalities: () => t.sharePersonalitiesCta,
  parties: () => t.sharePartiesCta,
  compass: () => t.shareCompassCta,
  government: () => t.shareGovernmentCta,
  timeline: () => t.shareTimelineCta,
  living: () => t.shareLivingCta
};

// Os ícones: países usa a bandeira do polo "Protecionismo"; os outros são traços simples, no mesmo estilo dos ícones dos botões.
function ShareIcon({ kind }: { kind: ShareKind }) {
  if (kind === 'countries') {
    return <PoleIcon axisId="comercio" side="left" className="e-arr" />;
  }
  return (
    <svg className="e-arr" viewBox="0 0 24 24" aria-hidden="true">
      {kind === 'personalities' && (
        <>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21a8 8 0 0 1 16 0" />
        </>
      )}
      {kind === 'parties' && (
        <>
          <path d="M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
          <path d="M16 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
          <path d="M3 20a5 5 0 0 1 10 0" />
          <path d="M11 20a5 5 0 0 1 10 0" />
        </>
      )}
      {kind === 'compass' && (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="m15.5 8.5-2 5-5 2 2-5z" />
        </>
      )}
      {kind === 'government' && (
        <>
          <path d="M5 11h14" />
          <path d="M7 11v8" />
          <path d="M17 11v8" />
          <path d="M12 5v14" />
          <path d="M4 19h16" />
          <path d="m12 4 8 4H4z" />
        </>
      )}
      {kind === 'timeline' && (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </>
      )}
      {kind === 'living' && (
        <>
          <path d="m3 11 9-8 9 8" />
          <path d="M5 10v10h14V10" />
          <path d="M10 20v-6h4v6" />
        </>
      )}
    </svg>
  );
}

// Dentro de uma seção que é toda clicável (a bússola abre a explicação), o botão não pode acionar o clique nem o teclado dela.
const stop = (event: MouseEvent | KeyboardEvent) => event.stopPropagation();

interface SectionShareButtonProps {
  kind: ShareKind;
  sharing: boolean;
  error: string | null;
  onShare: () => void;
}

/** O botão que gera e compartilha o cartão da seção: embaixo dela, centralizado, com o texto e o ícone do cartão. */
export function SectionShareButton({ kind, sharing, error, onShare }: SectionShareButtonProps) {
  return (
    <div className="e-sec-share-foot" onClick={stop} onKeyDown={stop}>
      <button className="e-btn e-btn-ghost e-btn-sm" type="button" onClick={onShare} disabled={sharing}>
        {sharing ? t.generatingPng : LABELS[kind]()}
        <ShareIcon kind={kind} />
      </button>
      {error && (
        <p className="inline-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
