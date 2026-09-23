import { useState } from 'react';
import { t } from '../i18n';
import { copyToClipboard } from '../utils/clipboard';
import { BitcoinIcon, EthereumIcon, LightningIcon, MoneroIcon } from './CryptoIcons';

const COIN_ICONS = {
  btc: BitcoinIcon,
  lightning: LightningIcon,
  eth: EthereumIcon,
  xmr: MoneroIcon
} as const;

interface SupportSectionProps {
  variant: 'home' | 'panel';
}

export function SupportSection({ variant }: SupportSectionProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function handleCopy(id: string, address: string) {
    if (!(await copyToClipboard(address))) {
      return;
    }
    setCopiedId(id);
    window.setTimeout(() => {
      setCopiedId((current) => (current === id ? null : current));
    }, 1800);
  }

  const box = (
    <>
      <div>
        <p className="e-eyebrow">{t.supportEyebrow}</p>
        <h2 id="apoie-titulo">
          {t.supportTitle}
          <span className="e-accent">{t.supportTitleEm}</span>
        </h2>
        <p className="e-lead">{t.supportLead}</p>
        <p className="e-privacy">
          <svg className="e-ico" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 3 5 6v5c0 4.2 2.7 7.9 7 10 4.3-2.1 7-5.8 7-10V6l-7-3Z" />
            <path d="m9 12 2 2 4-5" />
          </svg>
          {t.supportPrivacyNote}
        </p>
      </div>
      <ul className="e-coins">
        {t.supportCoins.map((coin) => {
          const copied = copiedId === coin.id;
          const CoinIcon = COIN_ICONS[coin.id as keyof typeof COIN_ICONS];
          return (
            <li className="e-coin" key={coin.id}>
              <span className="e-coin-sym" aria-hidden="true">{CoinIcon && <CoinIcon />}</span>
              <div className="e-coin-name">
                <strong>{coin.name}</strong>
                <span>{coin.network}</span>
              </div>
              <code>{coin.address}</code>
              <button
                className={copied ? 'e-copy e-ok' : 'e-copy'}
                type="button"
                onClick={() => void handleCopy(coin.id, coin.address)}
                aria-label={t.supportCopyAria(`${coin.name} (${coin.network})`)}
              >
                <svg className="e-ico" viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="9" y="9" width="11" height="11" rx="2" />
                  <path d="M5 15V5a1 1 0 0 1 1-1h10" />
                </svg>
                <span>{copied ? t.supportCopied : t.supportCopy}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </>
  );

  if (variant === 'panel') {
    return (
      <section className="e-panel e-support-panel" id="apoie" aria-labelledby="apoie-titulo">
        <div className="e-support-box">{box}</div>
      </section>
    );
  }

  return (
    <section className="e-sec" id="apoie" aria-labelledby="apoie-titulo">
      <div className="e-wrap e-support-box">{box}</div>
    </section>
  );
}
