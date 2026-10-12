import { CRYPTO_BRAND_COLORS } from '../styles/componentColors';

export function PixIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path fill={CRYPTO_BRAND_COLORS.pix} d="M11.917 11.71a2.05 2.05 0 0 1-1.454-.602l-2.1-2.1a.4.4 0 0 0-.551 0l-2.108 2.108a2.04 2.04 0 0 1-1.454.602h-.414l2.66 2.66c.83.83 2.177.83 3.007 0l2.667-2.668zM4.25 4.282c.55 0 1.066.214 1.454.602l2.108 2.108a.39.39 0 0 0 .552 0l2.1-2.1a2.04 2.04 0 0 1 1.453-.602h.253L9.503 1.623a2.127 2.127 0 0 0-3.007 0l-2.66 2.66h.414z" />
      <path fill={CRYPTO_BRAND_COLORS.pix} d="m14.377 6.496l-1.612-1.612a.3.3 0 0 1-.114.023h-.733c-.379 0-.75.154-1.017.422l-2.1 2.1a1.005 1.005 0 0 1-1.425 0L5.268 5.32a1.45 1.45 0 0 0-1.018-.422h-.9a.3.3 0 0 1-.109-.021L1.623 6.496c-.83.83-.83 2.177 0 3.008l1.618 1.618a.3.3 0 0 1 .108-.022h.901c.38 0 .75-.153 1.018-.421L7.375 8.57a1.034 1.034 0 0 1 1.426 0l2.1 2.1c.267.268.638.421 1.017.421h.733q.06.001.114.024l1.612-1.612c.83-.83.83-2.178 0-3.008z" />
    </svg>
  );
}

export function BitcoinIcon() {
  return (
    <svg viewBox="2 2 20 20" aria-hidden="true">
      <path fill={CRYPTO_BRAND_COLORS.bitcoin} d="M14.24 10.56c-.31 1.24-2.24.61-2.84.44l.55-2.18c.62.18 2.61.44 2.29 1.74m-3.11 1.56l-.6 2.41c.74.19 3.03.92 3.37-.44c.36-1.42-2.03-1.79-2.77-1.97m10.57 2.3c-1.34 5.36-6.76 8.62-12.12 7.28S.963 14.94 2.3 9.58A9.996 9.996 0 0 1 14.42 2.3c5.35 1.34 8.61 6.76 7.28 12.12m-7.49-6.37l.45-1.8l-1.1-.25l-.44 1.73c-.29-.07-.58-.14-.88-.2l.44-1.77l-1.09-.26l-.45 1.79c-.24-.06-.48-.11-.7-.17l-1.51-.38l-.3 1.17s.82.19.8.2c.45.11.53.39.51.64l-1.23 4.93c-.05.14-.21.32-.5.27c.01.01-.8-.2-.8-.2L6.87 15l1.42.36c.27.07.53.14.79.2l-.46 1.82l1.1.28l.45-1.81c.3.08.59.15.87.23l-.45 1.79l1.1.28l.46-1.82c1.85.35 3.27.21 3.85-1.48c.5-1.35 0-2.15-1-2.66c.72-.19 1.26-.64 1.41-1.62c.2-1.33-.82-2.04-2.2-2.52" />
    </svg>
  );
}

export function LightningIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="16" r="16" fill={CRYPTO_BRAND_COLORS.lightning} />
      <path fill={CRYPTO_BRAND_COLORS.glyph} transform="translate(8 8)" d="M9.5 6.5L10 0H9L2 9.5h4.5L6 16h1l7-9.5z" />
    </svg>
  );
}

export function EthereumIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="16" r="16" fill={CRYPTO_BRAND_COLORS.ethereum} />
      <path fill={CRYPTO_BRAND_COLORS.glyph} transform="translate(8 8) scale(2)" d="M1 4.5L4 6l3-1.5L4 8M1 4l3-4l3 4l-3 1.5" />
    </svg>
  );
}

export function MoneroIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill={CRYPTO_BRAND_COLORS.monero} d="M12 0C5.365 0 0 5.373 0 12.015c0 1.335.228 2.607.618 3.81h3.577V5.729L12 13.545l7.805-7.815v10.095h3.577c.389-1.203.618-2.475.618-3.81C24 5.375 18.635 0 12 0m-1.788 15.307l-3.417-3.421v6.351H1.758C3.87 21.689 7.678 24 12 24s8.162-2.311 10.245-5.764h-5.04v-6.351l-3.386 3.421l-1.788 1.79l-1.814-1.79z" />
    </svg>
  );
}
