import { t } from '../i18n';

interface ProgressHeaderProps {
  current: number;
  total: number;
  /** Perguntas por eixo, vindo do payload. */
  questionsPerAxis?: number;
  /** Numero de eixos: define quantos segmentos a barra tem. */
  axisCount?: number;
}

export function ProgressHeader({ current, total, axisCount }: ProgressHeaderProps) {
  const percent = total === 0 ? 0 : Math.round((current / total) * 100);

  // Um segmento por pergunta quando cabe (ate axisCount); acima disso, um
  // segmento por bloco de perguntas (240/12 = 20), com preenchimento parcial.
  const segmentCount = Math.max(1, Math.min(total, axisCount && axisCount > 0 ? axisCount : 12));
  const perSegment = total / segmentCount;
  const answered = Math.max(0, current - 1);

  const label = t.progress(current, total);
  const splitAt = label.indexOf(' ');

  return (
    <header className="quiz-progress">
      <div className="quiz-progress-meta">
        <span>
          {splitAt > 0 ? (
            <>
              {label.slice(0, splitAt + 1)}
              <b>{label.slice(splitAt + 1)}</b>
            </>
          ) : (
            label
          )}
        </span>
        <span>{t.progressDone(percent)}</span>
      </div>
      <div
        className="quiz-progress-segs"
        role="progressbar"
        aria-label={t.progressAria(percent)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
      >
        {Array.from({ length: segmentCount }, (_, index) => {
          const start = index * perSegment;
          const end = start + perSegment;
          const isDone = answered >= end;
          const isNow = !isDone && current - 1 >= start && current - 1 < end;
          const fill = isDone ? 100 : isNow ? ((answered - start) / perSegment) * 100 : 0;
          return (
            <span key={index} className={isDone ? 'done' : isNow ? 'now' : undefined} aria-hidden="true">
              <i style={{ width: `${fill}%` }} />
            </span>
          );
        })}
      </div>
    </header>
  );
}
