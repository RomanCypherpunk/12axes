interface ProgressHeaderProps {
  current: number;
  total: number;
}

export function ProgressHeader({ current, total }: ProgressHeaderProps) {
  const percent = total === 0 ? 0 : Math.round((current / total) * 100);

  return (
    <header className="progress-header">
      <div>
        <span className="eyebrow">Pergunta {current} de {total}</span>
        <strong>{percent}% concluído</strong>
      </div>
      <div
        className="progress-track"
        role="progressbar"
        aria-label={`Progresso do quiz: ${percent}%`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
      >
        <span aria-hidden="true" style={{ width: `${percent}%` }} />
      </div>
    </header>
  );
}
