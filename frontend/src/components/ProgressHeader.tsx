import { t } from '../i18n';

interface ProgressHeaderProps {
  current: number;
  total: number;
}

export function ProgressHeader({ current, total }: ProgressHeaderProps) {
  const percent = total === 0 ? 0 : Math.round((current / total) * 100);

  return (
    <header className="progress-header">
      <div>
        <span className="eyebrow">{t.progress(current, total)}</span>
        <strong>{t.progressDone(percent)}</strong>
      </div>
      <div
        className="progress-track"
        role="progressbar"
        aria-label={t.progressAria(percent)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
      >
        <span aria-hidden="true" style={{ width: `${percent}%` }} />
      </div>
    </header>
  );
}
