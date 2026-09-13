import { t } from '../i18n';

interface ProgressHeaderProps {
  current: number;
  total: number;
  /** Perguntas por eixo, vindo do payload — marca cada eixo concluido. */
  questionsPerAxis?: number;
  /** Numero de eixos, usado quando o payload nao informa questionsPerAxis. */
  axisCount?: number;
}

export function ProgressHeader({ current, total, questionsPerAxis, axisCount }: ProgressHeaderProps) {
  const percent = total === 0 ? 0 : Math.round((current / total) * 100);

  // Pulso unico ao fechar um eixo. O passo vem do payload quando existe
  // (3 no curto, 5 no estendido); no modo completo o backend manda 0, entao
  // deriva-se de total/axisCount (240/12 = 20). Nunca um numero fixo.
  const step =
    questionsPerAxis && questionsPerAxis > 0
      ? questionsPerAxis
      : axisCount && axisCount > 0
        ? Math.round(total / axisCount)
        : 0;
  const isAxisComplete = step > 0 && current > 0 && current % step === 0 && current < total;

  return (
    <header className="progress-header">
      <div>
        <span className="eyebrow">{t.progress(current, total)}</span>
        <strong>{t.progressDone(percent)}</strong>
      </div>
      <div
        className="progress-track"
        data-axis-tick={isAxisComplete ? 'true' : undefined}
        role="progressbar"
        aria-label={t.progressAria(percent)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
      >
        {/* A barra nunca remonta: remontar mataria a transicao de largura
            justamente no eixo concluido, fazendo a barra saltar. */}
        <span aria-hidden="true" style={{ width: `${percent}%` }} />
        {/* O pulso e um no separado com key por posicao, para re-disparar a
            cada eixo fechado sem interferir na barra. */}
        {isAxisComplete && (
          <span key={`tick-${current}`} className="axis-tick" aria-hidden="true" style={{ left: `${percent}%` }} />
        )}
      </div>
    </header>
  );
}
