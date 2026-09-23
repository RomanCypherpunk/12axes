import { useState, type CSSProperties, type ReactNode } from 'react';
import { t } from '../../i18n';

export function Logo({ onClick }: { onClick?: () => void }) {
  const content = (
    <>
      <b>12</b>
      <span>axes</span>
    </>
  );
  if (!onClick) {
    return <span className="e-logo">{content}</span>;
  }
  return (
    <button className="e-logo" type="button" onClick={onClick} aria-label={t.backToStartAria}>
      {content}
    </button>
  );
}

export function SiteFooter() {
  return (
    <footer className="ed e-foot">
      <div className="e-wrap">
        <Logo />
        <p>{t.footerTagline}</p>
      </div>
    </footer>
  );
}

export function ArrowIcon() {
  return (
    <svg className="e-arr" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export function ClockIcon() {
  return (
    <svg className="e-ico" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function RefreshIcon() {
  return (
    <svg className="e-arr" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 11a8 8 0 1 0-2.3 5.7" />
      <path d="M20 4v7h-7" />
    </svg>
  );
}

export function DownloadIcon() {
  return (
    <svg className="e-arr" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 4v12" />
      <path d="m6 10 6 6 6-6" />
      <path d="M5 20h14" />
    </svg>
  );
}

interface RingProps {
  pct: number;
  size: number;
  stroke: number;
  sized?: boolean;
}

// Anel de compatibilidade: a cor vem de --c (cards de outras ideologias) ou --cat.
export function Ring({ pct, size, stroke, sized = true }: RingProps) {
  const value = Math.max(0, Math.min(100, pct));
  const center = size / 2;
  const radius = center - stroke / 2 - 1;
  const circumference = 2 * Math.PI * radius;
  const style: CSSProperties | undefined = sized ? { width: size, height: size } : undefined;

  return (
    <div className="e-ring" style={style} role="img" aria-label={t.compatibilityAria(value.toFixed(0))}>
      <svg viewBox={`0 0 ${size} ${size}`}>
        <circle cx={center} cy={center} r={radius} fill="none" stroke="#E2DDCF" strokeWidth={stroke} />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="var(--c, var(--cat))"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${((circumference * value) / 100).toFixed(1)} ${circumference.toFixed(1)}`}
        />
      </svg>
      <div>
        <strong>{value.toFixed(0)}%</strong>
        <small>{t.matchWord}</small>
      </div>
    </div>
  );
}

interface SafeImgProps {
  src: string;
  alt: string;
  className: string;
  fallback: ReactNode;
}

export function SafeImg({ src, alt, className, fallback }: SafeImgProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  if (!src || failedSrc === src) {
    return (
      <div
        className={className}
        role="img"
        aria-label={alt}
        style={{ display: 'grid', placeItems: 'center', background: 'var(--neutro)', fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--texto-suave)', textAlign: 'center', fontSize: 13 }}
      >
        {fallback}
      </div>
    );
  }
  return <img className={className} src={src} alt={alt} loading="lazy" onError={() => setFailedSrc(src)} />;
}

export function pct(value: number): number {
  return Math.round(Math.max(0, Math.min(100, value)));
}
