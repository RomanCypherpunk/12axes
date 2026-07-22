import { useState } from 'react';
import { t } from '../i18n';
import { copyToClipboard } from '../utils/clipboard';
import { BitcoinIcon, EthereumIcon, LightningIcon, MoneroIcon } from './CryptoIcons';

const COIN_ICONS: Record<string, () => JSX.Element> = {
  btc: BitcoinIcon,
  lightning: LightningIcon,
  eth: EthereumIcon,
  xmr: MoneroIcon
};

const ADDRESS_HEAD = 8;
const ADDRESS_TAIL = 6;
const EMAIL_MAX = 22;

function truncateAddress(address: string) {
  if (address.includes('@')) {
    return address.length > EMAIL_MAX ? `${address.slice(0, EMAIL_MAX)}…` : address;
  }
  if (address.length <= ADDRESS_HEAD + ADDRESS_TAIL + 1) {
    return address;
  }
  return `${address.slice(0, ADDRESS_HEAD)}…${address.slice(-ADDRESS_TAIL)}`;
}

export function SupportSection() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function handleCopy(id: string, address: string) {
    const ok = await copyToClipboard(address);
    if (!ok) {
      return;
    }
    setCopiedId(id);
    window.setTimeout(() => {
      setCopiedId((current) => (current === id ? null : current));
    }, 1800);
  }

  return (
    <section className="support-section" id="apoie" aria-labelledby="apoie-titulo">
      <div className="support-heading">
        <span className="eyebrow">{t.supportEyebrow}</span>
        <h2 id="apoie-titulo">
          {t.supportTitle}
          <em>{t.supportTitleEm}</em>
        </h2>
        <p>{t.supportLead}</p>
        <div className="support-privacy-note">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="5" y="11" width="14" height="9" rx="2" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
          </svg>
          {t.supportPrivacyNote}
        </div>
      </div>

      <ul className="support-list">
        {t.supportCoins.map((coin) => {
          const Icon = COIN_ICONS[coin.id];
          const isCopied = copiedId === coin.id;
          return (
            <li className="support-row" key={coin.id}>
              <span className="support-row-icon" aria-hidden="true">
                <Icon />
              </span>
              <div className="support-row-name">
                <strong>{coin.name}</strong>
                <span>{coin.network}</span>
              </div>
              <button
                className="support-row-address"
                type="button"
                onClick={() => void handleCopy(coin.id, coin.address)}
                aria-label={t.supportCopyAria(`${coin.name} (${coin.network})`)}
              >
                <span className="support-row-address-text">{truncateAddress(coin.address)}</span>
                <span className="support-row-copy-icon" data-copied={isCopied} aria-hidden="true">
                  {isCopied ? (
                    <svg viewBox="0 0 24 24">
                      <path d="m5 12 5 5L20 7" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24">
                      <rect x="9" y="9" width="12" height="12" rx="2" />
                      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
                    </svg>
                  )}
                </span>
              </button>
              <span className="support-row-feedback" data-visible={isCopied} role="status">
                {t.supportCopied}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
