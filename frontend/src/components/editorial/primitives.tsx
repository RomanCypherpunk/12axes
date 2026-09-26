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

export function ShareImageIcon() {
  return (
    <svg className="e-arr" viewBox="0 0 24 24" aria-hidden="true" style={{ fill: 'currentColor', stroke: 'none' }}>
      <path d="M22.71 6.29a1 1 0 0 0-1.42 0L20 7.59V2a1 1 0 0 0-2 0v5.59l-1.29-1.3a1 1 0 0 0-1.42 1.42l3 3a1 1 0 0 0 .33.21a.94.94 0 0 0 .76 0a1 1 0 0 0 .33-.21l3-3a1 1 0 0 0 0-1.42M19 13a1 1 0 0 0-1 1v.38l-1.48-1.48a2.79 2.79 0 0 0-3.93 0l-.7.7l-2.48-2.48a2.85 2.85 0 0 0-3.93 0L4 12.6V7a1 1 0 0 1 1-1h8a1 1 0 0 0 0-2H5a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3v-5a1 1 0 0 0-1-1M5 20a1 1 0 0 1-1-1v-3.57l2.9-2.9a.79.79 0 0 1 1.09 0l3.17 3.17l4.3 4.3Zm13-1a.9.9 0 0 1-.18.53L13.31 15l.7-.7a.77.77 0 0 1 1.1 0L18 17.21Z" />
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
