import { useState, type CSSProperties, type ReactNode } from 'react';
import { t } from '../../i18n';
import { NEW_ISSUE_URL } from '../../data/repo';
import { tokens } from '../../styles/tokens.generated';
import { ratingTier } from '../../utils/agreement';

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
        <nav className="e-foot-links" aria-label={t.feedbackTitle}>
          <a className="e-btn e-btn-ghost e-btn-sm" href={NEW_ISSUE_URL} target="_blank" rel="noopener noreferrer">
            {t.feedbackReport}
          </a>
          <a className="e-btn e-btn-ghost e-btn-sm" href={NEW_ISSUE_URL} target="_blank" rel="noopener noreferrer">
            {t.feedbackSuggest}
          </a>
        </nav>
      </div>
    </footer>
  );
}

export function Football({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden="true">
      <circle cx="20" cy="20" r="18" fill="var(--ball-white)" stroke="var(--ball-black)" strokeWidth="1.5" />
      <path d="M20 13.5l6.2 4.5-2.4 7.3h-7.6l-2.4-7.3z" fill="var(--ball-black)" />
      <path
        d="M20 13.5V2.5M26.2 18l10.4-3.4M23.8 25.3l6.4 8.8M16.2 25.3l-6.4 8.8M13.8 18L3.4 14.6"
        stroke="var(--ball-black)"
        strokeWidth="1.5"
        fill="none"
      />
      <path d="M16 2.9l4-.4 4 .4-4 3z M35.2 10.8l1.6 3.5.4 4.1-3.1-3.4z M31.4 33.8l-3.3 2.3-3.9 1.2 2.1-4.2z M15.8 37.3l-3.9-1.2-3.3-2.3 5.1.7z M2.8 18.4l.4-4.1 1.6-3.5 1.1 4.2z" fill="var(--ball-black)" />
    </svg>
  );
}

export function PitchMarkings() {
  return (
    <svg className="e-pitch" viewBox="0 0 1200 760" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g fill="none" stroke="var(--pitch-line)" strokeWidth="3">
        <rect x="30" y="30" width="1140" height="700" />
        <line x1="600" y1="30" x2="600" y2="730" />
        <circle cx="600" cy="380" r="95" />
        <rect x="30" y="190" width="180" height="380" />
        <rect x="30" y="290" width="60" height="180" />
        <path d="M210 315a95 95 0 0 1 0 130" />
        <rect x="990" y="190" width="180" height="380" />
        <rect x="1110" y="290" width="60" height="180" />
        <path d="M990 315a95 95 0 0 0 0 130" />
        <path d="M30 48a18 18 0 0 0 18-18M1152 30a18 18 0 0 0 18 18M1170 712a18 18 0 0 0-18 18M48 730a18 18 0 0 0-18-18" />
      </g>
      <g fill="var(--pitch-line)">
        <circle cx="600" cy="380" r="6" />
        <circle cx="150" cy="380" r="5" />
        <circle cx="1050" cy="380" r="5" />
      </g>
    </svg>
  );
}

export function RatingBadge({ value }: { value: number }) {
  const rounded = Math.round(value);
  return (
    <span className="e-rating" data-tier={ratingTier(rounded)}>
      {rounded}
    </span>
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
        <circle cx={center} cy={center} r={radius} fill="none" stroke={tokens['ink-100']} strokeWidth={stroke} />
        <circle
          className="e-ring-arc"
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
