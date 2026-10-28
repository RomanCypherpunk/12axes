import { t } from '../../i18n';
import { personalityInitials } from '../../utils/personalityImage';

// Peças compartilhadas pelas páginas do relatório em PDF (as grátis e as do Relatório completo).
export function Logo() {
  return (
    <span className="logo">
      <b>12</b> axes
    </span>
  );
}

export function PageHeader({ topName }: { topName: string }) {
  return (
    <header className="ph">
      <Logo />
      <span>{t.report.headerLabel(topName)}</span>
    </header>
  );
}

export function SectionHead({ title }: { title: string }) {
  return (
    <div className="sh">
      <h2>{title}</h2>
    </div>
  );
}

// Retrato/bandeira com iniciais no lugar quando a imagem não existe.
export function Img({ className, src, name }: { className: string; src: string; name: string }) {
  if (!src) {
    return <div className={`${className} ini`}>{personalityInitials(name)}</div>;
  }
  return <img className={className} src={src} alt="" />;
}

export function Ring({ value, size, stroke }: { value: number; size: number; stroke: number }) {
  const center = size / 2;
  const radius = center - stroke / 2 - 0.5;
  const circumference = 2 * Math.PI * radius;
  const arc = (Math.max(0, Math.min(100, value)) / 100) * circumference;
  return (
    <div className="ring" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`}>
        <circle cx={center} cy={center} r={radius} fill="none" stroke="var(--ring-bg)" strokeWidth={stroke} />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="var(--ring)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${arc} ${circumference}`}
          transform={`rotate(-90 ${center} ${center})`}
        />
      </svg>
      <div>
        <b>{Math.round(value)}%</b>
        <small>{t.matchWord}</small>
      </div>
    </div>
  );
}
