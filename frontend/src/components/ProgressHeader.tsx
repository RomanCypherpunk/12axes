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
        <strong>{percent}% concluido</strong>
      </div>
      <div className="progress-track" aria-label={`Progresso: ${percent}%`}>
        <span style={{ width: `${percent}%` }} />
      </div>
    </header>
  );
}
